import { Dragable } from "./dragable.interface";

export interface SchemaDTO {
    id?: number;
    name?: string;
    schemaData: SchemaDataDTO;
}

export interface SchemaDataDTO{
    entities: Dragable[];
    relations: Dragable[];
}

export interface SchemaDTOResponse {
    id?: number;
    name?: string;
    schemaData: string;
}

export interface SchemaDTOResponseLight {
    id?: number;
    name?: string;
}