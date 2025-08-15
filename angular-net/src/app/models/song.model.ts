export interface BriefSongDTO {
  id: number;
  title: string;
  artistsStageName?: string[];
  duration?: TimeSpan;
  creationDate?: Date;
  artistIds?: number[];
}

export interface BriefSongCreationDTO {
  title: string;
  creationDate?: string;
  artistIds?: number[];
}

export interface BriefSongUpdateDTO {
  title: string;
  artistIds?: number[];
}

export interface AlternativeTitlesSongDTO {
  alternativeTitles: string[];
  titleLanguage: string[];
}

export interface AlternativeTitleDTO {
  title: string;
  language?: string;
}

export interface SongWithAlternativeTitlesDTO {
  id: number,
  title: string,
  artistsStageName?: string[];
  duration?: TimeSpan;
  creationDate?: Date;
  alternativeTitles?: AlternativeTitleDTO[];
}

export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export type DurationString = string;

