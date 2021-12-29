import { Component, OnInit } from '@angular/core';
import { GeneralSettings } from 'src/app/models/general-settings';
import { Language } from '../../models/language';
import { GeneralSettingsService } from '../../services/general-settings.service';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  generalSettings!: GeneralSettings;

  primaryLanguage!: Language;

  constructor(
    private generalSettingsService: GeneralSettingsService,
    private localizationService: LocalizationService,
  ) { }

  ngOnInit(): void {
    
    this.localizationService.language$.subscribe((val) => {
      if (val != null && val.length > 0)
        this.primaryLanguage = this.localizationService.getPrimaryLanguage;
    })

    this.generalSettingsService.generalSettings$.subscribe((val) => {
      if (val != null) {
        this.generalSettings = val;
      }
    });
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

}
