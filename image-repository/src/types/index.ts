export type ImageType = 'svg' | 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp' | 'pdf';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ImageItem {
  id: string;
  name: string;
  description: string;
  type: ImageType;
  url: string;
  categoryIds: string[];
  tagIds: string[];
  thumbnailUrl?: string;
  createdAt: Date;
}