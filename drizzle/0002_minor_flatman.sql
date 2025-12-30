DROP TRIGGER IF EXISTS update_playlist_likes_on_insert;--> statement-breakpoint
DROP TRIGGER IF EXISTS update_playlist_likes_on_delete;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_playlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`song_count` integer DEFAULT 0 NOT NULL,
	`image_url` text NOT NULL,
	`platform` text NOT NULL,
	`genre` text NOT NULL,
	`url` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_playlists`("id", "name", "description", "likes", "song_count", "image_url", "platform", "genre", "url", "user_id", "created_at", "updated_at") SELECT "id", "name", "description", "likes", "song_count", "image_url", "platform", "genre", "url", "user_id", "created_at", "updated_at" FROM `playlists`;--> statement-breakpoint
DROP TABLE `playlists`;--> statement-breakpoint
ALTER TABLE `__new_playlists` RENAME TO `playlists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `playlists_name_idx` ON `playlists` (`name`);--> statement-breakpoint
CREATE INDEX `playlists_description_idx` ON `playlists` (`description`);--> statement-breakpoint
ALTER TABLE `users` ADD `username` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE TRIGGER update_playlist_likes_on_insert
AFTER INSERT ON playlist_likes
FOR EACH ROW
BEGIN
	UPDATE playlists 
	SET likes = (
		SELECT COUNT(*) 
		FROM playlist_likes 
		WHERE playlist_id = NEW.playlist_id
	)
	WHERE id = NEW.playlist_id;
END;--> statement-breakpoint
CREATE TRIGGER update_playlist_likes_on_delete
AFTER DELETE ON playlist_likes
FOR EACH ROW
BEGIN
	UPDATE playlists 
	SET likes = (
		SELECT COUNT(*) 
		FROM playlist_likes 
		WHERE playlist_id = OLD.playlist_id
	)
	WHERE id = OLD.playlist_id;
END;