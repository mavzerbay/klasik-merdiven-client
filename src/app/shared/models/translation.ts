import { BaseModel } from "./base-model";

export class Translation implements BaseModel {
    id!: string;
    keyName!: string;
    translation!: string;
}