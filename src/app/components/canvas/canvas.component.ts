import { Component, OnInit, Input } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';
// import { ngx-graph } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @Input() list: Array<Drag> = [];

  


  constructor() { }

  ngOnInit() {
  }

}
