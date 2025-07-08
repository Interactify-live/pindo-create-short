export interface ValidationRule {
    test: (value: any) => boolean;
    message: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare const createValidator: (rules: ValidationRule[]) => (value: any) => ValidationResult;
export declare const commonRules: {
    required: (fieldName: string) => ValidationRule;
    minLength: (fieldName: string, min: number) => ValidationRule;
    maxLength: (fieldName: string, max: number) => ValidationRule;
    email: (fieldName: string) => ValidationRule;
    fileSize: (fieldName: string, maxSizeMB: number) => ValidationRule;
    fileType: (fieldName: string, allowedTypes: string[]) => ValidationRule;
};
