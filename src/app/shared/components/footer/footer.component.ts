import { Component, isDevMode, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientMenu } from 'src/app/models/client-menu-response';
import { GeneralSettings } from 'src/app/models/general-settings';
import { IApiResponse } from '../../models/api-response';
import { Language } from '../../models/language';
import { GeneralSettingsService } from '../../services/general-settings.service';
import { LocalizationService } from '../../services/localization.service';
import { MavDataService } from '../../services/mav-data.service';

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
    private dataService: MavDataService,
  ) { }


  leftMenuList!: ClientMenu[];
  middleMenuList!: ClientMenu[];
  rightMenuList!: ClientMenu[];

  private unsubscribe = new Subject()

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
    this.getMenuList(1);
    this.getMenuList(2);
    this.getMenuList(3);
  }


  getMenuList(position: number = 1) {
    this.dataService.getDataList<any>(`/Menu/ClientMenus/${position}`).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
      if (response && response.isSuccess) {
        switch (position) {
          case 1:
            this.leftMenuList = response.dataMulti;
            break;
          case 2:
            this.middleMenuList = response.dataMulti;
            break;
          case 3:
            this.rightMenuList = response.dataMulti;
            break;
        }
      }
    }, error => {
      if (isDevMode())
        console.error(error);
    });
  }

  translate(keyName: string) {
    return this.localizationService.translate(keyName);
  }

  get leftMenuParent() {
    return this.leftMenuList.find(x => x.parentMenuId == null)?.name;
  }

  get middleMenuParent() {
    return this.middleMenuList.find(x => x.parentMenuId == null)?.name;
  }

  get rightMenuParent() {
    return this.rightMenuList.find(x => x.parentMenuId == null)?.name;
  }


  get getGeneralSettingsTransByCurrentLangId() {
    if (this.primaryLanguage == null)
      return null
    else {
      return this.generalSettings.generalSettingsTrans.find(x => x.languageId == this.primaryLanguage?.id);
    }
  }

}
