import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
import { mxgraph, mxgraphFactory } from "ts-mxgraph";
import { Entity } from 'src/app/interfaces/entity.interface';
import { Relation } from 'src/app/interfaces/relation.interface';
import { SchemaData } from 'src/app/interfaces/schema-data.interface';
import { Link } from 'src/app/interfaces/link.interface';

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

    @Input() loadedData: SchemaData;
  
    sourceSelectedNode: string = null;
  
    loadedAllSchemasByName: Array<SchemaDTO> = [];
  
    canDrag: boolean;

    mxGraph: typeof mxgraph;
    graph: mxgraph.mxGraph;
    parent: mxgraph.mxCell;

    selectedElement: {cell:mxgraph.mxCell, cellModel: Drag, type:"Entity"|"Relation"};

    indexIdElements: number = 2;
    
    entitys: Drag[] = [];
    editedEntity: Entity;

    relations: Drag[] = [];
    editedRelation: Relation;

    editedLink: Link;
    editedLinkRelationParent: Relation;

    changeElement: mxgraph.mxCell;
  
    @Output()
    change: EventEmitter<SchemaData> = new EventEmitter();

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
          let froundEntity = this.entitys.find(ent => {
            console.log("ent.elementId == drag.id",ent.elementId ,drag.id)
            return ent.elementId == drag.id
          })
          let froundRelation = this.relations.find(rel => {
            console.log("rel.elementId == drag.id",rel.elementId ,drag.id)
            return rel.elementId == drag.id
          })
          console.log("froundEntity:",froundEntity,"froundRelation:",froundRelation)
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
              let froundRelation: Drag = this.relations.find(rel => rel.elementId == cell.id)

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
                  this.linkDrag(this.selectedElement.cell,vertex,1,1,true,this.indexIdElements);
                  this.indexIdElements++;
                  this.selectedElement = null;
                }
                
              }
            }else if(this.mouseStat == MouseAction.EDIT){
                this.changeElement = cell;
                //cas edition lien
                let linkRelationTarget = this.relations.find(ent => this.changeElement.target && ent.elementId == this.changeElement.target.id);
                let linkRelationSource = this.relations.find(ent => this.changeElement.source && ent.elementId == this.changeElement.source.id);
                
                if(linkRelationTarget){
                  this.editedLink = linkRelationTarget.element.links.find( link => link.id == cell.id )
                  this.editedLinkRelationParent = linkRelationTarget.element;
                  console.log(linkRelationTarget.elementId, "cell.id", cell.id,linkRelationTarget.element.links)
                }else if(linkRelationSource){
                  this.editedLinkRelationParent = linkRelationSource.element;
                  console.log(linkRelationSource.elementId, "this.editedLink",this.editedLink)

                //cas edition drag (entity/relation)
                }else{
                  const entity = this.entitys.find(ent => ent.elementId == cell.id);
                  const relation = this.relations.find(ent => ent.elementId == cell.id);
                  this.editedEntity = (entity?entity:relation).element;
                }
            }else if(this.mouseStat == MouseAction.DELETE){
              //TODO
              this.changeElement = cell;
                //cas edition lien
                let linkRelationTarget = this.relations.find(ent => this.changeElement.target && ent.elementId == this.changeElement.target.id);
                let linkRelationSource = this.relations.find(ent => this.changeElement.source && ent.elementId == this.changeElement.source.id);
                
                if(linkRelationTarget){
                  let linkToDelete  = linkRelationTarget.element.links.find( link => link.id == cell.id )
                  this.deleteLink(cell,linkToDelete,linkRelationTarget.element)
                }else if(linkRelationSource){
                  let linkToDelete = linkRelationSource.element.links.find( link => link.id == cell.id )
                  this.deleteLink(cell,linkToDelete,linkRelationSource.element)
                  
                //cas edition drag (entity/relation)
                }else{
                  const entity = this.entitys.find(ent => ent.elementId == cell.id);
                  const relation = this.relations.find(ent => ent.elementId == cell.id);
                  this.deleteEntity(cell,(entity?entity:relation).element)
                }
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
        
        let indexFromSave = "2";

        //Chargement des données
        if(this.loadedData){
          console.log(this.loadedData)
          //load Entitys
          this.loadedData.entitys.forEach( savedEntity => {
            let loadedEntityDrag = this.addNewDrag(savedEntity, "Entity");
            console.log("load entity:",loadedEntityDrag)
            if(loadedEntityDrag){
              if( Number.parseInt(loadedEntityDrag.id) > Number.parseInt(indexFromSave) ){
                indexFromSave=loadedEntityDrag.id;
              } 
            }
          });

          //Load Relations
          this.loadedData.relations.forEach( savedRelation => {
            const loadedRelationCell = this.addNewDrag(savedRelation,"Relation");
            console.log("load relation:",loadedRelationCell, "savedRelation",savedRelation)
            if(loadedRelationCell){
              if( Number.parseInt(loadedRelationCell.id) > Number.parseInt(indexFromSave) ){
                indexFromSave=loadedRelationCell.id;
              } 
            }
            if(loadedRelationCell){
              const relation:Relation = savedRelation.element;
              relation.links.forEach( link =>{
                const entityCell = this.parent.children.find( cell=>{
                  let foundEntity = this.entitys.find( ent =>
                    ent.elementId == cell.id &&
                    ent.element.name == link.entityName
                  );
                  return foundEntity?cell:null;
                })
                if(entityCell && loadedRelationCell)
                  this.linkDrag(entityCell,loadedRelationCell,link.cardinalMin,link.cardinalMax,false,link.id);
              });
            }
          });
        }
        console.log("higher id =",indexFromSave)
        this.indexIdElements = Number.parseInt(indexFromSave);

      }

    ngOnChanges(){
      if(this.newEntity != this.oldNewEntity){
        this.newEntity.elementId = this.indexIdElements++;
        this.addNewDrag(this.newEntity, "Entity", true);
        this.oldNewEntity = this.newEntity;
      }
      if(this.newRelation != this.oldNewRelation){
        this.newRelation.elementId = this.indexIdElements++;
        this.addNewDrag(this.newRelation,"Relation", true);
        this.oldNewRelation = this.newRelation;
      }
    }

    private addNewDrag(newDrag: Drag, type:"Entity"|"Relation", idNew: boolean = false){
      
      const existingEntity = this.entitys.filter( entity => entity.element.name.toLowerCase() == newDrag.element.name.toLowerCase() );
      const existingRelation = this.relations.filter( entity => entity.element.name.toLowerCase() == newDrag.element.name.toLowerCase() );
      console.log("new drag", newDrag)

      const vertex = this.createEntityVertex(newDrag);
      
      if(type == "Entity" && existingEntity.length<1){
        this.entitys.push(newDrag)
        const newVertex = this.graph.insertVertex(this.parent, newDrag.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h)
        if(idNew) newDrag.elementId = newVertex.id;//mxgraph change les id tout seul :/ ducoup pas le choix
        this.change.emit({entitys: this.entitys, relations: this.relations})
        return newVertex;

      }else if( type == "Relation" && existingRelation.length<1 ){
        this.relations.push(newDrag)
        const newVertex = this.graph.insertVertex(this.parent, newDrag.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h, "rounded=1;shape=ellipse;");
        if(idNew) newDrag.elementId = newVertex.id;
        this.change.emit({entitys: this.entitys, relations: this.relations})
        return newVertex;
      }
      
      return false;
    }

    private linkDrag(d1: mxgraph.mxCell, d2: mxgraph.mxCell, cardinalMin, cardinalMax, isNew = true, id){
      const isD1Entity = this.entitys.find( entity => entity.elementId == d1.id );
      const isD2Entity = this.entitys.find( entity => entity.elementId == d2.id );

      if(isD1Entity){
        const relation = this.relations.find( relation => relation.elementId == d2.id );
        const newLinkCell = this.graph.insertEdge(this.parent, id, cardinalMin+":"+cardinalMax, d1, d2);
        if(isNew) relation.element.links.push({id: newLinkCell.id,entityName: isD1Entity.element.name, cardinalMax: "1", cardinalMin: "1"})
        this.change.emit({entitys: this.entitys, relations: this.relations});
      } else if(isD2Entity) {
        const relation = this.relations.find( relation => relation.elementId == d1.id );
        const newLinkCell = this.graph.insertEdge(this.parent, id, cardinalMin+":"+cardinalMax, d1, d2);
        if(isNew) relation.element.links.push({id: newLinkCell.id,entityName: isD2Entity.element.name, cardinalMax: "1", cardinalMin: "1"})
        this.change.emit({entitys: this.entitys, relations: this.relations});
      }

      
    }

    private updateEntity($event){
      const existingEntity = this.entitys.filter( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
      if(existingEntity.length <= 1){
        if(existingEntity.length > 0 )existingEntity[0].element.name = $event.name;
        const drag = this.createEntityVertex({element: $event, elementId:null, x:this.changeElement.geometry.x, y:this.changeElement.geometry.y});
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

    private updateLink($event: Link){
      console.log($event)
      this.graph.cellLabelChanged(this.changeElement,$event.cardinalMin+" : "+$event.cardinalMax, false)
      this.graph.refresh(this.changeElement)
      this.change.emit({entitys: this.entitys, relations: this.relations});
      this.changeElement = null;
      this.editedLink = null;
    }

    private deleteEntity(entityCell, $event: Entity){
      const existingEntityIndex = this.entitys.findIndex( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
      const existingRelationIndex = this.relations.findIndex( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
      if(existingEntityIndex != -1){
        let deletedElement = this.entitys.splice(existingEntityIndex,1)
        if(deletedElement.length > 0){
          this.relations.forEach(rel => {
            console.log(rel.element)
            const index = rel.element.links.findIndex( link => link.entityName == deletedElement[0].element.name);
            rel.element.links.splice(index,1);
          });
        }
        this.editedEntity = null;
      }else{
        this.relations.splice(existingRelationIndex,1)
        this.editedEntity = null;
      }
      this.graph.removeCells([entityCell]);
      this.changeElement = null;
      this.change.emit({entitys: this.entitys, relations: this.relations});
      
    }

    private deleteLink(linkCell, lien: Link, parent: Relation){
      const index = parent.links.findIndex(link=>link.id == lien.id)
      if(index){
        parent.links.splice(index,1)
        this.graph.removeCells([linkCell]);
        this.changeElement = null;
        this.change.emit({entitys: this.entitys, relations: this.relations});
      }
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