import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { GeneralSettings } from 'src/app/models/general-settings';
import { IApiResponse } from '../models/api-response';
import { MavDataService } from './mav-data.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {

  private generalSettingsSource = new BehaviorSubject<GeneralSettings | null>(null);
  generalSettings$ = this.generalSettingsSource.asObservable();

  constructor(
    private dataService: MavDataService,
  ) { }

  getGeneralSettings() {
    return this.dataService.getData<GeneralSettings>(`/GeneralSettings`,).pipe(
      map((response) => {
        if (isDevMode())
          console.log("::General Settings Loaded", response);
        if (response && response.isSuccess)
          this.generalSettingsSource.next(response.dataSingle);

        return response;
      })
    );
  }

}
