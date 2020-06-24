import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entity } from 'src/app/interfaces/entity.interface';
import { Attribute } from 'src/app/interfaces/attribute.interface';
import { Type } from 'src/app/interfaces/type.enum';
import Swal from 'sweetalert2';

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

  constructor() {}

  ngOnInit() {

  }

  validate(){
    let ok = true;
    if(this.entity.name.length<1){
      ok=false;
      Swal.fire({
        icon: "error",
        title: "A name must be defined !"
      })
    }

    if(this.entity.name.match(/[a-zA-Z0-9_]{0,127}/)[0] != this.entity.name){
      ok=false;
      Swal.fire({
        icon: "error",
        title: "Name invalide !"
      });
    }

    this.entity.attributes.forEach( attribute => {
      if(attribute.name.length<1){
        ok=false;
        Swal.fire({
          icon: "error",
          text: "An attribute has no name!"
        });
      }
      if( (attribute.type == Type.varchar)
      && (attribute.typeNumber == undefined || attribute.typeNumber <= 0)){
        ok=false;
        Swal.fire({
          icon: "error",
          html: "The attribute <b>\""+attribute.name+"\"</b> does not have the correct value for its number"
        });
        return;
      }

      if(attribute.name.match(/[a-zA-Z0-9_]{0,127}/)[0] != attribute.name){
        ok=false;
        Swal.fire({
          icon: "error",
          html: "The attribute <b>\""+attribute.name+"\"</b> does not have a valide name"
        });
        return;
      }

      const sameName = this.entity.attributes.filter( (attribute2)=>attribute2.name == attribute.name);
      if(sameName.length>1){
        ok=false;
        Swal.fire({
          icon: "error",
          html: "Several attributes have the same name"
        });
        return;
      }

    });

    if(ok){
      this.entityChange.emit(this.entity);
    }
  }

  newAttribute(){
    let newAttribut = {name:'New attribute', type: Type.varchar, isPrimary: false};
    this.entity.attributes.push(newAttribut);
  }

  removeAttribute(attribute: Attribute){
    this.entity.attributes.splice(this.entity.attributes.findIndex( attrib=>attrib.name == attribute.name), 1)
  }


}
