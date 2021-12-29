import { AfterViewInit, Component, isDevMode, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralSettings } from 'src/app/models/general-settings';
import { Slide, SlideMedia } from 'src/app/models/slide';
import { IApiResponse } from 'src/app/shared/models/api-response';
import { Language } from 'src/app/shared/models/language';
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

  constructor(
    private dataService: MavDataService,
    private generalSettingsService: GeneralSettingsService,
    private localizationService: LocalizationService,
  ) { }
  ngOnInit(): void {
    this.getHomeSlide();
    this.setTestimonialResponsiveOptions();

    this.localizationService.language$.subscribe((val) => {
      if (val != null && val.length > 0)
        this.primaryLanguage = this.localizationService.getPrimaryLanguage;
    })

    this.generalSettingsService.generalSettings$.subscribe((val) => {
      if (val != null) {
        this.generalSettings = val;
      }
    });

    this.getTestimonialSlide();
  }

  translate(keyName: string) {
    return this.localizationService.translate(keyName);
  }

  get getGeneralSettingsTransByCurrentLangId() {
    if (this.primaryLanguage == null)
      return null
    else {
      return this.generalSettings.generalSettingsTrans.find(x => x.languageId == this.primaryLanguage?.id);
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
      if (response && response.isSuccess) {
        this.slideMediaList = response.dataSingle.slideMedias.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0);
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })

  }

  getTestimonialSlide() {
    this.dataService.getData<Slide>(`/Slide/GetTestimonialSlide`,).subscribe((response: IApiResponse<Slide>) => {
      if (response && response.isSuccess) {
        this.testimonialSlide = response.dataSingle;
        this.testimonialSlide.slideMedias = this.testimonialSlide.slideMedias.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0)
      }
    }, error => {
      if (isDevMode())
        console.log(error);
    })
  }
}
