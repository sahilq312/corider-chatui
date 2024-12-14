export function removeNo(text: string | undefined): string {
    if (!text) {
        return "name not found";
    }
    return text.replace(/\bNo\.\s*/, '').trim();
}