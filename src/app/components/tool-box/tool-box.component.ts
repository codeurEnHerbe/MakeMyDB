import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export enum MouseAction {
  GRAB = "Grab", EDIT = "Edit", LINK="Link", DELETE="Delete"
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

  ngOnInit() {
    this.setActionGrab();
  }

}
