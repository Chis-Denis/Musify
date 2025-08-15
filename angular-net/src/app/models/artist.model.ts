import { Album } from "./albums.model";
import { BriefSongDTO } from "./song.model"

export class Artist {
  id?: number;
  stageName?: string;
  bandName?: string;
  location?: string;
  birthday?: string;
  activeStart?: string;
  activeEnd?: string;
  firstName?: string;
  lastName?: string;
  type?: string;

  constructor(init?: Partial<Artist>){
    Object.assign(this, init);
  }
}

export interface SongArtistDTO {
  song: BriefSongDTO;
  artistId?: number;
}


export class ArtistDetails extends Artist {
  members?: Artist[];
  bands?: Artist[];
  albums?: Album[];
  songArtists?: SongArtistDTO[];

  constructor(init?: Partial<ArtistDetails>) {
    super(init);
    this.members = init?.members ?? [];
    this.bands = init?.bands ?? [];
    this.albums = init?.albums ?? [];
    this.songArtists = init?.songArtists ?? [];
  }

  get songs(): BriefSongDTO[] {
    return this.songArtists?.map(sa => sa.song) ?? [];
  }
}
