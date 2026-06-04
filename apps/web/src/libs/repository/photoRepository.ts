import {
  PhotoUrlTypes,
  BasePhotoUserProps,
  PexelPhotoResult,
  UnsplashPhotoResult,
  PexelSearchPhotosProps,
  UnsplashSearchPhotosProps,
  PhotoResult,
} from "@/_types/photos";
import { chunk3dAdvanceByHeight, chunks2Arr, uniqueBy } from "../utils";

interface IPhotoRepository {
  url: string;
  id: string;
  width: number;
  height: number;
  color: string;
  title: string;
  description: string;
  src: Partial<PhotoUrlTypes>;
  user: BasePhotoUserProps;
}

interface IPhotoRepositoryList {
  results: PhotoResult[];
  total: number;
  total_pages: number;
  per_page: number;
  page: number;
}
export class PhotoRepository implements IPhotoRepository {
  from!: string;
  url!: string;
  id!: string;
  width!: number;
  height!: number;
  title!: string;
  description!: string;
  likes!: number;
  src!: PhotoUrlTypes;
  user!: BasePhotoUserProps;
  color!: string;
  getUser(): BasePhotoUserProps {
    return this.user;
  }
  toJson() {
    return {
      id: this.id,
      url: this.url,
      width: this.width,
      height: this.height,
      title: this.title,
      description: this.description,
      likes: this.likes,
      src: this.src,
      user: this.user,
      color: this.color,
      from: this.from,
    };
  }
}

export class PhotoRepositoryList implements IPhotoRepositoryList {
  results: PhotoResult[] = [];
  total!: number;
  total_pages!: number;
  per_page!: number;
  page!: number;
  setIteratorPhotoPexel(args: PexelSearchPhotosProps) {
    try {
      args.photos.map((item) => {
        const objPexel = new PhotoRepositoryPexel(item);
        this.results.push(objPexel.toJson());
      });
      this.results = uniqueBy(this.results, (v: any) => v.id) as PhotoResult[];
      this.total = args.total_results;
      this.total_pages = Math.ceil(args.total_results / args.per_page);
      this.per_page = args.per_page;
      this.page = args.page;
    } catch (error) {
      console.log("error", error);
    }
  }
  setIteratorPhotoUnsplash(args: UnsplashSearchPhotosProps) {
    try {
      args.results.map((item) => {
        const objUnsplash = new PhotoRepositoryUnsplash(item);
        this.results.push(objUnsplash);
      });
      this.results = uniqueBy(this.results, (v: any) => v.id) as PhotoResult[];
      this.total = args.total;
      this.total_pages = args.total_pages;
    } catch (error) {
      console.log("error", error);
    }
  }

  splitToChunks(size: number = 2): PhotoResult[] {
    return chunks2Arr(this.results, size);
  }

  splitToChunksByHeight() {
    return chunk3dAdvanceByHeight(this.results);
  }

  toJson() {
    return {
      results: this.results,
      total: this.total,
      total_pages: this.total_pages,
      per_page: this.per_page,
      page: this.page,
    };
  }
}

export class PhotoRepositoryPexel extends PhotoRepository {
  from = "pexel";
  args: PexelPhotoResult;
  constructor(args: PexelPhotoResult) {
    super();
    this.args = args;
    this.binding();
  }

  private binding() {
    this.url = this.args.url;
    this.id = this.args.id.toString();
    this.width = this.args.width;
    this.height = this.args.height;
    this.color = this.args.avg_color;
    this.title = this.args.description;
    this.description = this.args.alt;
    this.likes = this.args.likes;
    this.src = {
      raw: this.args.src.original,
      full: this.args.src.original,
      large: this.args.src.large,
      medium: this.args.src.large,
      small: this.args.src.small,
      thumb: this.args.src.tiny,
    };
    this.user = {
      id: this.args.photographer_id.toString(),
      name: this.args.photographer,
      portfolio_url: this.args.photographer_url,
    };
  }
}

export class PhotoRepositoryUnsplash extends PhotoRepository {
  from = "unsplash";
  args: UnsplashPhotoResult;
  constructor(args: UnsplashPhotoResult) {
    super();
    this.args = args;
    this.binding();
  }

  private binding() {
    this.url = this.args.slug;
    this.id = this.args.id;
    this.width = this.args.width;
    this.height = this.args.height;
    this.color = this.args.color;
    this.title = this.args.description;
    this.description = this.args.alt_description;
    this.likes = this.args.likes;
    this.src = {
      raw: this.args.urls.raw,
      full: this.args.urls.full,
      large: this.args.urls.regular,
      medium: this.args.urls.small,
      small: this.args.urls.small,
      thumb: this.args.urls.thumb,
    };
    this.user = {
      id: this.args.user.toString(),
      name: this.args.user.name,
      portfolio_url: this.args.user.links?.html as string,
      avatar_url: this.args.user.profile_image?.small,
    };
  }
}
