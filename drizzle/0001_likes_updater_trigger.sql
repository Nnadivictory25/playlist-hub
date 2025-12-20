-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! --

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
END;
--> statement-breakpoint
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