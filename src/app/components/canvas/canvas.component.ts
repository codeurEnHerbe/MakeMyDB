import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Dragable } from "src/app/interfaces/dragable.interface";
import { MouseAction } from '../tool-box/tool-box.component';
import { mxgraph, mxgraphFactory } from "ts-mxgraph";
import { Entity } from 'src/app/interfaces/entity.interface';
import { Relation } from 'src/app/interfaces/relation.interface';
import { SchemaDataDTO } from 'src/app/interfaces/schema-data.interface';
import { Link } from 'src/app/interfaces/link.interface';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
  })
export class CanvasComponent implements OnInit, OnChanges {
  
  @Input() mouseStat;

  @Input() loadedData: SchemaDataDTO;

  mxGraph: typeof mxgraph;
  graph: mxgraph.mxGraph;
  parent: mxgraph.mxCell;

  selectedElement: {cell:mxgraph.mxCell, cellModel: Dragable, type:"Entity"|"Relation"};

  indexIdElements: number = 2;
  
  entities: Dragable[] = [];
  
  editedDragable: Entity;
  dragableOldName: string;

  relations: Dragable[] = [];

  editedLink: Link;
  editedLinkRelationParent: Relation;

  changeElement: mxgraph.mxCell;

  mouseCoordOrigine: {x: number, y: number};
  translateCoordOrigine: {x: number, y: number};

  @Output()
  change: EventEmitter<SchemaDataDTO> = new EventEmitter();

  constructor() { 
  }

  ngOnChanges(changes: any): void {
    if(this.graph && changes.loadedData){
      const { mxGraph, mxGraphModel } = this.mxGraph;
      this.graph.destroy()

      this.entities = [];
      this.relations = [];
      this.ngOnInit();
    }
  }
  
  mouseDown($event){
    if( this.mouseStat == MouseAction.GRAB ){
      this.mouseCoordOrigine = {x: $event.offsetX, y:$event.offsetY}
      this.translateCoordOrigine = {x: this.graph.view.translate.x, y: this.graph.view.translate.y}
    }
  }

  mouseMove($event){
    if( this.mouseStat == MouseAction.GRAB && this.mouseCoordOrigine ){
      const newCoordX = this.translateCoordOrigine.x + $event.offsetX-this.mouseCoordOrigine.x;
      const newCoordY = this.translateCoordOrigine.y + $event.offsetY-this.mouseCoordOrigine.y
      this.graph.view.setTranslate(newCoordX,newCoordY);
    }
  }

  ngOnInit(){
    this.mxGraph = mxgraphFactory({
        mxLoadResources: false,
        mxLoadStylesheets: false,
    });

    const { mxGraph, mxGraphModel } = this.mxGraph;
    
    const container = document.getElementById("chart");
    
    const model: mxgraph.mxGraphModel = new mxGraphModel();
    this.graph = new mxGraph(container, model);
    let graph = this.graph;
    var parent = graph.getDefaultParent();
    this.parent = parent;

    this.setConfig(graph);
    this.setEventHandler(graph);
    this.importeDragables();
  }

  private addNewDragable(newDragable: Dragable, type:"Entity"|"Relation", idNew: boolean = false){
    const existingEntity = this.entities.filter( entity => entity.element.name.toLowerCase() == newDragable.element.name.toLowerCase() );
    const existingRelation = this.relations.filter( entity => entity.element.name.toLowerCase() == newDragable.element.name.toLowerCase() );

    const vertex = this.createEntityVertex(newDragable);
    
    if(type == "Entity" && existingEntity.length<1){
      this.entities.push(newDragable)
      const newVertex = this.graph.insertVertex(this.parent, newDragable.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h)
      if(idNew) newDragable.elementId = newVertex.id;//mxgraph change les id tout seul :/ ducoup pas le choix
      this.change.emit({entities: this.entities, relations: this.relations})
      return newVertex;

    }else if( type == "Relation" && existingRelation.length<1 ){
      this.relations.push(newDragable)
      const newVertex = this.graph.insertVertex(this.parent, newDragable.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h, "rounded=1;shape=ellipse;");
      if(idNew) newDragable.elementId = newVertex.id;
      this.change.emit({entities: this.entities, relations: this.relations})
      return newVertex;
    }
    
    return false;
  }

