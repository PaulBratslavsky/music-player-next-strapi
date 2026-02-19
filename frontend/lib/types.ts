export interface StrapiAudioData {
  id: number;
  documentId: string;
  title: string;
  peaks?: number[] | null;
  artist: {
    id: number;
    name: string;
  };
  image: {
    id: number;
    url: string;
    alternativeText: string;
  };
  audio: {
    id: number;
    url: string;
  };
}
