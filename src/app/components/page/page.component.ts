import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Page } from 'src/app/models/page';
import { Slide, SlideMedia } from 'src/app/models/slide';
import { IApiResponse } from 'src/app/shared/models/api-response';
import { BusyService } from 'src/app/shared/services/busy.service';
import { LocalizationService } from 'src/app/shared/services/localization.service';
import { MavDataService } from 'src/app/shared/services/mav-data.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  constructor(
    private dataService: MavDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localizationService: LocalizationService,
    private meta: Meta,
    private title: Title,
    private busyService: BusyService,
  ) {

  }

  page!: Page;
  recentBlogs!: Page[];


  galery!: SlideMedia[];
  displayCustom: boolean = false;
  activeIndex: number = 0;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  categories!: any[];

  menuItems!: MenuItem[];

  innerHeight = window.innerHeight;

  private unsubscribe = new Subject();

  ngOnInit(): void {
    this.busyService.setBusy();
    this.activatedRoute.params.subscribe(params => {
      if (params['slug'])
        this.getPage(params['slug']);
    });
    //this.getCategories();
  }

  translate(keyName: string) {
    return this.localizationService.translate(keyName);
  }

  getPage(slug: string) {
    this.page = new Page;
    this.categories = [];
    this.galery = [];
    this.recentBlogs = [];

    this.dataService.getById<Page>(`/Page`, slug).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<Page>) => {
      if (response && response.isSuccess) {
        this.page = response.dataSingle;
        this.page.childPageList = this.page.childPageList.filter(x => x.name != null);
        if ('/p/' + this.page.slug != location.pathname) {
          const langId = localStorage.getItem('langId');
          if (langId && this.page.languageSlugList.some(x => x.languageId == langId && x.slug != null)) {
            this.router.navigate(['/p', this.page.languageSlugList.find(x => x.languageId == langId)?.slug!]);
          }
        }
        if (this.page.pageType.keyName == 'BlogDetail' || this.page.pageType.keyName == 'Detail') {
          this.getGalery(this.page.id);
          if (this.page.pageType.keyName == 'BlogDetail')
            this.getRecentBlogs();
          else
            this.getRecentPages();
        }

        this.menuItems = [
          { label: this.page.name, url: 'p/' + slug }
        ]
        if (this.page.parentPage) {
          this.menuItems.splice(0, 0, { label: this.page.parentPage.name, url: 'p/' + this.page.parentPage.slug });
        }
        this.setTitleAndTags();
        this.busyService.setIdle();
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }

  getCategories() {
    this.dataService.getData<any>(`/Categories/PageCategoryCount`).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
      if (response && response.isSuccess) {
        this.categories = response.dataMulti;
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }

  getGalery(pageId: string) {
    this.dataService.getById<Slide>(`/Slide/GetByPageId`, pageId).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<Slide>) => {
      if (response && response.isSuccess) {
        this.galery = response.dataSingle.slideMedias;
      }

    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  getRecentPages() {
    if (this.page.parentPageId) {
      this.dataService.getDataList<Page>(`/Page/GetLatest/${this.page.parentPageId}`).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<Page>) => {
        if (response && response.isSuccess) {
          this.recentBlogs = response.dataMulti.filter(x => x.name != null);
        }
      }, error => {
        if (isDevMode())
          console.log(error);
      })
    }
  }

  getRecentBlogs() {
    this.dataService.getDataList<Page>(`/Page/GetLatestBlogs}`).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
      if (response && response.isSuccess) {
        this.recentBlogs = response.dataMulti.filter(x => x.name != null);
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }

  get getKeywords() {
    if (this.page && this.page.ogKeywords)
      return this.page.ogKeywords.split(',');
    return null;
  }

  setTitleAndTags() {
    this.meta.addTags([
      { property: 'og:url', content: window.location.href },
      { property: 'og:locale', content: localStorage.getItem('culture')! },
      { property: 'og:site_name', content: 'Klasik Merdiven' },
    ]);
    if (this.page?.ogDescription)
      this.meta.addTag({ name: 'description', content: this.page?.ogDescription! });

    if (this.page?.ogKeywords) {
      this.meta.addTag({ name: 'keywords', content: this.page?.ogKeywords! });
      this.meta.addTag({ property: 'og:keywords', content: this.page?.ogKeywords! });
    }

    if (this.page?.ogTitle)
      this.meta.addTag({ property: 'og:title', content: this.page?.ogTitle! },);

    if (this.page?.ogType)
      this.meta.addTag({ property: 'og:type', content: this.page?.ogType! });

    if (this.page?.ogImagePath)
      this.meta.addTag({ property: 'og:image', content: this.page?.ogImagePath! });

    this.title.setTitle(this.page.name);
  }

}
