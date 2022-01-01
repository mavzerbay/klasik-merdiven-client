import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ClientMenu } from 'src/app/models/client-menu-response';
import { IApiResponse } from '../../models/api-response';
import { Language } from '../../models/language';
import { LocalizationService } from '../../services/localization.service';
import { MavDataService } from '../../services/mav-data.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  constructor(
    private localizationService: LocalizationService,
    private dataService: MavDataService,
  ) { }

  menuList!: ClientMenu[];

  private unsubscribe = new Subject()

  languages!: Language[];
  languages$!: Observable<Language[]>;

  selectedLanguage!: Language;

  ngOnInit(): void {
    this.languages$ = this.localizationService.language$;
    this.localizationService.language$.subscribe((val) => {
      if (val != null && val.length > 0) {
        const langId = localStorage.getItem('langId');
        if (langId != null && val.some(x => x.id == langId)) {
          this.selectedLanguage = val.find(x => x.id == langId)!;
        } else {
          this.selectedLanguage = val.find(x => x.isPrimary)!;
        }
      }
    });
    this.getMenuList();
  }

  translate(keyName: string) {
    return this.localizationService.translate(keyName);
  }

  getMenuList() {
    this.dataService.getDataList<any>('/Menu/ClientMenus/0').pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
      if (response && response.isSuccess) {
        this.menuList = response.dataMulti;
      }
    }, error => {
      if (isDevMode())
        console.error(error);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    console.log();
    const navbar = document.getElementById('ftco-navbar');
    if (document.documentElement.scrollTop > 0) {
      navbar?.classList.add('scrolled');
      navbar?.classList.add('awake');
    }
    else {
      if (navbar?.classList.contains('scrolled'))
        navbar?.classList.remove('scrolled');
      if (navbar?.classList.contains('awake'))
        navbar?.classList.remove('awake');
    }
  }

  menuClick() {
    const menu = document.getElementById('ftco-nav');
    if (menu?.classList.contains('show')) {
      menu.classList.remove('show');
    } else {
      menu?.classList.add('show')
    }
  }

  onLangChange(event: any) {
    if (event.value && event.value.id) {
      this.localizationService.changePrimaryLanguage(event.value.id);
    } else {
      this.localizationService.language$.subscribe((val) => {
        if (val != null && val.length > 0) {
          this.selectedLanguage = val.find(x => x.isPrimary)!;
        }
      });
    }
  }
}
