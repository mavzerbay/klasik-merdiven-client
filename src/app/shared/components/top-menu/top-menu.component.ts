import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IApiResponse } from '../../models/api-response';
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

  menuList!: any[];

  private unsubscribe = new Subject()

  ngOnInit(): void {
    this.getMenuList();
  }

  getMenuList() {
    this.dataService.getDataList<any>('/Menu/ClientMenus').pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
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
}
