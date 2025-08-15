export interface PlaylistDto {
  id: number;
  name: string;
  userId: number;
  type: string; // "private" sau "public"
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlaylistDto {
  name: string;
  userId: number;
  type: string;
}

export interface UpdatePlaylistDto {
  newName: string;
}