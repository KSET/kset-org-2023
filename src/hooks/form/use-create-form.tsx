import { zodResolver } from "@hookform/resolvers/zod";
import { isFunction } from "lodash";
import { toPairs } from "rambdax";
import {
  type ChangeEvent,
  Fragment,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
} from "react";
import {
  Controller,
  type Mode,
  useForm,
  useFormContext,
  type UseFormHandleSubmit,
} from "react-hook-form";
import { z, type ZodObject } from "zod";

import { type RecursivePartial } from "~/types/object";
import { dotGet } from "~/utils/object";

type FnOrVal<T> = T | (() => T);
type StateFnOrVal<TState, T> = T | ((state: TState) => T);

type BaseTypes = string | number | boolean | null | undefined;
type NonFunctionTypes =
  | BaseTypes
  | BaseTypes[]
  | Record<string | number | symbol, BaseTypes>
  | Record<string | number | symbol, BaseTypes>[];

export type FormInputType =
  | "text"
  | "textarea"
  | "select"
  | "radio-group"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "number"
  | "range"
  | "color"
  | "email"
  | "url"
  | "tel"
  | "search"
  | "password"
  | "file"
  | "image"
  | "hidden"
  | "reset";

type SelectOption = {
  label: ReactNode;
  value: string | null;
};

type FormInputSelect = {
  type: "select";
  options: FnOrVal<Readonly<SelectOption[]> | SelectOption[]>;
  placeholder?: string;
  meta?: RecursivePartial<{
    select: {
      search:
        | boolean
        | ((options: SelectOption[], value: string) => SelectOption[]);
      multiple: boolean;
    };
  }>;
};

type FormInputRadioGroup = {
  type: "radio-group";
  options: FnOrVal<Readonly<SelectOption[]>> | FnOrVal<SelectOption[]>;
  meta?: RecursivePartial<{
    radio: {
      label: string;
    };
  }>;
};

type FormInputCheckbox = {
  type: "checkbox" | "radio";
  meta?: RecursivePartial<{
    checkbox: {
      label: string;
    };
  }>;
};

type FormInputDefined =
  | FormInputSelect
  | FormInputRadioGroup
  | FormInputCheckbox;

type FormInputBase =
  | {
      type?: Exclude<FormInputType, FormInputDefined["type"]>;
      placeholder?: string;
    }
  | FormInputDefined;

export type FormInput<
  ValidatorSchema extends z.ZodSchema<unknown> = z.ZodSchema<unknown>,
> = FormInputBase & {
  validator: ValidatorSchema;
  isLoading?: boolean;
  label?: string;
  description?: string;
  hint?: string;
  meta?: RecursivePartial<FormInputMeta>;
};

type PropValidatorsOf<T extends Record<string, FormInput>> = {
  [Prop in keyof T]: T[Prop]["validator"];
};

type ReturnTypeOrValue<
  T extends FnOrVal<unknown> | FnOrVal<Readonly<unknown>>,
> = T extends () => infer R ? R : T;

type InferValidValues<T extends FormInput> = T extends FormInputSelect
  ? ReturnTypeOrValue<T["options"]>[number]["value"]
  : z.infer<T["validator"]>;

type FormInputMeta = {
  field: {
    className: string;
  };
  input: {
    className: string;
  };
  label: {
    className: string;
  };
};

export const useCreateForm = <
  T extends Record<string, FormInput>,
  PropValidators extends PropValidatorsOf<T>,
  KeyValuePairs extends { [Key in keyof T]: InferValidValues<T[Key]> },
