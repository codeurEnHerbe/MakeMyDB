import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entity } from 'src/app/interfaces/entity.interface';
import { Type } from 'src/app/interfaces/type.enum';
import { toArray } from 'rxjs/operators';


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
  event: EventEmitter<Entity> = new EventEmitter();
  

  constructor() { }

  ngOnInit() {
    this.types.forEach(element => {
      console.log(element)
    });
  }

  validate(){
    this.event.emit(this.entity);
  }

}
