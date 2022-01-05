import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { Translation } from '../../models/translation';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, AfterViewInit, OnChanges {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  home = { label: this.translate('Common.Dashboard'), url: '/' };
  @Input() menuItems!: MenuItem[];
  @Input() headerPath: string = 'assets/images/default-breadcrumb.webp';

  constructor(
    private localizationService: LocalizationService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['menuItems'] && changes['menuItems'].currentValue) {
      this.menuItems = changes['menuItems'].currentValue;
      this.home.label = this.translate('Common.Dashboard');
      this.cdRef.detectChanges();
    }

    if (changes && changes['headerPath']) {
      this.headerPath = changes['headerPath'].currentValue ?? 'assets/images/default-breadcrumb.webp';
      this.cdRef.detectChanges();
    }
  }

  translatorList: Translation[] = [];

  ngAfterViewInit(): void {
    this.home.label = this.translate('Common.Dashboard');
    this.cdRef.detectChanges();
  }

  translate(keyName: string) {
    return this.localizationService.translate(keyName);
  }

  ngOnInit(): void {
    this.home.label = this.translate('Common.Dashboard');
  }

  get getName() {
    if (this.menuItems && this.menuItems.length > 0)
      return this.menuItems[this.menuItems.length - 1].label;
    else
      return '';
  }

}
