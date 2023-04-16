import {
  type CSSProperties,
  type FC,
  type HTMLProps,
  type PropsWithChildren,
  Suspense,
} from "react";

import { cn } from "~/utils/class";

type Direction = "top" | "bottom" | "center";
type Side = "left" | "right" | "middle";
type Position = `${Direction} ${Side}`;

const LoadingSpinner: FC<
  HTMLProps<HTMLDivElement> & {
    position: Position;
  }
> = ({ position, ...props }) => {
  const [directionOrSide, side] = position.split(" ") as [
    Direction | Side,
    Side | undefined,
  ];

  let style = {} as CSSProperties;
  style = withMargin(style, directionOrSide);
  style = withMargin(style, side);

  return (
    <div
      {...props}
      style={style}
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-4 border-transparent border-l-primary border-t-primary",
        props.className,
      )}
    >
      <div aria-busy className="hidden" role="alert">
        Loading
      </div>
    </div>
  );
};

const LoadingOverlay: FC<PropsWithChildren<HTMLProps<HTMLDivElement>>> = ({
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "absolute bottom-0 left-0 right-0 top-0 flex overflow-hidden rounded bg-black/50 p-4 backdrop-blur-[1px]",
        props.className,
      )}
    >
      {children}
    </div>
  );
};

const withMargin = <TStyle extends CSSProperties>(
  style: TStyle,
  position?: Direction | Side | null,
) => {
  switch (position) {
    case "top": {
      return {
        ...style,
        marginBottom: "auto",
      };
    }

    case "bottom": {
      return {
        ...style,
        marginTop: "auto",
      };
    }

    case "left": {
      return {
        ...style,
        marginRight: "auto",
      };
    }

    case "right": {
      return {
        ...style,
        marginLeft: "auto",
      };
    }

    case "center": {
      return {
        ...style,
        marginTop: "auto",
        marginBottom: "auto",
      };
    }

    case "middle": {
      return {
        ...style,
        marginLeft: "auto",
        marginRight: "auto",
      };
    }
  }

  return style;
};

const LoadingArea: FC<
  PropsWithChildren &
    HTMLProps<HTMLDivElement> & {
      loading?: boolean;
      position?: Position;
      fallbackContainer?: FC<PropsWithChildren>;
    }
> = ({
  children,
  loading = false,
  position = "top right",
  fallbackContainer: FallbackContainer,
  ...props
}) => {
  if (!FallbackContainer) {
    FallbackContainer = function FallbackContainer({ children }) {
      return <div className="h-32">{children}</div>;
    };
  }

  return (
    <div {...props} className={cn("relative", props.className)}>
      <Suspense
        fallback={
          <FallbackContainer>
            <LoadingOverlay>
              <LoadingSpinner position="center middle" />
            </LoadingOverlay>
          </FallbackContainer>
        }
      >
        {children}
      </Suspense>
      {loading ? (
        <LoadingOverlay>
          <LoadingSpinner position={position} />
        </LoadingOverlay>
      ) : null}
    </div>
  );
};

export default LoadingArea;
