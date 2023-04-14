export const cn = (...classes: (string | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");
