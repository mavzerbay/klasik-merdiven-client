import { IApiResponse } from "../shared/models/api-response";
import { BaseModel } from "../shared/models/base-model";

export interface ISlide extends BaseModel, IApiResponse<ISlide> {
}

export class Slide implements BaseModel {
    id!: string;
    activity!: boolean;
    isHome!: boolean;
    name!: string;
    pageId!: string;
    page!: any;
    slidePositionId!: string;
    slidePosition!: any;
    slideMedias!: SlideMedia[];
}

export class SlideMedia implements BaseModel {
    id!: string;
    slideId!: string;
    languageId!: string;
    backgroundImagePath!: string;
    activity!: boolean;
    displayOrder!: number;
    textStyle!: string;
    buttonStyle!: string;
    buttonText!: string;
    linkPageId!: string;
    linkPage!: any;
    routerLink!: string;
    routerQueryParameters!: string;
    title!: string;
    summary!: string;
}