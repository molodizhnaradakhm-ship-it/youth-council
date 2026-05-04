/**
 * @param yearStr
 * @param fieldName (default "publishedOn")
 */
export const buildYearFilter = (
  yearStr?: string,
  fieldName = 'publishedOn',
): Record<string, any> => {
  const year = yearStr ? parseInt(yearStr, 10) : null;

  if (!year || isNaN(year) || year < 1900 || year > 3000) {
    return {};
  }

  return {
    [fieldName]: {
      greater_than_equal: `${year}-01-01T00:00:00.000Z`,
      less_than_equal: `${year}-12-31T23:59:59.999Z`,
    },
  };
};
