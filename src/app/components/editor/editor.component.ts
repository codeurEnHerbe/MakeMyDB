import { Component, OnInit } from '@angular/core';
import { MouseAction } from '../tool-box/tool-box.component';

import { SchemaDataDTO, SchemaDTO, schemaDTOResponse, schemaDTOResponseLight } from '../../interfaces/schema-data.interface';
import { SchemaRestService } from 'src/app/services/schema-rest.service';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  mouseStat = MouseAction.GRAB;
  storedGraph: SchemaDataDTO;
  currentSchema: SchemaDTO;
  currentUserSchemas: Array<schemaDTOResponseLight>;

  constructor(private schemaService: SchemaRestService) {
    this.storedGraph = JSON.parse(localStorage.getItem("savedGraph"));

  }

  setStat(e){
    this.mouseStat=e;
  }

  ngOnInit() {
    this.loadAllSchemas();
    }

  canvasUpdate($event: SchemaDataDTO){
    this.currentSchema = {name: "Nouveau MCD", schemaData: $event};

    console.log(JSON.stringify($event))
    localStorage.setItem("savedGraph",JSON.stringify($event));
  }

  public saveSchema() {
    this.schemaService.saveSchema(this.currentSchema) 
  }

  public generateSql(){
    // this.schemaService.generateSql(this.currentSchema);
  }

  private loadAllSchemas() {
    this.schemaService.loadAllSchemas()
    .subscribe(res => {
      this.currentUserSchemas = res;
    }, error => {
      console.log("Failed", error);
    });
  }

  private setStoreGraph(schema) {
    console.log(schema);
  }

}
