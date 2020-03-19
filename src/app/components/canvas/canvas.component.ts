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

  constructor() { 
  }

  ngOnInit() {
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
