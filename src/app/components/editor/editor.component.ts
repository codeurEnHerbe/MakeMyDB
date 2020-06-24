import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { MouseAction } from '../tool-box/tool-box.component';

import { SchemaDataDTO, SchemaDTO, SchemaDTOResponse, SchemaDTOResponseLight } from '../../interfaces/schema-data.interface';
import { SchemaRestService } from 'src/app/services/schema-rest.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  mouseStat = MouseAction.GRAB;
  storedGraph: SchemaDataDTO;
  currentSchema: SchemaDTO;
  currentUserSchemas: Array<SchemaDTOResponseLight>;
  sqlData: string;
  selectedListSchema: SchemaDTOResponseLight;
  showSchemaList: boolean = true;
  schemaNotSavedError: boolean = false;

  constructor(private schemaService: SchemaRestService,
    private cdRef: ChangeDetectorRef,
    private zone: NgZone) {
    this.storedGraph = JSON.parse(localStorage.getItem("savedGraph"));

  }

  setStat(e) {
    this.mouseStat = e;
  }

  ngOnInit() {
    this.loadAllSchemas();
  }

  canvasUpdate($event: SchemaDataDTO) {
    this.currentSchema = { name: "Nouveau MCD", schemaData: $event };

    console.log(JSON.stringify($event))
    localStorage.setItem("savedGraph", JSON.stringify($event));
  }

  public saveSchema() {
    this.schemaNotSavedError = false;
    this.schemaService.saveSchema(this.currentSchema).pipe(
      switchMap(data => {
        this.currentSchema.id = data.id;
        console.log(data.id)
        return this.schemaService.loadAllSchemas();
      })
    ).subscribe(
      result => {
        this.currentUserSchemas = result;
      }
    );
  }

  public generateSql() {
    this.showSchemaList = false;
    this.schemaService.generateSql(this.currentSchema.id).subscribe(res => {
      this.sqlData = res.body;
    },
      error => {
        if (error.status == 400) {
          this.schemaNotSavedError = true;
        }
      });
  }

  private loadAllSchemas() {
    this.schemaService.loadAllSchemas()
      .subscribe(res => {
        this.currentUserSchemas = res;
      });
  }

  private getStoreGraph(schema: SchemaDTOResponseLight) {
    this.selectedListSchema = schema;
    console.log("Get Storad Graph", this.currentSchema)
  }

  public loadSchema() {
    this.schemaService.loadSchema(this.selectedListSchema.id).subscribe(res => {
      this.currentSchema = {
        id: res.id,
        name: res.name,
        schemaData: JSON.parse(res.schemaData)
      };
      this.storedGraph = this.currentSchema.schemaData;
      console.log("Get Storad Graph", this.currentSchema)
    });
  }

  enableShowSchemaList(){
    this.showSchemaList = true;
  }

}
