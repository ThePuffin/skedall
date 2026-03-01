export const getDateRangeLimits = () => {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setMonth(today.getMonth() - 9);
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 9);
  return { minDate, maxDate };
};
