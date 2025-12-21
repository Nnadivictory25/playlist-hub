export function getQueryParams(url: URL) {
    return Object.fromEntries(url.searchParams.entries());
}

export function objectToQueryParams(obj: Record<string, string>) {
    return new URLSearchParams(obj).toString();
}

export function formatTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    const intervals = [
        { label: 'month', seconds: 2592000 }, // 30 days
        { label: 'day', seconds: 86400 },
        { label: 'hr', seconds: 3600 },
        { label: 'min', seconds: 60 }
    ];

    if (diffInSeconds < 60) {
        return 'just now';
    }

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}