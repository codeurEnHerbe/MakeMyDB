import { Component, OnInit } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { MouseAction } from '../tool-box/tool-box.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  newEntity;
  newRelation;
  mouseStat = MouseAction.GRAB;
  storedGraph: {entitys: Drag[], reliations: Drag[]};

  constructor() {
    this.storedGraph = JSON.parse(localStorage.getItem("savedGraph"));
  }

  setStat(e){
    this.mouseStat=e;
  }

  ngOnInit() {
    
  }

  public createEntity(event){
    this.newEntity = event;
  }

  public createRelation(event){
    this.newRelation = event;
  }

  canvasUpdate($event:{entitys: Drag[], relations: Drag[]}){
    console.log($event)
    localStorage.setItem("savedGraph",JSON.stringify($event));
  }

}
