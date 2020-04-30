import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { Table } from 'src/app/interfaces/table.interface';

@Component({
  selector: 'app-drag-form',
  templateUrl: './drag-form.component.html',
  styleUrls: ['./drag-form.component.scss']
})
export class DragFormComponent implements OnInit {

  private dragName: string;
  @Output() list: EventEmitter<Drag> = new EventEmitter<Drag>();

  constructor() { }

  ngOnInit() {
  }

  public createDrag() {
    this.list.emit({ elementId: "id-"+this.dragName, label: this.dragName, element: {name:this.dragName, attributes: []} });
  }

}
