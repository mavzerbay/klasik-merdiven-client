import { IApiResponse } from "./api-response";
import { BaseModel } from "./base-model";

export interface ILanguage extends BaseModel, IApiResponse<ILanguage> {
}

export class Language implements BaseModel {
    id!: string;
    name!: string;
    culture!: string;
    flagIcon!: string;
    isRTL!: boolean;
    activity!: boolean;
    isPrimary!: boolean;
    displayOrder!: number;
}