export interface Drag{
    id: string;
    label: string;
    attributes?: Array<Attribute>;
    dimension?: any;
}

export interface Attribute{
    id: number;
    name: string;
}