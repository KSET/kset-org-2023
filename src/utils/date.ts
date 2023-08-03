export const utcDate = (
  fromDate: Date | { year: number; month: number; day: number },
) => {
  const info =
    fromDate instanceof Date
      ? {
          year: fromDate.getUTCFullYear(),
          month: fromDate.getUTCMonth() + 1,
          day: fromDate.getUTCDate(),
        }
      : fromDate;
  const date = new Date(Date.UTC(info.year, info.month - 1, info.day));
  date.setUTCHours(0, 0, 0, 0);
  return date;
};
