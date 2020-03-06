import { Component, OnInit } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  list: Array<Drag> = [];

  constructor() { }

  ngOnInit() {
  }


  public createDrag(event){
    this.list.push(event);
  }
}
