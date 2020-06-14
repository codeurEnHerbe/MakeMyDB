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

export interface schemaDTOResponse {
    id?: number;
    name?: string;
    schemaData: string;
}

export interface schemaDTOResponseLight {
    id?: number;
    name?: string;
}