import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { GeneralSettings } from 'src/app/models/general-settings';
import { Language } from 'src/app/shared/models/language';
import { GeneralSettingsService } from 'src/app/shared/services/general-settings.service';
import { LocalizationService } from 'src/app/shared/services/localization.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(
    private generalSettingsService: GeneralSettingsService,
    private localizationService: LocalizationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title
  ) { }

  menuItems!: MenuItem[];

  generalSettings!: GeneralSettings;

  primaryLanguage!: Language;

  googleMapUrl!: SafeResourceUrl;

  ngOnInit(): void {
    this.localizationService.language$.subscribe((val) => {
      if (val != null && val.length > 0)
        this.primaryLanguage = this.localizationService.getPrimaryLanguage;
    })

    this.generalSettingsService.generalSettings$.subscribe((val) => {
      if (val != null) {
        this.generalSettings = val;
        this.googleMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generalSettings.googleMapUrl);
        this.setTitleAndTags();
      }
    });

    this.localizationService.translation$.subscribe((val) => {
      if (val && val.length > 0) {
        this.menuItems = [
          { label: this.translate('Contact.ControllerTitle'), url: this.router.url }
        ]
      }
    })
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

  setTitleAndTags() {
    this.localizationService.translation$.subscribe((val) => {
      if (val && val.length > 0) {
        this.meta.addTags([
          { name: 'description', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgDescription! },
          { name: 'keywords', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgTitle! },
          { property: 'og:title', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgTitle! },
          { property: 'og:description', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgDescription! },
          { property: 'og:image', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgImage! },
        ]);
        this.title.setTitle(this.translate('Contact.ControllerTitle'));
      }
    })
  }
}
