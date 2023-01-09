import validator from 'validator';

export interface StringValidateOptions {
    minLength?: number;
    maxLength?: number;
    alphanumeric?: boolean;
}

export function validateString(value: string, opts: StringValidateOptions): string | null {
    if (opts.minLength !== undefined && value.length < opts.minLength)
        return `Length must be at least ${opts.minLength} characters`;
    if (opts.maxLength !== undefined && value.length > opts.maxLength)
        return `Length must not exceed ${opts.minLength} characters`;

    if (opts.alphanumeric === true && !validator.isAlphanumeric(value))
        return `Value may only contain A-Z, a-z, 0-9`;

    // valid input
    return null;
}
