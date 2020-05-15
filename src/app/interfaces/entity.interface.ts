import { Type } from './type.enum';

export interface Entity{
    name: string;
    attributes: Array<{
        name: string,
        type: Type,
        isPrimary: boolean,
        foreignTable?: Entity,
        foreignAttribute?: string
    }>
}