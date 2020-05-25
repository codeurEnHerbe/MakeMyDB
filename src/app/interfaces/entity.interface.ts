import { Type } from './type.enum';

export interface Entity{
    name: string;
    attributes: Array<Attribute>
}

export interface Attribute{
        name: string,
        type: Type,
        isPrimary: boolean,
        foreignTable?: Entity,
        foreignAttribute?: string
}