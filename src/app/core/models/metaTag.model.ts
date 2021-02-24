export enum METATAG {
  DESCRIPTION = 'description',
  KEYWORDS = 'keywords',
  FB_URL = 'og:url',
  FB_TITLE = 'og:title',
  FB_DESCRIPTION = 'og:description',
  FB_IMAGE = 'og:image',
  FB_SECURE_IMAGE = 'og:image:secure_url'
}

export class MetaTag {
  name: string;
  value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}
