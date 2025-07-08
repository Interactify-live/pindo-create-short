declare const Validators: {
    url(key: string, value: string): string | undefined;
    required(key: string, value: string): string | undefined;
    maxLength(key: string, value: string, length: number): string | undefined;
};
export { Validators };
