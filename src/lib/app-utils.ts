import { parseAsInteger, parseAsString, createParser } from 'nuqs-svelte';
import { genres, type Genre } from './genres';

export function getQueryParams(url: URL) {
    return Object.fromEntries(url.searchParams.entries());
}

export function objectToQueryParams(obj: Record<string, any>) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                // For arrays, join with commas
                const arrayValue = value.join(',');
                if (arrayValue) {
                    params.append(key, arrayValue);
                }
            } else {
                params.append(key, value.toString());
            }
        }
    }

    return params.toString();
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

export const DEFAULT_LIMIT = 50;

/**
 * Creates a debounced version of a function that delays invoking the function
 * until after `delay` milliseconds have elapsed since the last time the
 * debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Custom parser for genres array
export const parseAsGenresArray = createParser({
    parse(query: string | string[] | undefined): Genre[] {
        if (!query) return [];

        // Handle both single string and array inputs
        const genreStrings = Array.isArray(query) ? query : [query];

        // Validate and filter to only valid genres
        return genreStrings
            .flatMap((g) => g.split(',')) // Handle comma-separated strings
            .map((g) => g.trim())
            .filter((g) => genres.includes(g as Genre))
            .map((g) => g as Genre);
    },

    serialize(value: Genre[]): string {
        return value.join(',');
    }
})
    .withDefault([]) // Empty array as default
    .withOptions({ history: 'push' });

export const playlistsQueryParser = {
    search: parseAsString.withDefault(''),
    limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
    offset: parseAsInteger.withDefault(0),
    genres: parseAsGenresArray
};


export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}