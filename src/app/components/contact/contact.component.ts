import { HttpParams } from '@angular/common/http';
import { Component, isDevMode, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { filter, Subject, takeUntil } from 'rxjs';
import { GeneralSettings } from 'src/app/models/general-settings';
import { IApiResponse } from 'src/app/shared/models/api-response';
import { BaseDropdownResponse } from 'src/app/shared/models/base-dropdown-response';
import { Language } from 'src/app/shared/models/language';
import { GeneralSettingsService } from 'src/app/shared/services/general-settings.service';
import { LocalizationService } from 'src/app/shared/services/localization.service';
import { MavDataService } from 'src/app/shared/services/mav-data.service';

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
    private meta: Meta,
    private title: Title,
    private dataService: MavDataService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) { }

  menuItems!: MenuItem[];

  generalSettings!: GeneralSettings;

  primaryLanguage!: Language;

  googleMapUrl!: SafeResourceUrl;

  formContact!: FormGroup;
  supportTicketTypeList!: BaseDropdownResponse[];

  private unsubscribe = new Subject();

  ngOnInit(): void {
    this.localizationService.language$.subscribe((val) => {
      if (val != null && val.length > 0) {
        const langId = localStorage.getItem('langId');
        if (langId != null && val.some(x => x.id == langId)) {
          this.primaryLanguage = val.find(x => x.id == langId)!;
        } else {
          this.primaryLanguage = val.find(x => x.isPrimary)!;
        }
      }
    });

    this.generalSettingsService.generalSettings$.subscribe((val) => {
      if (val != null) {
        this.generalSettings = val;
        this.googleMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generalSettings.googleMapUrl);
        this.setTitleAndTags();
      }
    });

    this.localizationService.translation$.subscribe((val) => {
      if (val && val.length > 0) {
        this.menuItems = [
          { label: this.translate('Contact.ControllerTitle'), url: this.router.url }
        ]
      }
    })

    this.createContactForm();
    this.getSupportTicketType();
  }
  createContactForm() {
    this.formContact = this.formBuilder.group({
      name: [{ value: null, disabled: false }, Validators.required],
      surname: [{ value: null, disabled: false }, Validators.required],
      supportType: [{ value: null, disabled: false }, Validators.required],
      supportTypeId: [{ value: null, disabled: false }, Validators.required],
      phoneNumber: [{ value: null, disabled: false }],
      email: [{ value: null, disabled: false }, Validators.required],
      content: [{ value: null, disabled: false },Validators.required],
    });

    this.formContact.get('supportType')?.valueChanges.subscribe(val => {
      if (val && val.id)
        this.formContact.get('supportTypeId')?.setValue(val.id);
      else
        this.formContact.get('supportTypeId')?.setValue(null);
    });

  }
  sendContactForm() {
    if (this.formContact.valid) {
      this.dataService.saveData('/SupportTicket', this.formContact.value).pipe(takeUntil(this.unsubscribe)).subscribe((response: IApiResponse<any>) => {
        if (response && response.isSuccess && response.dataSingle.mailSended) {
          this.messageService.add({ key: 'contact-toast', severity: 'success', summary: this.translate('Contact.TicketReceived') });
          this.formContact.reset();
        } else {
          this.messageService.add({ key: 'contact-toast', severity: 'error', summary: this.translate('Contact.TicketNotReceived') });
        }
      }, (error: any) => {
        if (isDevMode())
          console.log(error);
      })
    }
  }

  getSupportTicketType() {
    const customParams = new HttpParams().append('GroupName', 'SupportType');
    this.dataService.getDropdownDataList<BaseDropdownResponse>('/CustomVar/GetDropdownList', '', customParams).pipe(takeUntil(this.unsubscribe)).subscribe((response) => {
      if (response && response.isSuccess) {
        this.supportTicketTypeList = response.dataMulti;
      }
    })
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

  setTitleAndTags() {
    this.localizationService.translation$.subscribe((val) => {
      if (val && val.length > 0) {
        this.meta.addTags([
          { name: 'description', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgDescription! },
          { name: 'keywords', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgTitle! },
          { property: 'og:title', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgTitle! },
          { property: 'og:description', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgDescription! },
          { property: 'og:image', content: this.getGeneralSettingsTransByCurrentLangId?.contactOgImage! },
        ]);
        this.title.setTitle(this.translate('Contact.ControllerTitle'));
      }
    })
  }
}
