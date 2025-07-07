const Validators = {
  url(key: string, value: string) {
    return /^https?:\/\/[a-z0-9_-]+\.[a-z0-9]+/.test(value.toLowerCase())
      ? undefined
      : `${key} field is not a valid url`;
  },
  required(key: string, value: string): string | undefined {
    if (!value?.trim?.()?.length) {
      return `${key} field should not be empty`;
    }
  },
  maxLength(key: string, value: string, length: number): string | undefined {
    if (value.length > length) {
      return `${key} field should be at most ${length} characters`;
    }
  },
};

export { Validators };
