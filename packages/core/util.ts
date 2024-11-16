export const parseValue = (value: string): any => {
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "number" || typeof parsed === "boolean" || Array.isArray(parsed) || typeof parsed === "string") {
            return parsed;
        }
    } catch (e) { }
    return value;
}