import { Entity } from './entity.interface';

export interface Drag{
    elementId: any;
    label?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    element: Entity
}