import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
//import { mxGraphModel, mxGraph, mxCell } from 'mxgraph';
import { mxgraph, mxgraphFactory } from "ts-mxgraph";

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
    parent;

    selectedElement;
  
    constructor(private schemaRestService:SchemaRestService) { 
    }
  
    ngOnInit(){
        this.oldNewEntity = this.newEntity;
        this.mxGraph = mxgraphFactory({
            mxLoadResources: false,
            mxLoadStylesheets: false,
        });

        const { mxGraph, mxGraphModel, mxConstants, mxEdgeStyle, mxStylesheet } = this.mxGraph;

        
        const container = document.getElementById("chart");
        
        const model: mxgraph.mxGraphModel = new mxGraphModel();
        this.graph = new mxGraph(container, model);
        let graph = this.graph;
        var parent = graph.getDefaultParent();
        this.parent = parent;

        graph.addListener("MOUSE_MOVE",(sender, evt)=>{
          console.log("move",sender,evt)
        });

        //Event Listener
        graph.addListener("click",(sender, evt)=>{
          console.log(evt)
          if(this.mouseStat == MouseAction.LINK && evt.properties.cell){
            
            if(!this.selectedElement){
              this.selectedElement = evt.properties.cell;
            }else{
              let vertex: mxgraph.mxCell  = evt.properties.cell;
              while (vertex.id != "parent"){
                vertex = vertex.parent;
                if(!vertex) return;
              }
              if(vertex.id == "parent"){
                this.linkDrag(this.selectedElement,vertex);
                this.selectedElement = null;
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
        //graph.getStylesheet().putCellStyle()
        let defaultVertexStyle = mxStylesheet.prototype.createDefaultVertexStyle();
        console.log(defaultVertexStyle )
        var v1 = graph.insertVertex(parent, null, '<img src="https://yamikamisama.fr/dl/portal.gif" width="100px"/><b>BOLD</b>,\n pas bold', 50, 20, 80, 30);
        var v2 = graph.insertVertex(parent, "parent", '<div class="drag">  <div class="title">title</div>  <div class="separator"></div>  <div>    <table>      <tr>        <td class="name primary">idElement</td>        <td class="type">serial</td>      </tr>        <tr>          <td class="name">chose</td>          <td class="type">integer</td>        </tr>        <tr>          <td class="name">name</td>          <td class="type">string</td>        </tr>    </table>  </div></div>', 160, 20, 80, 30,"border: 1px solid black;    background-color: rgb(112, 215, 255);");
        var v3 = graph.insertVertex(v2, "children", 'children', 0, 20, 50, 30,"fillColor=#70d7ff");
        v3.setConnectable(false)
        console.log("v3",v3.setStyle(""))
        v3.setVertex(false)
        var e1 = graph.insertEdge(parent, null, '', v1, v2);
        
    }

    ngOnChanges(){
      if(this.newEntity != this.oldNewEntity){
        this.addNewDrag(this.newEntity);
        this.oldNewEntity = this.newEntity;
      }
    }

    private addNewDrag(newEntity: Drag){
      this.graph.insertVertex(this.parent, null, newEntity.label, 50, 20, 80, 30)
    }

    private linkDrag(d1,d2){
      this.graph.insertEdge(this.parent, null, '1:1  -  1:1', d1, d2);
    }

    private createGraphVertex(drag: Drag): {html: string, x: number,y: number,w: number,h: number}{
      const newVertexData = {html: drag.label, x:drag.x, y: drag.y, w: 100, h: 60};
      let html = `<div>${drag.element.name}</div>`
      return newVertexData;
    }
}