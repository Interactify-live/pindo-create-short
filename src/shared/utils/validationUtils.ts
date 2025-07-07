export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const createValidator = (rules: ValidationRule[]) => {
  return (value: any): ValidationResult => {
    const errors: string[] = [];

    for (const rule of rules) {
      if (!rule.test(value)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };
};

export const commonRules = {
  required: (fieldName: string): ValidationRule => ({
    test: (value: any) => value !== null && value !== undefined && value !== '',
    message: `${fieldName} is required`,
  }),

    minLength: (fieldName: string, min: number): ValidationRule => ({
    test: (value: any) => typeof value === 'string' && value.length >= min,
    message: `${fieldName} must be at least ${min} characters`,
  }),

  maxLength: (fieldName: string, max: number): ValidationRule => ({
    test: (value: any) => typeof value === 'string' && value.length <= max,
    message: `${fieldName} must be no more than ${max} characters`,
  }),

  email: (fieldName: string): ValidationRule => ({
    test: (value: any) => {
      if (typeof value !== 'string') return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: `${fieldName} must be a valid email address`,
  }),

  fileSize: (fieldName: string, maxSizeMB: number): ValidationRule => ({
    test: (value: File) => value && value.size <= maxSizeMB * 1024 * 1024,
    message: `${fieldName} must be less than ${maxSizeMB}MB`,
  }),

  fileType: (fieldName: string, allowedTypes: string[]): ValidationRule => ({
    test: (value: File) => value && allowedTypes.includes(value.type),
    message: `${fieldName} must be one of: ${allowedTypes.join(', ')}`,
  }),
};