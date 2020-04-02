import { Table } from './table.interface';

export interface Drag{
    id: any;
    label?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    element: Table
}