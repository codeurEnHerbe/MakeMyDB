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

  constructor() { }

  ngOnInit() {
  }

  validate(){
    let ok = true;
    if(this.entity.name.length<1){
      ok=false;
      Swal.fire({
        icon: "error",
        title: "Il faut définire un nom !"
      })
    }

    this.entity.attributes.forEach( attribute => {
      if(attribute.name.length<1){
        ok=false;
        Swal.fire({
          icon: "error",
          text: "Un attribue n'a aucun nom !"
        })
      }
      if( (attribute.type == Type.int || attribute.type == Type.smalint || attribute.type == Type.float || attribute.type == Type.varchar)
      && (attribute.typeNumber == undefined || attribute.typeNumber <= 0)){
        ok=false;
        Swal.fire({
          icon: "error",
          html: "L'attribue <b>\""+attribute.name+"\"</b> ne posséde pas de valeur correct pour son nombre."
        });
        return;
      }
    });

    if(ok){
      this.entityChange.emit(this.entity);
    }
  }

  removeAttribute(attribute: Attribute){
    this.entity.attributes.splice(this.entity.attributes.findIndex( attrib=>attrib.name == attribute.name), 1)
  }


}
