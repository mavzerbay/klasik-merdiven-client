import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralSettingsService } from './shared/services/general-settings.service';
import { LocalizationService } from './shared/services/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'klasik-merdiven-client';

  constructor(
    private generalSettingsService: GeneralSettingsService,
    private localizationService: LocalizationService
  ) { }

  ngOnInit(): void {
    this.generalSettingsService.getGeneralSettings().subscribe();
    this.localizationService.getLanguages().subscribe((response) => {
      if (response && response.isSuccess && isDevMode())
        console.log("languages loaded");
    });
    this.localizationService.getTranslations().subscribe((response) => {
      if (response && response.isSuccess && isDevMode())
        console.log("translations loaded");
    });
  }
}
