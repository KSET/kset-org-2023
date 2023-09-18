"use client";

import { useRouter } from "next/router";
import { omit } from "rambdax";
import { useEffect, useState } from "react";
import { RiSearchLine as IconSearch } from "react-icons/ri";

import { AppInput, AppSelect } from "./app-input";

export const UrlPersistedInput = ({
  queryKey,
  onChange,
  ...props
}: {
  name: string;
  queryKey: string;
  label?: string;
  placeholder?: string;
  type: "text" | "datetime-local";
  initialValue?: string;
  onChange?: (value: string) => void;
}) => {
  const router = useRouter();
  const [value, setValue] = useState(props.initialValue ?? "");

  useEffect(() => {
    const val = router.query[queryKey];
    if (typeof val === "string") {
      setValue(val);
    }
  }, [queryKey, router.query]);

  useEffect(
    () => {
      if (value === "") {
        router.query = omit([queryKey], router.query);
      } else {
        router.query = {
          ...router.query,
          [queryKey]: value,
        };
      }

      void router.replace(
        {
          query: router.query,
        },
        undefined,
        {
          shallow: true,
          scroll: true,
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, queryKey],
  );

  const handleChange = (value: string) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <AppInput
      {...props}
      iconAfter={<IconSearch />}
      onChange={(e) => {
        if (typeof e === "string") {
          handleChange(e);
        } else {
          handleChange((e.target as unknown as { value: never }).value);
        }
      }}
    />
  );
};

export const UrlPersistedSelect = ({
  options,
  queryKey,
  onChange,
  ...props
}: {
  name: string;
  queryKey: string;
  label?: string;
  initialValue?: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange?: (value: string) => void;
}) => {
  const router = useRouter();
  const [value, setValue] = useState(props.initialValue ?? "");

  useEffect(() => {
    const q = router.query[queryKey];
    if (typeof q === "string") {
      setValue(q);
    }
  }, [queryKey, router.query]);

  useEffect(
    () => {
      if (value === "") {
        router.query = omit([queryKey], router.query);
      } else {
        router.query = {
          ...router.query,
          [queryKey]: value,
        };
      }

      void router.replace(
        {
          query: router.query,
        },
        undefined,
        {
          shallow: true,
          scroll: true,
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, queryKey],
  );

  const handleChange = (value: string) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <AppSelect
      {...props}
      options={options}
      onChange={(e) => {
        if (typeof e === "string") {
          handleChange(e);
        } else {
          handleChange((e.target as unknown as { value: never }).value);
        }
      }}
    />
  );
};
