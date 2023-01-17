import validator from 'validator';

export interface StringValidateOptions {
    minLength?: number;
    maxLength?: number;
    alphanumeric?: boolean;
    email?: boolean;
    equals?: string;
}

export function validateString(value: string, opts: StringValidateOptions): string | null {
    if (opts.minLength !== undefined && value.length < opts.minLength)
        return `Length must be at least ${opts.minLength} characters`;
    if (opts.maxLength !== undefined && value.length > opts.maxLength)
        return `Length must not exceed ${opts.maxLength} characters`;

    if (opts.alphanumeric === true && !validator.isAlphanumeric(value))
        return `Value may only contain A-Z, a-z, 0-9`;
    if (opts.email === true && !validator.isEmail(value))
        return `Value must be a valid E-mail address`;

    if (opts.equals !== undefined && value !== opts.equals) return `Values do not match`;

    // valid input
    return null;
}
