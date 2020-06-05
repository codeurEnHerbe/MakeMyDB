import { Entity } from "./entity.interface";

export interface Link {
    id: number;
    entityName: string;
    cardinalMin: string;
    cardinalMax: string;
}