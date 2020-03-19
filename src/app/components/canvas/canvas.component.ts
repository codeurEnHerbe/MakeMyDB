import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
// import { ngx-graph } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() newEntity;

  sourceSelectedNode: string = null;

  list: Array<Drag> = [
    {
      id: 'first',
      label: 'A'
    }, {
      id: 'second',
      label: 'B'
    }, {
      id: 'third',
      label: 'C'
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

  constructor() { 
  }
  print(e){
    console.log(e)
  }

  ngOnInit() {
  }

  configureLink(id){
    if(this.sourceSelectedNode != null){
      let srcElement = this.list.find((e)=>e.id==this.sourceSelectedNode).id;
      let srcElement2 = this.list.find((e)=>e.id==id).id;
      
      this.link = [...this.link, {id: `${srcElement}-${srcElement2}`, source: srcElement, target:srcElement2, label:"label truc"}];
      this.sourceSelectedNode = null;
    } else this.sourceSelectedNode = id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['newEntity'].currentValue) {
      this.addNewEntity(changes["newEntity"].currentValue);
    }
  }
  private addNewEntity(newEntity: Drag) {
    this.list = [...this.list, newEntity];
  }

}
