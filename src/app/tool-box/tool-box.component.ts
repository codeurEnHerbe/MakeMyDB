import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface'
import { Table } from 'src/app/interfaces/table.interface'

export enum MouseAction {
  GRAB = "Grab", EDIT = "Edit", LINK="Link"
}

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss']
})
export class ToolBoxComponent implements OnInit {

  @Output("stat")
  eventEmiter: EventEmitter<MouseAction> = new EventEmitter<MouseAction>();
  stat: MouseAction = MouseAction.GRAB;

  @Output("newElement")
  newElementEmiter: EventEmitter<Drag> = new EventEmitter<Drag>();


  constructor() {
  }

  setActionGrab(){
    this.setAction(MouseAction.GRAB);
  }

  setActionEdit(){
    this.setAction(MouseAction.EDIT);
  }

  setActionLink(){
    this.setAction(MouseAction.LINK);
  }

  setAction(action: MouseAction){
    this.stat = action;
    this.eventEmiter.emit(this.stat);
  }
  
  getStatValue(){
    return this.stat;
  }

  addNewCell(){
    const drag: Drag = {elementId: -1,element: {name: "nouvelle element", attributes: []} };
    this.newElementEmiter.emit(drag);
  }

  ngOnInit() {
    this.setActionGrab();
  }

}
