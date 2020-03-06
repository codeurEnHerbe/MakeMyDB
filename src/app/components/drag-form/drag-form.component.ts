import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';

@Component({
  selector: 'app-drag-form',
  templateUrl: './drag-form.component.html',
  styleUrls: ['./drag-form.component.scss']
})
export class DragFormComponent implements OnInit {

  private dragName: string;
  @Output() list: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public createDrag(){
    this.list.emit(this.dragName);
  }

}
