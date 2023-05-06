export default interface YtPlaylist {
  play_id: string;
  title: string;
  thumbnail_link: string;
  videoCount: number;
}

export default interface YtPlaylistVideo {
  id: string;
  title: string;
  thumbnails: string;
  views: number;
}