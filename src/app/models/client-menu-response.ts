import { IApiResponse } from "../shared/models/api-response";
import { BaseModel } from "../shared/models/base-model";

export interface IClientMenu extends BaseModel, IApiResponse<IClientMenu> {
}

export class ClientMenu implements BaseModel {
    id!: string;
    displayOrder!: number;
    routerLink!: string;
    routerQueryParameter!: any;
    icon!: string;
    backgroundImagePath!: string;
    menuPositionId!: string;
    menuPosition!: any;
    parentMenuId!: string;
    parentMenu!: any;
    pageId!: string;
    page!: any;
    name!: string;
    slug!: string;
    info!: string;
    childMenuResponseList!: ClientMenu[];
}