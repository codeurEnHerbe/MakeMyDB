import { Component, OnInit, Input, Output, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
//import { mxGraphModel, mxGraph, mxCell } from 'mxgraph';
import { mxgraph, mxgraphFactory } from "ts-mxgraph";
import { Type } from 'src/app/interfaces/type.enum';
import { Entity } from 'src/app/interfaces/entity.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
  })
  export class CanvasComponent implements OnInit, OnChanges {

    @Input() newEntity: Drag;
    oldNewEntity: Drag;
  
    @Input() mouseStat;
  
    sourceSelectedNode: string = null;
  
    loadedAllSchemasByName: Array<SchemaDTO> = [];
  
    canDrag: boolean;

    mxGraph: typeof mxgraph;
    graph: mxgraph.mxGraph;
    parent: mxgraph.mxCell;

    selectedElement;
    
    entitys: Drag[] = [];

    entity: Entity;

    changeElement: mxgraph.mxCell;
  
    @Output()
    change: EventEmitter<{entitys: Drag[], reliations: Drag[]}> = new EventEmitter();

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
        });

        //Event Listener
        graph.addListener("click",(sender, evt)=>{
          //TODO a réspooudre un jour graph.cellsOrdered([evt.properties.cell],false)
          if(evt.properties.cell){
            if(this.mouseStat == MouseAction.LINK){
              
              if(!this.selectedElement){
                this.selectedElement = evt.properties.cell;
              }else{
                let vertex: mxgraph.mxCell  = evt.properties.cell;
                  this.linkDrag(this.selectedElement,vertex);
                  this.selectedElement = null;
              }
            }else if(this.mouseStat == MouseAction.EDIT){
              console.log(evt.properties.cell)
                this.changeElement = evt.properties.cell;
                this.entity = this.entitys.find(ent => ent.elementId == this.changeElement.id).element
                console.log(this.changeElement,this.entity)
                this.change.emit({entitys: this.entitys, reliations: []})
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
        
        let elem = {name:"test",attributes:[{name: "variableTest",type: Type.varchar,isPrimary: false},{name: "autre test",type: Type.int,isPrimary: true}]};
        let newVertex: any = this.addNewDrag({element: elem, elementId: "test"})

        let defaultEntity =  {name:"test2",attributes:[
          {name: "variableTest",type: Type.varchar,isPrimary: false},
          {name: "autre test",type: Type.int,isPrimary: true},
          {name: "variableTest",type: Type.varchar,isPrimary: false},{name: "autre test",type: Type.int,isPrimary: true},{name: "autre test",type: Type.int,isPrimary: true},{name: "variableTest",type: Type.varchar,isPrimary: false},{name: "variableTest",type: Type.varchar,isPrimary: false},{name: "variableTest",type: Type.varchar,isPrimary: false}
        ]};
        newVertex = this.addNewDrag({element: defaultEntity, elementId: defaultEntity.name});
      }

    ngOnChanges(){
      if(this.newEntity != this.oldNewEntity){
        this.addNewDrag(this.newEntity);
        this.oldNewEntity = this.newEntity;
      }
    }

    private addNewDrag(newEntity: Drag){
      const existingEntity = this.entitys.find( entity => entity.element.name == newEntity.element.name );
      if(!existingEntity){
        const vertex = this.createGraphVertex(newEntity);
        this.entitys.push(newEntity)
        this.change.emit({entitys: this.entitys, reliations: []})
        return this.graph.insertVertex(this.parent, newEntity.elementId ,vertex.html , vertex.x, vertex.y, vertex.w, vertex.h)//.setStyle("")
      }
      return false;
    }

    private linkDrag(d1,d2){
      this.graph.insertEdge(this.parent, null, '1:1  -  1:1', d1, d2);
    }

    private updateEntity($event){
      const existingEntity = this.entitys.find( entity => entity.element.name == $event.name );
      if(existingEntity){
        const drag = this.createGraphVertex({element: $event,elementId:"",x:this.changeElement.geometry.x, y:this.changeElement.geometry.y});
        this.graph.cellLabelChanged(this.changeElement,drag.html, false)
        this.changeElement.geometry.width = drag.w;
        this.changeElement.geometry.height = drag.h;
        this.graph.refresh(this.changeElement)
        this.changeElement = null;
        this.change.emit({entitys: this.entitys, reliations: []})
      }
    }

    private updateRelation($event){
      
    }

    private createGraphVertex(drag: Drag): {html: string, x: number,y: number,w: number,h: number}{
      let html = `<div><div style="text-align: center;padding: 2px;font-size: 15px;font-weight: bold;">${drag.element.name}</div>`
      html += "<div style='display: block;width: 100%;height: 1px;background-color: black;padding: 0px;margin: 0px;'></div>"+
      "<table style='margin-top: 5px'>";
      let length = 0;
      drag.element.attributes.forEach( element => {
        let varLength = element.name.length+element.type.length;
        if(element.foreignAttribute) varLength=varLength+2;
        if(varLength > length) length=varLength ;
        html += `<tr style="margin: 0px; padding: 0px"><td><div style="text-align: left;padding-left: 5px;font-size: 15px;${element.isPrimary?"text-decoration:underline;":""}">${
          (element.foreignAttribute?"<b>#&nbsp</b>":"")+element.name
        }</div></td>`;
        html += `<td><div style="text-align: right;padding-right: 5px;padding-left: 10px;font-size: 15px;font-weight: bold;">${element.type}</div></td></tr>`;
      });
      html += "</table></div>";
      const newVertexData = {html: html, x:drag.x, y: drag.y, w: length*8+10<110?110:length*8+10, h: drag.element.attributes.length*20+30};
      console.log(newVertexData)
      return newVertexData;
    }
}