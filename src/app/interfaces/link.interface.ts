import { Entity } from "./entity.interface";

export interface Link {
    entity: Entity;
    cardinalMin: number;
    cardinalMax: number;
}