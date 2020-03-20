import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
import { SchemaRestService, SchemaDTO } from 'src/app/services/schema-rest.service';
import { MouseAction } from '../tool-box/tool-box.component';
// import { ngx-graph } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() newEntity;

  @Input() mouseStat = MouseAction.LINK;

  sourceSelectedNode: string = null;

  list: Array<Drag> = [
    {
      id: 'first',
      label: 'A',
      x: 10,
      y: 10
    }, {
      id: 'second',
      label: 'B',
      x: 100,
      y: 100
    }, {
      id: 'third',
      label: 'C',
      x: 100,
      y: 150
    }
  ];

  link = [
    {
      id: 'a',
      source: 'first',
      target: 'second',
      label: 'is parent of'
    }, {
      id: 'b',
      source: 'first',
      target: 'third',
      label: 'custom label'
    }
  ];

  loadedAllSchemasByName: Array<SchemaDTO> = [];

  constructor(private schemaRestService:SchemaRestService) { 
  }

  getNodeXY(link){
    const node1 = this.list.find((n)=>n.id==link.source);
    const node2 = this.list.find((n)=>n.id==link.target);

    let result = {
      source:{x: node1.x, y: node1.y},
      target:{x: node2.x, y: node2.y}
    };

    console.log(result)

    return result;
  }

  print(e){
    console.log(e)
  }

  ngOnInit() {
  }

  nodeClick(id){
    switch(this.mouseStat){

      case MouseAction.LINK :
        if(this.sourceSelectedNode != null){
          let srcElement = this.list.find((e)=>e.id==this.sourceSelectedNode).id;
          let srcElement2 = this.list.find((e)=>e.id==id).id;
          
          this.link = [...this.link, {id: `${srcElement}-${srcElement2}`, source: srcElement, target:srcElement2, label:"label truc"}];
          this.sourceSelectedNode = null;
        } else this.sourceSelectedNode = id;
        break;

        case MouseAction.EDIT:

        break;

        case MouseAction.GRAB:

        break;

      }
  }

  canGrab(){
    return this.mouseStat == MouseAction.GRAB;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['newEntity'] && changes['newEntity'].currentValue) {
      this.addNewEntity(changes["newEntity"].currentValue);
    }
  }
  private addNewEntity(newEntity: Drag) {
    this.list = [...this.list, newEntity];
  }

  loadAllSchemasByName(){
    this.schemaRestService.findAllSchemasByName("test").subscribe((values)=>{
      this.loadedAllSchemasByName = values;
    }, (error)=>{
      console.error(error)
    });
  }

}
