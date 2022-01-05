import { IApiResponse } from "../shared/models/api-response";
import { BaseModel } from "../shared/models/base-model";

export interface IPage extends BaseModel, IApiResponse<IPage> {
}

export class Page implements BaseModel {
    id!: string;
    activity!: boolean;
    parentPageId!: string;
    parentPage!: Page;
    categoryId!: string;
    category!: any;
    createdById!: string;
    createdBy!: any;
    createdDate!: any;
    pageTypeId!: string;
    pageType!: any;
    name!: string;
    slug!: string;
    languageSlugList!: PageTransDropdownModel[];
    summary!: string;
    content!: string;
    headerPath!: string;
    backgroundPath!: string;
    ogTitle!: string;
    ogDescription!: string;
    ogKeywords!: string;
    ogImagePath!: string;
    ogType!: string;
    childPageList!: Page[];
}
export class PageTransDropdownModel implements BaseModel {
    id!: string;
    name!: string;
    slug!: string;
    languageId!: string;
}