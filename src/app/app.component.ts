import { DOCUMENT } from '@angular/common';
import { AfterContentChecked, Component, HostListener, Inject, isDevMode, OnInit } from '@angular/core';
import { GeneralSettingsService } from './shared/services/general-settings.service';
import { LocalizationService } from './shared/services/localization.service';
import { Carousel } from 'primeng/carousel';
import { GeneralSettings } from './models/general-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'klasik-merdiven-client';

  constructor(
    private generalSettingsService: GeneralSettingsService,
    private localizationService: LocalizationService,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) { }

  generalSettings!: GeneralSettings;

  ngOnInit(): void {

    Carousel.prototype.onTouchMove = () => { };


    this.generalSettingsService.getGeneralSettings().subscribe((response) => {
      if (response && response.isSuccess && response.dataSingle && response.dataSingle) {
        this.generalSettings = response.dataSingle;
        if (localStorage.getItem('langId') != null) {
          this.document.getElementById('appFavicon')?.setAttribute('href', response.dataSingle.generalSettingsTrans.find(x => x.languageId == localStorage.getItem('langId'))?.icoPath!);
        }
      }
    });
    this.localizationService.getLanguages().subscribe((response) => {
      if (response && response.isSuccess && isDevMode())
        console.log("languages loaded");

    });
    this.localizationService.getTranslations().subscribe((response) => {
      if (response && response.isSuccess && isDevMode())
        console.log("translations loaded");
    });
  }

  translate(keyName:string){
    return this.localizationService.translate(keyName);
  }

  get getContactMessage(){
    return this.translate('Contact.WhatsAppMessage');
  }
}
