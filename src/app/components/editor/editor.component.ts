import { Component, OnInit } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { MouseAction } from '../tool-box/tool-box.component';

import { Schema } from '../../interfaces/schema.interface';
import { SchemaRestService } from 'src/app/services/schema-rest.service';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  newEntity;
  newRelation;
  mouseStat = MouseAction.GRAB;
  storedGraph: Schema;
  currentSchema: Schema;

  constructor(private schemaService: SchemaRestService) {
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

  canvasUpdate($event:Schema){
    this.currentSchema = $event;
    localStorage.setItem("savedGraph",JSON.stringify($event));
  }

  public saveSchema() {
    this.schemaService.saveSchema(this.currentSchema) 
  }

}
