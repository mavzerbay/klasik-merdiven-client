import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
}
