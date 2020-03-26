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

  node;

  rects;

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
      }]

      this.svg.append('rect')
      .data(this.rects)
      .attr('id', 'rect')
      .attr('x', d=>d.x)
      .attr('y', d=>d.y)
      .attr('width', d=>d.width)
      .attr('height', d=>d.height)
      .attr('stroke', 'black')
      .attr('fill', 'green')
      .call(this.drag(this.canGrab,this))
      
      this.svg.append('line')
      .attr('x1', 10)
      .attr('y1', 10)
      .attr('x2', 700)
      .attr('y2', 100)
      .attr('stroke', 'black')

      console.log(this.mouseStat)
  }

  print(e){
    console.log(e)
  }

  nodeClick(id){
    switch(this.mouseStat){
      case MouseAction.LINK :
         //TODO REDO
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
    this.rects.push({
      id:newEntity.id,
      x: d3.event.dx,
      y: d3.event.dy,
      width: 200,
      height: 40
    })
  }

  canGrab(instance) {
    return instance.mouseStat;
  }

  drag(mouseStat, instance){
    
    function dragstarted(d) {
      //A utiliser un jour (peut être)
    }
  
    function dragged(d) {
      if(mouseStat(instance) == MouseAction.GRAB){
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        d3.select(this).attr('transform', 'translate(' + d.x + ',' + d.y + ')');
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

  loadAllSchemasByName(){
    this.schemaRestService.findAllSchemasByName("test").subscribe((values)=>{
      this.loadedAllSchemasByName = values;
    }, (error)=>{
      console.error(error)
    });
  }

}
