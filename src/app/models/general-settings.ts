import { IApiResponse } from "../shared/models/api-response";
import { BaseModel } from "../shared/models/base-model";

export interface IGeneralSettings extends BaseModel, IApiResponse<IGeneralSettings> {
}


export class GeneralSettings implements BaseModel {
    id!: string;
    smtpHost!: string;
    smtpPort!: string;
    email!: string;
    password!: string;
    displayName!: string;
    supportMail!: string;
    contactAddress!: string;
    contactPhone!: string;
    contactWhatsApp!: string;
    googleMapUrl!: string;
    linkedInURL!: string;
    facebookURL!: string;
    instagramURL!: string;
    yearsOfExperienced!: number;
    projectDone!: number;
    happyCustomer!: number;
    testimonailSlideId!: string;
    testimonailSlide!: any;
    latestProjectPageId!: string;
    latestProjectPage!: any;
    generalSettingsTrans!: GeneralSettingsTrans[];
}

export class GeneralSettingsTrans implements BaseModel {
    id!: string;
    generalSettingsId!: string;
    languageId!: string;
    logoPath!: string;
    icoPath!: string;
    aboutUs!: string;
    info1Icon!: string;
    info1Title!: string;
    info1Description!: string;
    info2Icon!: string;
    info2Title!: string;
    info2Description!: string;
    info3Icon!: string;
    info3Title!: string;
    info3Description!: string;
    info4Icon!: string;
    info4Title!: string;
    info4Description!: string;
    homeOgTitle!: string;
    homeOgDescription!: string;
    homeOgImage!: string;
    contactOgTitle!: string;
    contactOgDescription!: string;
    contactOgImage!: string;
}