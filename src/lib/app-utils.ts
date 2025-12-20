export function getQueryParams(url: URL) {
    return Object.fromEntries(url.searchParams.entries());
}

export function objectToQueryParams(obj: Record<string, string>) {
    return new URLSearchParams(obj).toString();
}