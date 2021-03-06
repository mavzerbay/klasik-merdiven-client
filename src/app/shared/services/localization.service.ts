import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject, takeUntil } from 'rxjs';
import { Language } from '../models/language';
import { Translation } from '../models/translation';
import { MavDataService } from './mav-data.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private languageSource = new BehaviorSubject<Language[]>([]);
  language$ = this.languageSource.asObservable();

  private translationSource = new BehaviorSubject<Translation[]>([]);
  translation$ = this.translationSource.asObservable();

  constructor(
    private dataService: MavDataService,
  ) { }

  private unsubscribe = new Subject();

  get getPrimaryLanguage(): Language {
    this.language$.subscribe((val) => {
      if (val != null && val.length > 0) {
        if (localStorage.getItem('langId') != null) {
          const langId = localStorage.getItem('langId');
          return val.find(x => x.id == langId);
        } else {
          return val.find(x => x.isPrimary);
        }
      } else {
        return this.languageSource.getValue().find(x => x.isPrimary);
      }

    });
    return this.languageSource.getValue().find(x => x.isPrimary) ?? new Language;
  }

  get getLanguageList() {
    return this.languageSource.getValue().sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0);
  }

  get getLanguageListWithoutPrimary() {
    return this.languageSource.getValue().filter(x => x.isPrimary != true).sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0);
  }

  getLanguages() {
    return this.dataService.getDataList<Language>('/Language/GetAllLanguage').pipe(
      takeUntil(this.unsubscribe),
      map((response) => {
        if (response && response.isSuccess) {
          this.languageSource.next(response.dataMulti);
          const browserLang = navigator.language;
          let selectedLang = response.dataMulti.find(x => x.isPrimary);
          if (response.dataMulti.some(x => x.culture.includes(browserLang))) {
            selectedLang = response.dataMulti.find(x => x.culture.includes(browserLang));
          }
          if (localStorage.getItem('langId') == null)
            localStorage.setItem("langId", `${selectedLang?.id}`);
          if (localStorage.getItem('culture') == null)
            localStorage.setItem("culture", `${selectedLang?.culture}`);

        }
        return response;
      }
      ));
  }

  changePrimaryLanguage(langId: string) {
    this.language$.subscribe((val) => {
      if (val != null && val.length > 0) {
        if (val.some(x => x.id == langId)) {
          var language = val.find(x => x.id == langId);
          localStorage.setItem('langId', language?.id!);
          localStorage.setItem('culture', language?.culture!);
        }
        location.reload();
      }
    });
  }

  getTranslations() {
    return this.dataService.getDataList<Translation>('/Translate/GetTranslations').pipe(
      takeUntil(this.unsubscribe),
      map((response) => {
        if (response && response.isSuccess) {
          this.translationSource.next(response.dataMulti);
        }
        return response;
      }
      ));
  }

  translate(keyName: string) {
    this.translation$.subscribe((val) => {
      if (val && val.length > 0 && val.some(x => x.keyName == keyName))
        keyName = val.find(x => x.keyName == keyName)!.translation;
    });
    return keyName;
  }
}
