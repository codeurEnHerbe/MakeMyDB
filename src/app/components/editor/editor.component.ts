import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { MouseAction } from '../tool-box/tool-box.component';

import { SchemaDataDTO, SchemaDTO, SchemaDTOResponse, SchemaDTOResponseLight } from '../../interfaces/schema-data.interface';
import { SchemaRestService } from 'src/app/services/schema-rest.service';
import { switchMap } from 'rxjs/operators';
import { Relation } from 'src/app/interfaces/relation.interface';
import { Entity } from 'src/app/interfaces/entity.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  mouseStat = MouseAction.GRAB;
  storedGraph: SchemaDataDTO;
  currentSchema: SchemaDTO = {name: "Nouveau MCD", schemaData: {entities: [], relations: []} };
  currentUserSchemas: Array<SchemaDTOResponseLight>;

  constructor(private schemaService: SchemaRestService,
    private cdRef: ChangeDetectorRef,
    private zone:NgZone) {
    this.storedGraph = JSON.parse(localStorage.getItem("savedGraph"));

  }

  setStat(e){
    this.mouseStat=e;
  }

  ngOnInit() {
    this.loadAllSchemas();
  }

  canvasUpdate($event: SchemaDataDTO){
    if($event.entities){
      this.currentSchema = {name: "Nouveau MCD", schemaData: $event};
      localStorage.setItem("savedGraph",JSON.stringify($event));
    }
  }

  public saveSchema() {
    this.schemaService.saveSchema(this.currentSchema).pipe(
      switchMap( data => {
        this.currentSchema.id = data.id;

        return this.schemaService.loadAllSchemas();
      })
    ).subscribe(
      result => {
        this.currentUserSchemas = result;
      }
    );
    this.cdRef.detectChanges();
  }

  public generateSql(){
    if(this.verifySchema(this.currentSchema)){
      this.schemaService.generateSql(this.currentSchema.id).subscribe(res => {
        console.log(res);
      },
      error => {
        console.log("Failed", error);
      });
    }
  }

  private loadAllSchemas() {
    this.schemaService.loadAllSchemas()
    .subscribe(res => {
      this.currentUserSchemas = res;
    });
  }

  getStoreGraph(schema: SchemaDTOResponseLight) {
    this.schemaService.loadSchema(schema.id).subscribe(res => {
      this.currentSchema = {
        id: res.id,
        name: res.name,
        schemaData: JSON.parse(res.schemaData)
      };
      this.storedGraph = this.currentSchema.schemaData;
      console.log("Get Storad Graph",this.currentSchema)
    });
  }

  private verifySchema(shema: SchemaDTO): boolean{
    let entitiesDragable = shema.schemaData.entities;
    let relationsDragable = shema.schemaData.relations;

    let entitiesValide = true;
    let relationsValide = true;

    entitiesDragable.forEach( entitieDragable => {
      let havePrimaryKey = false;
      let allAttributesValide = true;
      const entity: Entity = entitieDragable.element;
      if(entity.attributes.length < 1){
        allAttributesValide = false;
        Swal.fire({
          icon: "error",
          title: "Schéma incorrect",
          html: "L'entité <b>\""+entity.name+"\"</b> n'a pas d'attribues."
        });
        return;
      }
      entity.attributes.forEach( attribute =>{
        if(attribute.isPrimary) havePrimaryKey=true;
      });

      if(!havePrimaryKey){
        Swal.fire({
          icon: "error",
          title: "Schéma incorrect",
          html: "L'entité <b>\""+entity.name+"\"</b> ne posséde aucune clée primaire"
        });
        return;
      }
      
    });

    if(entitiesValide){
      relationsDragable.forEach( relationDragable => {

        const relation: Relation = relationDragable.element;
        if(relation.links.length < 2){
          relationsValide=false;
          Swal.fire({
            icon: "error",
            title: "Schéma incorrect",
            html: "La relation \""+relation.name+"\" ne relie pas assée d'entités"
          });
          return;
        }
      });
    }
    return entitiesValide && relationsValide;
  }

}
