import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';

@Component({
  selector: 'app-drag-form',
  templateUrl: './drag-form.component.html',
  styleUrls: ['./drag-form.component.scss']
})
export class DragFormComponent implements OnInit {

  
  @Output()
  newEntity: EventEmitter<Drag> = new EventEmitter<Drag>();
  private entityName: string;

  @Output()
  newRelation: EventEmitter<Drag> = new EventEmitter<Drag>();
  private relationName: string;

  constructor() { }

  ngOnInit() {
  }

  public createEntity() {
    this.newEntity.emit({ elementId: "id-"+this.entityName, label: this.entityName, element: {name: this.entityName, attributes: []} });
  }

  public createRelation() {
    this.newRelation.emit({ elementId: "id-"+this.relationName, label: this.relationName, element: {name: ""+this.relationName, attributes: [], links:[] } });
  }

}
