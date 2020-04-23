import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
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
  export class CanvasComponent implements OnInit {

    @Input() newEntity;
  
    @Input() mouseStat;
  
    sourceSelectedNode: string = null;
  
    loadedAllSchemasByName: Array<SchemaDTO> = [];
  
    WIDTH = 800;
    HEIGHT = 600;
    MARGIN = {RIGHT: 0, LEFT: 0, TOP: 0, BOTTOM: 0};
    LINK_COLOR = "#b3b3b3";
    defs;
  
    dragableElements: Drag[] = [];
    links: any[] = [];
    linksElements: {_groups:any[]};
    
    groupeTextsElements = [];
  
    canDrag: boolean;
  
    constructor(private schemaRestService:SchemaRestService) { 
    }
  
    ngOnInit(){
        const { mxGraph, mxGraphModel, mxConstants, mxEdgeStyle, mxCell, mxGeometry, mxUtils } = mxgraphFactory({
            mxLoadResources: false,
            mxLoadStylesheets: false,
        });
        
        const container = document.getElementById("chart");
        if (container) {
            const model: mxgraph.mxGraphModel = new mxGraphModel();
            const graph: mxgraph.mxGraph = new mxGraph(container, model);
            var parent = graph.getDefaultParent();
            const newClickEvent = graph.addListener("click",(sender, evt)=>{
              console.log(sender)
              console.log(evt)
            });
            
            graph.setDropEnabled(false)
            graph.setVertexLabelsMovable(false);
            graph.setDisconnectOnMove(false);
            graph.setEscapeEnabled(false)
            graph.setResizeContainer(false)
            graph.setCellsResizable(false)
            graph.setCellsSelectable(false);
            graph.connectionHandler.constraintHandler.setEnabled(false)
            //graph.getAllConnectionConstraints
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
            var v1 = graph.insertVertex(parent, null, '<img src="https://yamikamisama.fr/dl/portal.gif" width="100px"/><b>BOLD</b>,\n pas bold', 50, 20, 80, 30);
            var v2 = graph.insertVertex(v1, null, 'Hello2,', 20, 20, 80, 30);
            var c1 = graph.addCell(new mxCell("Chocolat", new mxGeometry(10, 100, 100, 30)), parent)
            console.log(graph.getLabel(v1))

            //console.log(v1.getValue) //.push(v2)
            var e1 = graph.insertEdge(parent, null, '', v1, v2);
        }
    }
}