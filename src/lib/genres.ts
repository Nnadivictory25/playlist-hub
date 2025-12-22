// Genre type for type safety
export type Genre =
	| 'Afrobeat'
	| 'Alternative'
	| 'Ambient'
	| 'Blues'
	| 'Classical'
	| 'Country'
	| 'Dance'
	| 'Electronic'
	| 'Folk'
	| 'Funk'
	| 'Gospel'
	| 'Hip-Hop'
	| 'House'
	| 'Indie'
	| 'Jazz'
	| 'Latin'
	| 'Metal'
	| 'Pop'
	| 'Punk'
	| 'R&B'
	| 'Rap'
	| 'Reggae'
	| 'Rock'
	| 'Soul'
	| 'Techno'
	| 'Trap'
	| 'World';

// Array of all available genres (for UI dropdowns, validation, etc.)
export const genres: readonly Genre[] = [
	'Afrobeat',
	'Alternative',
	'Ambient',
	'Blues',
	'Classical',
	'Country',
	'Dance',
	'Electronic',
	'Folk',
	'Funk',
	'Gospel',
	'Hip-Hop',
	'House',
	'Indie',
	'Jazz',
	'Latin',
	'Metal',
	'Pop',
	'Punk',
	'R&B',
	'Rap',
	'Reggae',
	'Rock',
	'Soul',
	'Techno',
	'Trap',
	'World'
] as const;

// Type guard to check if a string is a valid genre
export function isValidGenre(value: string): value is Genre {
	return genres.includes(value as Genre);
}
