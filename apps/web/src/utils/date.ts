const formatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const date = (date: string) => formatter.format(new Date(date));
