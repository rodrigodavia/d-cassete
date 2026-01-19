export type Tape = {
  created_at: string,
  title: string,
  author: string,
  color: string,
  cover?: string,
  tracks: TrackList
}
type TrackList = {
  sideA: Array<Song>;
  sideB: Array<Song>;
}
export type Song = {
  title: string,
  file: string,
  order: number
}
