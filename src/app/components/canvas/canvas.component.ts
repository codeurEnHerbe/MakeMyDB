import { Component, OnInit, Input } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
// import { ngx-graph } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @Input() list: {id: string, label: string};

  nodes: Array<Drag> = [
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

  constructor() { }

  ngOnInit() {
  }

}
