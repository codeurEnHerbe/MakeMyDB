import { Attribute } from './attribute.interface';
import { Link } from './link.interface';

export interface Relation{
    name: string;
    attributes: Array<Attribute>;
    links: Array<Link>;
}