>(
  x: T,
  {
    mode,
    refine,
    conditionalRender,
    fromContext,
    disabled,
    readonly,
    defaultValues,
  }: {
    mode?: Mode;
    refine?: <T extends ZodObject<PropValidators>>(x: T) => unknown;
    conditionalRender?: Partial<
      Record<keyof T, (data: KeyValuePairs) => boolean>
    >;
    fromContext?: boolean;
    disabled?: Partial<Record<keyof T, StateFnOrVal<KeyValuePairs, boolean>>>;
    readonly?: Partial<Record<keyof T, StateFnOrVal<KeyValuePairs, boolean>>>;
    defaultValues?: Partial<{
      [Key in keyof KeyValuePairs]: FnOrVal<KeyValuePairs[Key] | undefined>;
    }>;
  } = {
    mode: "onTouched",
    conditionalRender: {},
    fromContext: false,
    disabled: {} as Record<keyof T, never>,
    readonly: {} as Record<keyof T, never>,
    defaultValues: {} as Record<keyof KeyValuePairs, never>,
  },
) => {
  const baseId = useId();

  const form = x as typeof x & PropValidators;
  type Form = typeof form;
  const schema = z.object(
    Object.fromEntries(
      Object.entries(form).map(
        ([name, { validator }]) => [name, validator] as const,
      ),
    ) as unknown as PropValidators,
  );

  type Schema = z.infer<typeof schema>;

  const formDefaultValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(form)
          .map(([name, { validator }]) => {
            const defaultValue = defaultValues?.[name];

            if (defaultValue) {
              const value = (
                isFunction(defaultValue) ? defaultValue() : defaultValue
              ) as unknown;

              if (undefined !== value) {
                return [name, value] as const;
              }
            }

            if (validator.isOptional()) {
              const validatorDefault = validator.safeParse(undefined);
              if (validatorDefault.success) {
                return [name, validatorDefault.data] as const;
              }
            }

            return [name, null] as const;
          })
          .filter(([, value]) => null !== value),
      ) as KeyValuePairs,
    [defaultValues, form],
  );

  const _formContext = useFormContext<Schema>();
  const _form = useForm<Schema>({
    shouldUseNativeValidation: true,
    shouldUnregister: true,
    defaultValues: formDefaultValues as never,
    mode,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(refine ? (refine(schema) as never) : schema),
  });

  const useFormResult = fromContext ? _formContext : _form;

  const { watch } = useFormResult;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  const handleCallback = useCallback(
    <T extends NonFunctionTypes>(
      val: StateFnOrVal<KeyValuePairs, T> | FnOrVal<T> | undefined,
    ) => {
      if (isFunction(val)) {
        return val(watch() as KeyValuePairs);
      }

      return val;
    },
    [watch],
  );

  const shouldRenderElement = useCallback(
    (name: keyof T, values: KeyValuePairs) => {
      const handler = conditionalRender?.[name];

      if (!handler) {
        return true;
      }

      return handler(values);
    },
    [conditionalRender],
  );

  const itemId = useCallback(
    <TKey extends keyof T>(key: TKey, ...additions: string[]) =>
      `${String(key)}-${baseId}${
        0 < additions.length ? `-${additions.join("-")}` : ""
      }`,
    [baseId],
  );

  const renderInput = useCallback(
    <TKey extends keyof T>(key: TKey, value: Form[TKey]) => {
      const isDisabled =
        (value.isLoading! || handleCallback(disabled?.[key])) ?? false;
      const isReadonly = handleCallback(readonly?.[key]) ?? false;
      const isInvalid = key in useFormResult.formState.errors;
      const className = dotGet(value.meta, "input.className");

      switch (value.type) {
        case "textarea": {
          return (
            <Textarea
              className={className}
              defaultValue={useFormResult.getValues(key as never)}
              disabled={isDisabled}
              id={itemId(key)}
              isInvalid={isInvalid}
              placeholder={value.placeholder}
              readOnly={isReadonly}
              {...useFormResult.register(key as never)}
            />
          );
        }

        case "select": {
          const options: SelectOption[] =
            handleCallback(value.options as FnOrVal<never[]>) ?? [];

          return (
            <Select
              className={className}
              defaultValue={useFormResult.getValues(key as never)}
              disabled={isDisabled || isReadonly}
              id={itemId(key)}
              isInvalid={isInvalid}
              {...useFormResult.register(key as never)}
            >
              {value.placeholder ? (
                <option disabled>{value.placeholder}</option>
              ) : null}
              {options.map((option) => (
                <option key={option.value} value={option.value ?? undefined}>
                  {option.label}
                </option>
              ))}
            </Select>
          );
        }

        case "checkbox":
        case "radio": {
          const val = useFormResult.watch(key as never) as unknown as
            | string
            | boolean;

          return (
            <Checkbox
              className={className}
              defaultValue={useFormResult.getValues(key as never)}
              disabled={isDisabled}
              id={itemId(key)}
              isInvalid={isInvalid}
              readOnly={isReadonly}
              type={value.type}
              {...useFormResult.register(key as never)}
              checked={"yes" === val || true === val}
              onChange={(e) =>
                useFormResult.setValue(key as never, e.target.checked as never)
              }
            />
          );
        }

        case "radio-group": {
          const options: SelectOption[] =
            handleCallback(value.options as FnOrVal<never[]>) ?? [];

          const val = useFormResult.watch(key as never) as unknown as
            | string
            | boolean;

          return (
            <>
              {options.map((option) => (
                <Radio
                  key={option.value}
                  className={className}
                  defaultValue={useFormResult.getValues(key as never)}
                  disabled={isDisabled || isReadonly}
                  id={itemId(key)}
                  isInvalid={isInvalid}
                  {...useFormResult.register(key as never)}
                  checked={option.value === val}
                  onChange={(e) =>
                    useFormResult.setValue(
                      key as never,
                      e.target.checked as never,
                    )
                  }
                />
              ))}
            </>
          );
        }
      }

      return (
        <Controller
          control={useFormResult.control}
          name={key as never}
          render={({ field: { onChange, ...field }, formState: {} }) => (
            <TextInput
              className={className}
              disabled={isDisabled}
              id={itemId(key)}
              isInvalid={isInvalid}
              placeholder={value.placeholder}
              readOnly={isReadonly}
              type={value.type}
              width="auto"
              {...field}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if ("number" === value.type && "" !== e.target.value) {
                  return onChange(Number(e.target.value));
                }

                onChange(e.target.value);
              }}
            />
          )}
        />
      );
    },
    [disabled, handleCallback, itemId, readonly, useFormResult],
  );

  const renderElement = useCallback(
    <TKey extends keyof T>(key: TKey, value: Form[TKey]) => {
      const className = [
        $style.formField,
        dotGet(value.meta, "field.className"),
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <FormField
          className={className}
          description={value.description}
          hint={value.hint}
          id={itemId(key, "field")}
          isRequired={!value.validator.isOptional()}
          label={value.label ?? ""}
          labelFor={itemId(key)}
          validationMessage={useFormResult.formState.errors[key]?.message}
        >
          {renderInput(key, value)}
        </FormField>
      );
    },
    [itemId, renderInput, useFormResult.formState.errors],
  );

  return {
    ...useFormResult,
    form,
    schema,
    hasErrors: 0 < Object.keys(useFormResult.formState.errors).length,
    errorMessages: () =>
      toPairs(useFormResult.formState.errors)
        .map(([k, x]) => [k, x?.message ?? ""] as const)
        .filter(([, error]) => Boolean(error)),
    renderFields: <Key extends keyof T & string>(fields = [] as Key[]) => {
      const values = useFormResult.watch() as KeyValuePairs;
      if (!fields.length) {
        fields = Object.keys(form) as Key[];
      }

      return fields
        .map((key) => [key, form[key]] as const)
        .map(([key, value]) => (
          <Fragment key={key}>
            {shouldRenderElement(key, values)
              ? renderElement(key, value)
              : null}
          </Fragment>
        ));
    },
  };
};

export type OnSubmitArgs<
  T extends UseFormHandleSubmit<Record<string, unknown>>,
> = Parameters<Parameters<T>[0]>;
export type OnErrorArgs<
  T extends UseFormHandleSubmit<Record<string, unknown>>,
> = Parameters<NonNullable<Parameters<T>[1]>>;
