import { Component, OnInit, Attribute } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

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
    }, {
      id: 'TEST',
      label: 'TEST',
      attributes: [{id: 1, name: "id"}, {id: 2, name: "name"}]
    }
  ];

  constructor() { }

  ngOnInit() {
  }


  public createDrag(event){
    const node = {id:event, label:event};
    this.list.push(node);
    this.list = [...this.list];
  }
}
