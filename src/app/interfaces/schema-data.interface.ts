import { Drag } from "./drag.interface";

export interface SchemaDTO {
    id?: number;
    name?: string;
    schemaData: SchemaDataDTO;
}

export interface SchemaDataDTO{
    entitys: Drag[];
    relations: Drag[];
}