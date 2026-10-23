export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
};

export const isNonEmptyString = (value: string | null | undefined): boolean =>
  typeof value === 'string' && value.trim().length > 0;
