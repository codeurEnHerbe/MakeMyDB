import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
import { mxgraph, mxgraphFactory } from "ts-mxgraph";
import { Entity } from 'src/app/interfaces/entity.interface';
import { Relation } from 'src/app/interfaces/relation.interface';
import { Schema } from 'src/app/interfaces/schema.interface';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
  })
  export class CanvasComponent implements OnInit, OnChanges {

    @Input() newEntity: Drag;
    oldNewEntity: Drag;
    @Input() newRelation: Drag;
    oldNewRelation: Drag;
  
    @Input() mouseStat;

    @Input() loadedData: Schema;
  
    sourceSelectedNode: string = null;
  
    loadedAllSchemasByName: Array<SchemaDTO> = [];
  
    canDrag: boolean;

    mxGraph: typeof mxgraph;
    graph: mxgraph.mxGraph;
    parent: mxgraph.mxCell;

    selectedElement: {cell:mxgraph.mxCell, cellModel: Drag, type:"Entity"|"Relation"};
    
    entitys: Drag[] = [];
    editedEntity: Entity;

    relations: Drag[] = [];
    editedRelation: Relation;

    changeElement: mxgraph.mxCell;
  
    @Output()
    change: EventEmitter<Schema> = new EventEmitter();

    constructor(private schemaRestService:SchemaRestService) { 
    }
    
    ngOnInit(){
        this.oldNewEntity = this.newEntity;
        this.mxGraph = mxgraphFactory({
            mxLoadResources: false,
            mxLoadStylesheets: false,
        });

        const { mxGraph, mxGraphModel, mxConstants, mxEdgeStyle, mxStylesheet, mxEvent } = this.mxGraph;

        
        const container = document.getElementById("chart");
        
        const model: mxgraph.mxGraphModel = new mxGraphModel();
        this.graph = new mxGraph(container, model);
        let graph = this.graph;
        var parent = graph.getDefaultParent();
        this.parent = parent;

        graph.addListener(mxEvent.CELLS_MOVED,(sender, evt)=>{
          graph.cellsOrdered(evt.properties.cells,false)
          let drag:mxgraph.mxCell = evt.properties.cells[0]
          console.log("name",drag.getAttribute("name"))
          let froundEntity = this.entitys.find(ent => ent.elementId == drag.id)
          let froundRelation = this.relations.find(ent => ent.elementId == drag.id)

          console.log(drag.geometry)
          if(froundEntity){
            froundEntity.x = drag.geometry.x
            froundEntity.y = drag.geometry.y
          }else if(froundRelation){
            froundRelation.x = drag.geometry.x
            froundRelation.y = drag.geometry.y
          }
          
          this.change.emit({entitys: this.entitys, relations: this.relations})
        });

        //Event Listener
        graph.addListener("click",(sender, evt)=>{
          const cell: mxgraph.mxCell = evt.properties.cell;
          console.log(cell)
          if(cell){
            if(this.mouseStat == MouseAction.LINK){
              let froundEntity: Drag = this.entitys.find(ent => ent.elementId == cell.id)
              let froundRelation: Drag = this.relations.find(ent => ent.elementId == cell.id)

              if(!this.selectedElement){
                if(froundEntity){
                  this.selectedElement = {cell: cell, cellModel: froundEntity, type:"Entity"};
                }else{
                  this.selectedElement = {cell: cell, cellModel: froundRelation, type:"Relation"};
                }
              }else{
                if( (froundEntity && this.selectedElement.type == "Relation") ||
                (froundRelation && this.selectedElement.type == "Entity")){  
                  let vertex: mxgraph.mxCell  = cell;
                  this.linkDrag(this.selectedElement.cell,vertex,1,1);
                  this.selectedElement = null;
                }
                
              }
            }else if(this.mouseStat == MouseAction.EDIT){
                this.changeElement = cell;
                const entity = this.entitys.find(ent => ent.elementId == cell.id);
                const relation = this.relations.find(ent => ent.elementId == cell.id);
                this.editedEntity = (entity?entity:relation).element;
            }
          }
        });
        
        graph.setDropEnabled(false)
        graph.setVertexLabelsMovable(false);
        graph.setDisconnectOnMove(false);
        graph.setEscapeEnabled(false)
        graph.setResizeContainer(false)
        graph.setCellsEditable(false);
        graph.setCellsResizable(false)
        graph.setCellsSelectable(false);
        graph.connectionHandler.constraintHandler.setEnabled(false)
        graph.setAllowDanglingEdges(false);
        graph.setHtmlLabels(true);
        let style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
        style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
        style[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
        style[mxConstants.STYLE_FONTSIZE] = '10';
        
        graph.getStylesheet().putDefaultEdgeStyle(style);
        
        //Chargement des données
        if(this.loadedData){
          console.log(this.loadedData)
          //load Entitys
          this.loadedData.entitys.forEach( savedEntity => {
            this.addNewDrag(savedEntity);
          });

          //Load Relations
          this.loadedData.relations.forEach( savedRelation => {
            const newRelationCell = this.addNewDrag(savedRelation,"Relation");
            if(newRelationCell){
              const relation:Relation = savedRelation.element;
              relation.links.forEach( link =>{
                const entityCell = this.parent.children.find( cell=> cell.id == link.entityName)
                this.linkDrag(entityCell,newRelationCell,link.cardinalMin,link.cardinalMax);
              });
            }
          });
        }


      }

    ngOnChanges(){
      if(this.newEntity != this.oldNewEntity){
        this.addNewDrag(this.newEntity);
        this.oldNewEntity = this.newEntity;
      }
      if(this.newRelation != this.oldNewRelation){
        this.addNewDrag(this.newRelation,"Relation");
        this.oldNewRelation = this.newRelation;
      }
    }

    private addNewDrag(newEntity: Drag, type:"Entity"|"Relation" = "Entity"){
      console.log(newEntity)
      const existingEntity = this.entitys.filter( entity => entity.element.name.toLowerCase() == newEntity.element.name.toLowerCase() );
      if(existingEntity.length<=1){
        const vertex = this.createEntityVertex(newEntity);
        
        if(type == "Entity"){
          this.entitys.push(newEntity)
          this.change.emit({entitys: this.entitys, relations: this.relations})
          const newVertex = this.graph.insertVertex(this.parent, newEntity.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h)
          return newVertex;
        }else{
          this.relations.push(newEntity)
          this.change.emit({entitys: this.entitys, relations: this.relations})
          const newVertex = this.graph.insertVertex(this.parent, newEntity.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h, "rounded=1;shape=ellipse;");
          return newVertex;
        }
        
      }
      return false;
    }

    private linkDrag(d1: mxgraph.mxCell, d2: mxgraph.mxCell, cardinalMin, cardinalMax){
      const isD1Entity = this.entitys.find( entity => entity.element.name == d1.id );

      if(isD1Entity){
        const relation = this.relations.find( relation => relation.element.name == d2.id );
        relation.element.links.push({entityName: d1.id, cardinalMax: "1", cardinalMin: "1"})
      } else {
        const relation = this.relations.find( relation => relation.element.name == d1.id );
        relation.element.links.push({entityName: d2.id, cardinalMax: "1", cardinalMin: "1"})
      }
      
      this.graph.insertEdge(this.parent, null, cardinalMin+":"+cardinalMax, d1, d2);
    }

    private updateEntity($event){
      const existingEntity = this.entitys.filter( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
      if(existingEntity.length<=1){
        const drag = this.createEntityVertex({element: $event,elementId:$event.name,x:this.changeElement.geometry.x, y:this.changeElement.geometry.y});
        this.graph.cellLabelChanged(this.changeElement,drag.html, false)
        this.changeElement.geometry.width = drag.w;
        this.changeElement.geometry.height = drag.h;
        this.graph.refresh(this.changeElement)
        this.changeElement = null;
        this.change.emit({entitys: this.entitys, relations: this.relations});
        this.editedEntity = null;
      }
    }

    private updateRelation($event){
      
    }

    deleteEntity($event: Entity){
      const existingEntityIndex = this.entitys.findIndex( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
      this.entitys.splice(existingEntityIndex,1)
      this.graph.removeCells([this.changeElement]);
      this.changeElement = null;
      this.change.emit({entitys: this.entitys, relations: this.relations});
      this.editedEntity = null;
    }

    private createEntityVertex(drag: Drag): {html: string, x: number,y: number,w: number,h: number}{
      let html = `<div><div style="text-align: center;padding: 2px;font-size: 15px;font-weight: bold;">${drag.element.name}</div>`
      html += "<div style='display: block;width: 100%;height: 1px;background-color: black;padding: 0px;margin: 0px;'></div>"+
      "<table style='padding-top: 5px; width: 100%'>";
      let length = 0;
      drag.element.attributes.forEach( (element,index) => {
        let varLength = element.name.length+element.type.length;
        if(element.foreignAttribute) varLength=varLength+2;
        if(varLength > length) length=varLength ;
        html += `<tr style="margin: 0px; padding: 0px; background-color: rgba(100,130,185,${index%2?"0.3":"0"})"><td><div style="text-align: left;padding-left: 5px;font-size: 15px;${element.isPrimary?"text-decoration:underline;":""}">${
          (element.foreignAttribute?"<b>#&nbsp</b>":"")+element.name
        }</div></td>`;
        html += `<td><div style="text-align: right;padding-right: 5px;padding-left: 10px;font-size: 15px;font-weight: bold;">${element.type}</div></td></tr>`;
      });
      html += "</table></div>";
      if(length<drag.element.name.length) length = drag.element.name.length;
      const newVertexData = {html: html, x:drag.x, y: drag.y, w: length*9+10<110?110:length*9+10, h: drag.element.attributes.length*20+30};
      return newVertexData;
    }
}