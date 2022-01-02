import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, isDevMode, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Message, MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GeneralSettings } from 'src/app/models/general-settings';
import { Page } from 'src/app/models/page';
import { Slide, SlideMedia } from 'src/app/models/slide';
import { IApiResponse } from 'src/app/shared/models/api-response';
import { BaseDropdownResponse } from 'src/app/shared/models/base-dropdown-response';
import { Language } from 'src/app/shared/models/language';
import { BusyService } from 'src/app/shared/services/busy.service';
import { GeneralSettingsService } from 'src/app/shared/services/general-settings.service';
import { LocalizationService } from 'src/app/shared/services/localization.service';
import { MavDataService } from 'src/app/shared/services/mav-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  slideMediaList!: SlideMedia[];

  generalSettings!: GeneralSettings;

  primaryLanguage!: Language;

  testimonialSlide!: Slide;

  responsiveOptions: any;

  latestProjectList!: Page[];

  latestBlogList!: Page[];

  formContact!: FormGroup;
  supportTicketTypeList!: BaseDropdownResponse[];

  private unsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: MavDataService,
    private generalSettingsService: GeneralSettingsService,
    private localizationService: LocalizationService,
    private messageService: MessageService,
    private meta: Meta,
    private title: Title,
    private busyService: BusyService,
  ) { }

  ngOnInit(): void {
    this.busyService.setBusy();
    this.getHomeSlide();
    this.setTestimonialResponsiveOptions();

    this.localizationService.language$.subscribe((val) => {
      if (val != null && val.length > 0) {
        const langId = localStorage.getItem('langId');
        if (langId != null && val.some(x => x.id == langId)) {
          this.primaryLanguage = val.find(x => x.id == langId)!;
        } else {
          this.primaryLanguage = val.find(x => x.isPrimary)!;
        }
      }
    });

    this.generalSettingsService.generalSettings$.subscribe((val) => {
      if (val != null) {
        this.generalSettings = val;
        this.setTitleAndTags();
        this.getLatestProjects();
        this.busyService.setIdle();
      }
    });

    this.getTestimonialSlide();
    this.createContactForm();
    this.getSupportTicketType();
  }

  createContactForm() {
    this.formContact = this.formBuilder.group({
      name: [{ value: null, disabled: false }, Validators.required],
      surname: [{ value: null, disabled: false }, Validators.required],
      supportType: [{ value: null, disabled: false }, Validators.required],
      supportTypeId: [{ value: null, disabled: false }, Validators.required],
      phoneNumber: [{ value: null, disabled: false }],
      email: [{ value: null, disabled: false }, Validators.required],
      content: [{ value: null, disabled: false }, Validators.required],
    });

    this.formContact.get('supportType')?.valueChanges.subscribe(val => {
      if (val && val.id)
        this.formContact.get('supportTypeId')?.setValue(val.id);
      else
        this.formContact.get('supportTypeId')?.setValue(null);
    });

  }
  sendContactForm() {
    if (this.formContact.valid) {
      this.dataService.saveData('/SupportTicket', this.formContact.value).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
        if (response && response.isSuccess && response.dataSingle.mailSended) {
          this.messageService.add({ key: 'home-toast', severity: 'success', summary: this.translate('Contact.TicketReceived') });
          this.formContact.reset();
        } else {
          this.messageService.add({ key: 'home-toast', severity: 'error', summary: this.translate('Contact.TicketNotReceived') });
        }
      }, (error: any) => {
        if (isDevMode())
          console.log(error);
      })
    }
  }

  getSupportTicketType() {
    const customParams = new HttpParams().append('GroupName', 'SupportType');
    this.dataService.getDropdownDataList<BaseDropdownResponse>('/CustomVar/GetDropdownList', '', customParams).pipe(takeUntil(this.unsubscribe)).subscribe((response) => {
      if (response && response.isSuccess) {
        this.supportTicketTypeList = response.dataMulti;
      }
    })
  }

  translate(keyName: string) {
    return this.localizationService.translate(keyName);
  }

  setTitleAndTags() {
    this.meta.addTags([
      { property: 'og:url', content: window.location.href },
      { property: 'og:locale', content: localStorage.getItem('culture')! },
      { property: 'og:site_name', content: 'Klasik Merdiven' },
    ]);
    this.localizationService.translation$.subscribe((val) => {
      if (val && val.length > 0) {
        if (this.getGeneralSettingsTransByCurrentLangId?.homeOgDescription)
          this.meta.addTag({ name: 'description', content: this.getGeneralSettingsTransByCurrentLangId?.homeOgDescription! });


        if (this.getGeneralSettingsTransByCurrentLangId?.homeOgKeywords) {
          this.meta.addTag({ name: 'keywords', content: this.getGeneralSettingsTransByCurrentLangId?.homeOgKeywords! });
          this.meta.addTag({ property: 'og:keywords', content: this.getGeneralSettingsTransByCurrentLangId?.homeOgKeywords! });
        }

        if (this.getGeneralSettingsTransByCurrentLangId?.homeOgTitle)
          this.meta.addTag({ property: 'og:title', content: this.getGeneralSettingsTransByCurrentLangId?.homeOgTitle! },);

        this.meta.addTag({ property: 'og:type', content: 'website' });

        if (this.getGeneralSettingsTransByCurrentLangId?.homeOgImage)
          this.meta.addTag({ property: 'og:image', content: this.getGeneralSettingsTransByCurrentLangId?.homeOgImage! });

        this.title.setTitle(this.translate('Common.Dashboard'));
      }
    });
  }

  get getGeneralSettingsTransByCurrentLangId() {
    if (this.primaryLanguage == null)
      return null
    else {
      return this.generalSettings.generalSettingsTrans.find(x => x.languageId == this.primaryLanguage?.id && x.aboutUs != null);
    }
  }

  setTestimonialResponsiveOptions() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getHomeSlide() {
    this.dataService.getData<Slide>(`/Slide/GetHomeSlide`,).subscribe((response: IApiResponse<Slide>) => {
      if (response && response.isSuccess && response.dataSingle) {
        this.slideMediaList = response.dataSingle.slideMedias.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0);
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })

  }

  getTestimonialSlide() {
    this.dataService.getData<Slide>(`/Slide/GetTestimonialSlide`,).subscribe((response: IApiResponse<Slide>) => {
      if (response && response.isSuccess && response.dataSingle) {
        this.testimonialSlide = response.dataSingle;
        this.testimonialSlide.slideMedias = this.testimonialSlide.slideMedias.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0)
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }

  getLatestProjects() {
    this.dataService.getDataList<Page>(`/Page/GetLatest/${this.generalSettings.latestProjectPageId}`).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
      if (response && response.isSuccess) {
        this.latestProjectList = response.dataMulti.filter(x => x.slug);
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }

  getRecentBlogs() {
    this.dataService.getDataList<Page>(`/Page/GetLatestBlogs}`).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
      if (response && response.isSuccess) {
        this.latestBlogList = response.dataMulti;
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }
}
