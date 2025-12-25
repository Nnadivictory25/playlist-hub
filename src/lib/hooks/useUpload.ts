import { createMutation } from "@tanstack/svelte-query";
import type { NewPlaylist } from "../server/db/schema";

type UploadData = {
    formData: PlaylistUploadFormData;
    userId: string;
    playlistInfo: PlaylistInfoResult;
};

export function useUpload() {
    return createMutation(() => ({
        mutationFn: async (data: UploadData) => {
            const newPlaylist: NewPlaylist = {
                userId: data.userId,
                name: data.formData.playlistName,
                description: data.playlistInfo.description,
                imageUrl: data.playlistInfo.imageUrl,
                platform: data.formData.selectedPlatform!,
                genre: data.formData.selectedGenres,
                url: data.formData.playlistUrl,
                songCount: data.playlistInfo.songCount
            };
            const res = await fetch('/api/playlists/upload', {
                method: 'POST',
                body: JSON.stringify(newPlaylist)
            });
            if (!res.ok) throw new Error('Failed to upload playlist');
            return res.json();
        }
    }));
}