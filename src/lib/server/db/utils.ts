import { db } from '.';
import { playlists, playlistLikes, type Playlist, type NewPlaylist } from './schema';
import { eq, and, inArray, count } from 'drizzle-orm';

type GetPlaylistsParams = {
    userId?: string;
    limit?: number;
    offset?: number;
};

export async function getPlaylists(params: GetPlaylistsParams) {
    const { limit, offset, userId } = params;

    const [playlistsData, userLikedLikes, [totalLikes]] = await Promise.all([
        db
            .select()
            .from(playlists)
            .limit(limit ?? 100)
            .offset(offset ?? 0),
        userId
            ? db
                .select({ playlistId: playlistLikes.playlistId })
                .from(playlistLikes)
                .where(eq(playlistLikes.userId, userId))
            : Promise.resolve([]),
        db
            .select({ count: count() })
            .from(playlistLikes)
    ]);

    const userLikedPlaylists = userLikedLikes.map((like) => like.playlistId);

    return { playlists: playlistsData, userLikedPlaylists, totalLikes: totalLikes.count };
}

export async function getUserPlaylists(userId: string) {
    return await db.select().from(playlists).where(eq(playlists.userId, userId));
}

export async function storePlaylist(playlist: NewPlaylist) {
    await db.insert(playlists).values(playlist);
}

export async function updatePlaylist(playlist: Playlist) {
    await db.update(playlists).set(playlist).where(eq(playlists.id, playlist.id));
}

export async function deletePlaylist(id: number) {
    await db.delete(playlists).where(eq(playlists.id, id));
}

export async function toggleLike({ playlistId, userId }: { playlistId: number, userId: string }): Promise<'liked' | 'unliked'> {
    const existing = await db
        .select()
        .from(playlistLikes)
        .where(and(eq(playlistLikes.playlistId, playlistId), eq(playlistLikes.userId, userId)));

    if (existing.length > 0) {
        await db
            .delete(playlistLikes)
            .where(and(eq(playlistLikes.playlistId, playlistId), eq(playlistLikes.userId, userId)));
        return 'unliked';
    } else {
        await db.insert(playlistLikes).values({ playlistId, userId });
        return 'liked';
    }
}
