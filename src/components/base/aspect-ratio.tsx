import { type FC, type HTMLProps, type PropsWithChildren } from "react";

import { cn } from "~/utils/class";

export type AspectRatioPropsStrict = {
  ratio?: number;
};

export type AspectRatioProps = PropsWithChildren<
  HTMLProps<HTMLDivElement> & AspectRatioPropsStrict
>;

const AspectRatio: FC<AspectRatioProps> = (props) => {
  const ratio = props.ratio ?? 1;

  return (
    <div
      className="relative w-full"
      style={{
        paddingBottom: `${100 / ratio}%`,
        aspectRatio: ratio,
      }}
    >
      <div
        {...props}
        className={cn(
          props.className,
          "absolute bottom-0 left-0 right-0 top-0",
        )}
      />
    </div>
  );
};

export default AspectRatio;
