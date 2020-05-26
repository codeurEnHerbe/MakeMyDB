import { Type } from './type.enum';
import { Entity } from './entity.interface';

export interface Attribute{
    name: string,
    type: Type,
    isPrimary: boolean,
    foreignTable?: Entity,
    foreignAttribute?: string
}