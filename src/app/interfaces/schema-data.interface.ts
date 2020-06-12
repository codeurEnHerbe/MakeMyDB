import { Drag } from "./drag.interface";

export interface SchemaDTO {
    id?: number;
    name?: string;
    schemaData: SchemaDataDTO;
}

export interface SchemaDataDTO{
    entities: Drag[];
    relations: Drag[];
}