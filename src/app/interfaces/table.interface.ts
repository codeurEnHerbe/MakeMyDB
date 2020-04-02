import { Type } from './type.enum';

export interface Table{
    name: string;
    attributes: Array<{
        name: string,
        type: Type,
        isPrimary: boolean,
        foreignTable: Table | null,
        foreignAttribute: string | null
    }>
}