  private linkDragable(d1: mxgraph.mxCell, d2: mxgraph.mxCell, cardinalMin, cardinalMax, isNew = true, id){
    const isD1Entity = this.entities.find( entity => entity.elementId == d1.id );
    const isD2Entity = this.entities.find( entity => entity.elementId == d2.id );

    if(isD1Entity){
      const relation = this.relations.find( relation => relation.elementId == d2.id );
      const newLinkCell = this.graph.insertEdge(this.parent, id, cardinalMin+":"+cardinalMax, d1, d2);
      if(isNew) relation.element.links.push({id: newLinkCell.id,entityName: isD1Entity.element.name, cardinalMax: "1", cardinalMin: "1"})
      this.change.emit({entities: this.entities, relations: this.relations});
    } else if(isD2Entity) {
      const relation = this.relations.find( relation => relation.elementId == d1.id );
      const newLinkCell = this.graph.insertEdge(this.parent, id, cardinalMin+":"+cardinalMax, d1, d2);
      if(isNew) relation.element.links.push({id: newLinkCell.id,entityName: isD2Entity.element.name, cardinalMax: "1", cardinalMin: "1"})
      this.change.emit({entities: this.entities, relations: this.relations});
    }
  }

  updateDragable($event){
    const existingEntity = this.entities.filter( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
    const existingRelation = this.relations.filter( relation => relation.element.name.toLowerCase() == $event.name.toLowerCase() );
    if( (existingEntity.length > 1) || (existingRelation.length > 1) || (existingEntity.length >= 1 && existingRelation.length >= 1)){
      Swal.fire({
        icon: "error",
        title: "Invalide name !",
        text: "This name is already used",
        heightAuto: false
      });
    }else{
      this.updateLinkName(this.dragableOldName,$event.name);
      const dragable = this.createEntityVertex({element: $event, elementId:null, x:this.changeElement.geometry.x, y:this.changeElement.geometry.y});
      this.graph.cellLabelChanged(this.changeElement,dragable.html, false)
      this.changeElement.geometry.width = dragable.w;
      this.changeElement.geometry.height = dragable.h;
      this.graph.refresh(this.changeElement)
      this.changeElement = null;
      this.change.emit({entities: this.entities, relations: this.relations});
      this.editedDragable = null;
      this.dragableOldName = null;
    }
  }

  updateLinkName(oldName: string, newName: string){
    this.relations.forEach( relationDragable =>{
      let relation: Relation = relationDragable.element;
      let link = relation.links.find( link => link.entityName == oldName);
      if(link){
        link.entityName = newName;
        return;
      }
    });
  }

  updateLink($event: Link){
    this.graph.cellLabelChanged(this.changeElement,$event.cardinalMin+" : "+$event.cardinalMax, false)
    this.graph.refresh(this.changeElement)
    this.change.emit({entities: this.entities, relations: this.relations});
    this.changeElement = null;
    this.editedLink = null;
  }

  private deleteEntity(entityCell, $event: Entity){
    const existingEntityIndex = this.entities.findIndex( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
    const existingRelationIndex = this.relations.findIndex( entity => entity.element.name.toLowerCase() == $event.name.toLowerCase() );
    Swal.fire({
      icon:"warning",
      title: `Delete "${$event.name}" ?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      heightAuto: false
    }).then( (value)=>{
      if(value.value){
        if(existingEntityIndex != -1){
          let deletedElement = this.entities.splice(existingEntityIndex,1)
          if(deletedElement.length > 0){
            this.relations.forEach(rel => {
              const index = rel.element.links.findIndex( link => link.entityName == deletedElement[0].element.name);
              rel.element.links.splice(index,1);
            });
          }
          this.editedDragable = null;
        }else{
          this.relations.splice(existingRelationIndex,1)
          this.editedDragable = null;
        }
        this.graph.removeCells([entityCell]);
        this.changeElement = null;
        this.change.emit({entities: this.entities, relations: this.relations});
      }
    });
  }

  private deleteLink(linkCell, lien: Link, parent: Relation){
    const index = parent.links.findIndex(link=> link.id == lien.id )
    if(index > -1){
      Swal.fire({
        icon:"warning",
        title: `Delete the link between "${parent.name}" and "${lien.entityName}" ?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        heightAuto: false
      }).then( (value)=>{
        if(value.value){
          parent.links.splice(index,1)
          this.graph.removeCells([linkCell]);
          this.changeElement = null;
          this.change.emit({entities: this.entities, relations: this.relations});
        }
      });
    }else{
      console.error("not found :",lien, parent.links,index)
    }
  }

  private createEntityVertex(dragable: Dragable): {html: string, x: number,y: number,w: number,h: number}{
    let html = `<div><div style="text-align: center;padding: 2px;font-size: 15px;font-weight: bold;">${dragable.element.name}</div>`
    html += "<hr style='display: block;width: 100%;background-color: black;padding: 0px;margin: 0px;'></hr>"+
    "<table style='padding-top: 5px; width: 100%'>";
    let length = 0;
    dragable.element.attributes.forEach( (element,index) => {
      let varLength = element.name.length+element.type.length;
      if(element.foreignAttribute) varLength=varLength+2;
      if(varLength > length) length=varLength ;
      html += `<tr style="margin: 0px; padding: 0px; background-color: rgba(100,130,185,${index%2?"0.3":"0"})"><td><div style="text-align: left;padding-left: 5px;font-size: 15px;${element.isPrimary?"text-decoration:underline;":""}">${
        (element.foreignAttribute?"<b>#&nbsp</b>":"")+element.name
      }</div></td>`;
      html += `<td><div style="text-align: right;padding-right: 5px;padding-left: 10px;font-size: 15px;font-weight: bold;">${element.type}</div></td></tr>`;
    });
    html += "</table></div>";
    if(length<dragable.element.name.length) length = dragable.element.name.length;
    const newVertexData = {html: html, x:dragable.x, y: dragable.y, w: length*9+10<110?110:length*9+10, h: dragable.element.attributes.length*20+30};
    return newVertexData;  
  }

  private importeDragables(){
    let indexFromSave = "2";
    
    //Chargement des données
    if(this.loadedData){
      //load entities
      this.loadedData.entities.forEach( savedEntity => {
        let loadedEntityDragable = this.addNewDragable(savedEntity, "Entity");
        if(loadedEntityDragable){
          if( Number.parseInt(loadedEntityDragable.id) > Number.parseInt(indexFromSave) ){
            indexFromSave=loadedEntityDragable.id;
          } 
        }
      });
  
      //Load Relations
      this.loadedData.relations.forEach( savedRelation => {
        const loadedRelationCell = this.addNewDragable(savedRelation,"Relation");
        if(loadedRelationCell){
          if( Number.parseInt(loadedRelationCell.id) > Number.parseInt(indexFromSave) ){
            indexFromSave=loadedRelationCell.id;
          } 
        }
        if(loadedRelationCell){
          const relation:Relation = savedRelation.element;
          relation.links.forEach( link =>{
            const entityCell = this.parent.children.find( cell=>{
              let foundEntity = this.entities.find( ent =>
                ent.elementId == cell.id &&
                ent.element.name == link.entityName
              );
              return foundEntity?cell:null;
            })
            if(entityCell && loadedRelationCell)
              this.linkDragable(entityCell,loadedRelationCell,link.cardinalMin,link.cardinalMax,false,link.id);
          });
        }
      });
    }
    this.indexIdElements = Number.parseInt(indexFromSave);
  }

  private setEventHandler(graph){
    const { mxEvent } = this.mxGraph;

    graph.addListener(mxEvent.CELLS_MOVED,(sender, evt)=>{
      graph.cellsOrdered(evt.properties.cells,false)
      let dragable:mxgraph.mxCell = evt.properties.cells[0]
      let foundEntity = this.entities.find(ent => {
        return ent.elementId == dragable.id
      })
      let foundRelation = this.relations.find(rel => {
        return rel.elementId == dragable.id
      })
      if(foundEntity){
        foundEntity.x = dragable.geometry.x
        foundEntity.y = dragable.geometry.y
      }else if(foundRelation){
        foundRelation.x = dragable.geometry.x
        foundRelation.y = dragable.geometry.y
      }
      
      this.change.emit({entities: this.entities, relations: this.relations})
    });

    //Event Listener
    graph.addListener("click",(sender, evt)=>{
      const cell: mxgraph.mxCell = evt.properties.cell;
      if(cell){
        let linkRelationTarget;
        let linkRelationSource;

        switch(this.mouseStat){
          case (MouseAction.LINK):
            let foundEntity: Dragable = this.entities.find(ent => ent.elementId == cell.id)
            let foundRelation: Dragable = this.relations.find(rel => rel.elementId == cell.id)

            if(!this.selectedElement){
              if(foundEntity){
                this.selectedElement = {cell: cell, cellModel: foundEntity, type:"Entity"};
              }else{
                this.selectedElement = {cell: cell, cellModel: foundRelation, type:"Relation"};
              }
            }else{
              if( (foundEntity && this.selectedElement.type == "Relation") ||
              (foundRelation && this.selectedElement.type == "Entity")){  
                let vertex: mxgraph.mxCell  = cell;
                this.linkDragable(this.selectedElement.cell,vertex,1,1,true,this.indexIdElements);
                this.indexIdElements++;
                this.selectedElement = null;
              }
              
            }
            break;
          case(MouseAction.EDIT):
              this.changeElement = cell;
              //cas edition lien
              linkRelationTarget = this.relations.find(ent => this.changeElement.target && ent.elementId == this.changeElement.target.id);
              linkRelationSource = this.relations.find(ent => this.changeElement.source && ent.elementId == this.changeElement.source.id);

              if(linkRelationTarget){
                this.editedLink = linkRelationTarget.element.links.find( link => link.id == cell.id )
                this.editedLinkRelationParent = linkRelationTarget.element;
              }else if(linkRelationSource){
                this.editedLink = linkRelationSource.element.links.find( link => link.id == cell.id )
                this.editedLinkRelationParent = linkRelationSource.element;

              //cas edition Dragable (entity/relation)
              }else{
                const entity = this.entities.find(ent => ent.elementId == cell.id);
                const relation = this.relations.find(ent => ent.elementId == cell.id);
                this.editedDragable = (entity?entity:relation).element;
                this.dragableOldName = (entity?entity:relation).element.name;
              }
              break;
          case(MouseAction.DELETE):
            this.changeElement = cell;

            linkRelationTarget = this.relations.find(ent => this.changeElement.target && ent.elementId == this.changeElement.target.id);
            linkRelationSource = this.relations.find(ent => this.changeElement.source && ent.elementId == this.changeElement.source.id);
            if(linkRelationTarget){
              let linkToDelete  = linkRelationTarget.element.links.find( link => link.id == cell.id )
              this.deleteLink(cell,linkToDelete,linkRelationTarget.element)
              
            }else if(linkRelationSource){
              let linkToDelete = linkRelationSource.element.links.find( link => link.id == cell.id )
              this.deleteLink(cell,linkToDelete,linkRelationSource.element)
                
            //cas edition Dragable (entity/relation)
            }else{
              const entity = this.entities.find(ent => ent.elementId == cell.id);
              const relation = this.relations.find(ent => ent.elementId == cell.id);
              this.deleteEntity(cell,(entity?entity:relation).element)
            }
            break;
        }
      }

      if(this.mouseStat == MouseAction.NEWENTITY){
        let newElement: Entity = {name: "Entity_"+this.indexIdElements++, attributes: []}
        this.addNewDragable({
          x: evt.properties.event.layerX - 60,
          y: evt.properties.event.layerY - 15,
          element: newElement,
          elementId: this.indexIdElements
        }, "Entity", true);
      }else if(this.mouseStat == MouseAction.NEWRELATION){
        let newElement: Relation = {name: "Relation_"+this.indexIdElements++, attributes: [], links: []}
        this.addNewDragable({
          x: evt.properties.event.layerX - 50,
          y: evt.properties.event.layerY - 15,
          element: newElement,
          elementId: this.indexIdElements
        }, "Relation", true);
      }else if( this.mouseStat == MouseAction.GRAB ){
        this.mouseCoordOrigine = null;
      }
    });
  }

  private setConfig(graph: mxgraph.mxGraph){
    const { mxConstants, mxEdgeStyle, mxRectangle } = this.mxGraph;

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
    graph.view.graphBounds.setRect(0,0,10,500)
    graph.setRecursiveResize(false);
  
    let style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    style[mxConstants.STYLE_STROKECOLOR] = '#1A73EB';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
    style[mxConstants.STYLE_FONTSIZE] = '10';
    style[mxConstants.STYLE_FILLCOLOR] = "#1A73EB";
    style[mxConstants.HIGHLIGHT_COLOR] = "#1A73EB";
    style[mxConstants.GUIDE_COLOR] = "#1A73EB";
    style[mxConstants.CONNECT_TARGET_COLOR] = "#1A73EB";
    style[mxConstants.STYLE_INDICATOR_STROKECOLOR] = "#1A73EB";
    
    
    graph.getStylesheet().putDefaultEdgeStyle(style);
  }
}