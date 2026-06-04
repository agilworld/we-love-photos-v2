export enum EOrderByProps {
  relevant = "Relevance",
  latest = "Latest",
  oldest = "Oldest",
}

export enum EContentFilterProps {
  low = "Low",
  high = "High",
}

export enum EColorProps {
  brown = "Brown",
  black = "Black",
  white = "White",
  gray = "Gray",
  yellow = "Yellow",
  red = "Red",
  blue = "Blue",
  pink = "Pink",
  green = "Green",
  teal = "Teal",
  orange = "Orange",
  turqoise = "Turquoise",
}

export enum EOrientationProps {
  landscape = "Landscape",
  portrait = "Portrait",
  square = "Square",
}

export type SearchPhotosBaseParams = {
  query: string;
  page: number;
  per_page: number;
  order_by: keyof typeof EOrderByProps;
  content_filter: keyof typeof EContentFilterProps;
  color?: keyof typeof EColorProps;
  orientation: keyof typeof EOrientationProps;
};

export type SearchPhotosParams = Partial<SearchPhotosBaseParams>;

export const photosKeys = {
  all: ["photos"] as const,
  search: (
    query?: string,
    page?: number,
    per_page?: number,
    color?: keyof typeof EColorProps,
    orientation?: keyof typeof EOrientationProps,
    order_by?: keyof typeof EOrderByProps,
    content_filter?: keyof typeof EContentFilterProps,
  ) =>
    [
      ...photosKeys.all,
      query,
      page,
      per_page,
      color,
      orientation,
      order_by,
      content_filter,
    ] as const,
};

export type PhotoUrlTypes = {
  raw?: string;
  full?: string;
  regular?: string;
  small?: string;
  small_s3?: string;
  thumb?: string;
  original?: string;
  large2x?: string;
  large?: string;
  medium?: string;
  portrait?: string;
  landscape?: string;
  tiny?: string;
};

export type PhotoLinksTypes = {
  self: string;
  html: string;
  download: string;
  download_location: string;
};

export type BasePhotoUserProps = {
  id: string;
  name: string;
  portfolio_url: string;
  avatar_url?: string;
};

export type PhotoUserProps = BasePhotoUserProps & {
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  profile_image?: {
    small: string;
    medium: string;
  };
  links?: {
    self?: string;
    html?: string;
    photos?: string;
    likes: string;
    portfolio: string;
  };
};

export type BasePhotoResult = {
  id: string;
  width: number;
  height: number;
  description: string;
  likes: number;
};

export type PhotoResult = BasePhotoResult & {
  url: string;
  color: string;
  title: string;
  src: Partial<PhotoUrlTypes>;
  user: BasePhotoUserProps;
  from: string;
};

export type PexelPhotoResult = BasePhotoResult & {
  url: string;
  avg_color: string;
  description: string;
  alt: string;
  src: Partial<PhotoUrlTypes>;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
};

export type UnsplashPhotoResult = BasePhotoResult & {
  slug: string;
  color: string;
  alt_description: string;
  urls: Partial<PhotoUrlTypes>;
  user: PhotoUserProps;
};

export type UnsplashSearchPhotosProps = {
  total: number;
  total_pages: number;
  results: UnsplashPhotoResult[];
};

export type PexelSearchPhotosProps = {
  page: number;
  per_page: number;
  total_results: number;
  photos: PexelPhotoResult[];
  next_page: string;
};
