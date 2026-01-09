export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidJerseyNumber = (number: number): boolean => {
  return number >= 0 && number <= 99;
};

export const isValidGrade = (grade: number): boolean => {
  return grade >= 9 && grade <= 12;
};

export const isValidHeight = (height: string): boolean => {
  const heightRegex = /^\d{1,2}['"]\d{1,2}[""]?$/;
  return heightRegex.test(height);
};
