import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entity } from 'src/app/interfaces/entity.interface';
import { Attribute } from 'src/app/interfaces/attribute.interface';
import { Type } from 'src/app/interfaces/type.enum';


@Component({
  selector: 'app-entity-edition',
  templateUrl: './entity-edition.component.html',
  styleUrls: ['./entity-edition.component.scss']
})
export class EntityEditionComponent implements OnInit {

  @Input()
  entity: Entity;
  types = Object.keys(Type);

  @Output()
  entityChange: EventEmitter<Entity> = new EventEmitter();

  @Output()
  onDelete: EventEmitter<Entity> = new EventEmitter();
  

  constructor() { }

  ngOnInit() {
  }

  deleteEntity(){
    this.onDelete.emit(this.entity)
  }

  validate(){
    this.entityChange.emit(this.entity);
    console.log(this.entity)
  }

  removeAttribute(attribute: Attribute){
    this.entity.attributes.splice(this.entity.attributes.findIndex( attrib=>attrib.name == attribute.name), 1)
  }


}
