import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
import * as d3 from 'd3';
// import { ngx-graph } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @Input() newEntity;

  @Input() mouseStat? = MouseAction.LINK;

  sourceSelectedNode: string = null;

  loadedAllSchemasByName: Array<SchemaDTO> = [];

  WIDTH = 800;
  HEIGHT = 600;
  MARGIN = {RIGHT: 0, LEFT: 0, TOP: 0, BOTTOM: 0};
  LINK_COLOR = "#b3b3b3";
  svg;
  defs;

  rects: Drag[];
  links: any[];
  linksElements: {_groups:any[]};

  canDrag: boolean;

  constructor(private schemaRestService:SchemaRestService) { 
  }

  ngOnInit(){
    this.svg = d3.select("#chart").append("svg")
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .attr("transform", "translate(" + this.MARGIN.LEFT + "," + this.MARGIN.TOP + ")");

      this.rects = [{
        id:1,
        x:10,
        y: 120,
        width: 200,
        height: 40
      },{
        id:2,
        x:40,
        y: 40,
        width: 20,
        height: 20
      },{
        id:3,
        x:60,
        y: 40,
        width: 20,
        height: 20
      }];

      this.links = [{
        source: 2,
        target: 1,
        elem: null
      }]

      this.makeRects(this.rects);
      
      this.linksElements = this.makeLines(this.links);
      console.log( this.linksElements)
  }

  print(e){
    console.log(e)
  }

  nodeClick(id){
    switch(this.mouseStat){
      case MouseAction.LINK :
         if(this.sourceSelectedNode){
           const newLine = {source:this.sourceSelectedNode, target:id};
          this.links.push(newLine)
          const newLineSVG =  this.makeLines([newLine])._groups[0]
          console.log(newLineSVG)
          this.linksElements._groups.push( newLineSVG );
          this.sourceSelectedNode = null;
         }else{
          this.sourceSelectedNode = id;
         }
         
        break;

        case MouseAction.EDIT:

        break;

        case MouseAction.GRAB:

        break;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['newEntity'] && changes['newEntity'].currentValue) {
      this.addNewEntity(changes["newEntity"].currentValue);
    }
  }
  private addNewEntity(newEntity: Drag) {
    newEntity.x = 10;
    newEntity.y = 80;
    newEntity.width = 200;
    newEntity.height = 40;
    this.rects.push(newEntity)
    this.makeRects([newEntity])
  }

  drag(instance: CanvasComponent){

    function dragstarted(d) {
      //A utiliser un jour (peut être)
      console.log(instance.rects)
    }
  
    function dragged(d) {
      if(instance.mouseStat == MouseAction.GRAB){
        //Update du drag
        d.x += d3.event.dx;
        d.y += d3.event.dy;

        //Update du svg
        d3.select(this)
        .attr('x',d3.event.x)
        .attr('y',d3.event.y)
        .raise();
        
        instance.updateLinksByElem(d);
      }
    }
  
    function dragended(d) {
      //A utiliser un jour (peut être)
    }
  
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  private makeRects(rects){
      this.svg.selectAll(".node")
      .data(rects)
      .enter()
      .append('rect')
      .attr('id', d=>d.id)
      .attr('x', d=>d.x)
      .attr('y', d=>d.y)
      .attr('width', d=>d.width)
      .attr('height', d=>d.height)
      .attr('stroke', 'black')
      .attr('fill', 'green')
      .call(this.drag(this))
      .on("click",d=>this.nodeClick(d.id))
  }

  private makeLines(links){
    return this.svg.selectAll(".node")
      .data(links)
      .enter()
      .append('line')
      .attr('id', d=>d.source+"@"+d.target)
      .attr('x1', d=>this.getElementById(d.source).x)
      .attr('y1', d=>this.getElementById(d.source).y)
      .attr('x2', d=>this.getElementById(d.target).x)
      .attr('y2', d=>this.getElementById(d.target).y)
      .attr('stroke', 'black')
      .lower()
  }

  private updateLinksByElem(id){

    this.linksElements._groups.forEach(elem => {
      const link = elem[0];
      const source = link.id.split("@")[0];
      const target = link.id.split("@")[1];
      const linkElement = d3.select(link);
      let x = d3.event.x;
      let y = d3.event.y;

      if(id.id == source){
        const sourceElem = this.getElementById(source);
        linkElement.attr("x1", x + sourceElem.width/2)
        .attr("y1", y + sourceElem.height/2);
      }else if(id.id == target){
        const targetElem = this.getElementById(target);
        linkElement.attr("x2",x + targetElem.width/2)
        .attr("y2",y + targetElem.height/2 ) ;
      }
    });
  }

  getElementById(id: number){
    let elem = Object.create(this.rects.find( elem=>elem.id == id) );
    if(elem){
      elem.x = elem.x+elem.width/2 ;
      elem.y = elem.y+elem.height/2 ;
      return elem;
    }else
      return null;
  }

  loadAllSchemasByName(){
    this.schemaRestService.findAllSchemasByName("test").subscribe((values)=>{
      this.loadedAllSchemasByName = values;
    }, (error)=>{
      console.error(error)
    });
  }

}
