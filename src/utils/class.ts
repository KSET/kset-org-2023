export const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");
