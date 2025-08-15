export class Album{
    id!: number;
    title!: string;
    description?: string;
    genre!: string;
    artistId!: number;
    releaseDate!: Date;
    label!: string;

    constructor(value?: Partial<Album>) {
    if (value) Object.assign(this, value);
  }
   public getDateNormalized(): string {
        return this.releaseDate ? new Date(this.releaseDate).toLocaleDateString() : '';
    }
}

export class AlbumSong{
    albumId!: number;
    songId!: number;
    position?: number;

    constructor(value?: Partial<Album>) {
        if (value) Object.assign(this, value);
    }

}
