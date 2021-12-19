import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject, takeUntil } from 'rxjs';
import { ILanguage, Language } from 'src/app/models/language';
import { Translate } from 'src/app/models/translate';
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

  get getPrimaryLanguage() {
    return this.languageSource.getValue().find(x => x.isPrimary);
  }

  get getLanguageList() {
    return this.languageSource.getValue().sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0);
  }

  get getLanguageListWithoutPrimary() {
    return this.languageSource.getValue().filter(x => x.isPrimary != true).sort((a, b) => a.displayOrder > b.displayOrder ? 1 : a.displayOrder < b.displayOrder ? -1 : 0);
  }

  getLanguages() {
    return this.dataService.getDataList<Language>('/Language').pipe(
      takeUntil(this.unsubscribe),
      map((response) => {
        if (response && response.isSuccess) {
          this.languageSource.next(response.dataMulti);
        }
        return response;
      }
      ));
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
