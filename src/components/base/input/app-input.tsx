import {
  cloneElement,
  type HTMLProps,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import { RiArrowDownSLine as IconChevronDown } from "react-icons/ri";

import { type Assign } from "~/types/object";
import { type Maybe } from "~/types/util";
import { cn } from "~/utils/class";

import $style from "./app-input.module.scss";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const AppInput = <TValue extends unknown>(
  props: HTMLProps<HTMLDivElement> & {
    label?: string;
    name: string;
    initialValue?: TValue;
    iconBefore?: ReactNode;
    iconAfter?: ReactNode;
    onChange?: (val: TValue) => void | never;
  },
) => {
  return (
    <AppInputBase
      {...props}
      input={
        <input className="flex-1 bg-transparent p-3 pr-11 leading-none text-inherit" />
      }
    />
  );
};

export const AppTextarea = (
  props: HTMLProps<HTMLDivElement> & {
    label?: string;
    name: string;
    initialValue?: string;
    iconBefore?: ReactNode;
    iconAfter?: ReactNode;
    onChange?: (val: string) => void | never;
  },
) => {
  return (
    <AppInputBase
      {...props}
      input={
        <textarea
          className="flex-1 bg-transparent p-3 pr-11 leading-none text-inherit"
          placeholder={props.placeholder}
        >
          {props.value}
        </textarea>
      }
    />
  );
};

export const AppSelect = ({
  options,
  children,
  placeholder,
  ...props
}: HTMLProps<HTMLDivElement> & {
  label?: string;
  name: string;
  initialValue?: string;
  options: Maybe<{
    label: string;
    value: string;
  }>[];
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  onChange?: (val: string) => void | never;
}) => {
  return (
    <AppInputBase
      {...props}
      inputContainerClassName={$style.select}
      input={
        <select
          className="flex-1 appearance-none bg-transparent p-3 text-inherit"
          defaultValue=""
          placeholder={placeholder}
        >
          {placeholder ? (
            <option
              key="$$placeholder"
              disabled
              className="bg-off-black"
              value=""
            >
              {placeholder}
            </option>
          ) : null}
          {options.filter(Boolean).map((option) => {
            return (
              <option
                key={option.value}
                className="bg-off-black"
                value={option.value}
              >
                {option.label}
              </option>
            );
          })}
        </select>
      }
    >
      <span className={$style.selectArrow}>
        <IconChevronDown />
      </span>
      {children}
    </AppInputBase>
  );
};

export const AppInputBase = <TValue, TElement extends ReactElement>({
  label,
  name,
  input,
  initialValue,
  children,
  inputContainerClassName,
  iconBefore,
  iconAfter,
  onChange,
  ...props
}: Assign<
  PropsWithChildren<HTMLProps<HTMLDivElement>>,
  {
    label?: string;
    name: string;
    initialValue?: TValue;
    inputContainerClassName?: string;
    input: TElement;
    iconBefore?: ReactNode;
    iconAfter?: ReactNode;
    onChange?: (val: TValue) => void | never;
  }
>) => {
  const inputId = useId();
  const inputElId = `input-${name}-${inputId}`;
  const [value, setValue] = useState(initialValue);

  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-1.5 tracking-wide",
        props.className,
      )}
    >
      <label
        className="text-[.9em] uppercase leading-3 opacity-80"
        htmlFor={inputElId}
      >
        {label ?? name}
      </label>
      <div
        className={cn(
          "relative flex overflow-hidden rounded-sm bg-off-black text-white",
          inputContainerClassName,
        )}
      >
        {iconBefore ? (
          <div className="pointer-events-none absolute right-0 aspect-square h-full p-3 [&>*]:h-full [&>*]:w-auto [&>*]:opacity-70">
            {iconBefore}
          </div>
        ) : null}
        {cloneElement(input, {
          id: inputElId,
          value,
          onChange: (e: { target: { value: TValue } }) => {
            const val = e.target.value;

            onChange?.(val);
            setValue(val);
          },
        })}
        {children}
        {iconAfter ? (
          <div className="pointer-events-none absolute right-0 aspect-square h-full p-3 [&>*]:h-full [&>*]:w-auto [&>*]:opacity-70">
            {iconAfter}
          </div>
        ) : null}
      </div>
    </div>
  );
};
