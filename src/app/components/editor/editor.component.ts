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
  
  constructor() { }

  setStat(e){
    this.mouseStat=e;
    console.log("mouseStat",this.mouseStat)
  }

  ngOnInit() {
    console.log("ngInit mouseStat",this.mouseStat)
  }

  public createEntity(event){
    this.newEntity = event;
  }

  public createRelation(event){
    this.newRelation = event;
  }

}
