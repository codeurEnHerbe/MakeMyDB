import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
// import { mxGraphModel, mxGraph, mxCell } from 'mxgraph';
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
        const { mxGraph, mxGraphModel } = mxgraphFactory({
            mxLoadResources: false,
            mxLoadStylesheets: false,
        });
         
        const container = document.getElementById("chart");
        if (container) {
            const model: mxgraph.mxGraphModel = new mxGraphModel();
            const graph: mxgraph.mxGraph = new mxGraph(container, model);
            var parent = graph.getDefaultParent();
            var v1 = graph.insertVertex(parent, null, 'Hello,', 50, 20, 80, 30);
            var v2 = graph.insertVertex(parent, null, 'Hello2,', 20, 20, 80, 30);
            var e1 = graph.insertEdge(parent, null, '', v1, v2);
        }
    }
}