export interface Album {
  _id: string;
  name: string;
  path: string;
  images?: Array<{
    _id: string;
    originalUrl: string;
    thumbnailUrl?: string;
  }>;
  videos?: Array<{
    _id: string;
    url: string;
    thumbnailUrl?: string;
  }>;
  subAlbums?: Album[];
}

export interface AlbumProps {
  businessData: {
    staticData?: {
      albums?: {
        title?: string;
        subTitle?: string;
      };
    };
  };
  album?: Album;
  albums?: Album[];
  currentPage?: number;
}
