import { Injectable } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Const} from '../../../environments/const';
import {METATAG, MetaTag} from '@Models/metaTag.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  readonly projectTitle = Const.app.title;

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private metaService: Meta
  ) { }

  setTagsGeneral(title, tags: MetaTag[]): void {
    this.initTitlePage(title);

    tags.forEach(siteTag => {
      this.metaService.updateTag({ name: siteTag.name, content: siteTag.value });
    });
  }

  setFacebookTags(url: string, title: string, description: string, image: string): void {
    const imageUrl = `https://images.codinghub.net/${image}`;
    const tags = [
      new MetaTag(METATAG.FB_URL, url),
      new MetaTag(METATAG.FB_TITLE, title),
      new MetaTag(METATAG.FB_DESCRIPTION, description),
      new MetaTag(METATAG.FB_IMAGE, imageUrl),
      new MetaTag(METATAG.FB_SECURE_IMAGE, imageUrl)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
    });
  }

  private initTitlePage(title: string) {
    this.titleService.setTitle(
      this.projectTitle + ' | ' + this.translateService.instant(title)
    );
  }
}
