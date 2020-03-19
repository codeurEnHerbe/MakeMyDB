import { Component, OnInit } from '@angular/core';
import { Drag } from 'src/app/interfaces/drag.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  newEntity;

  


  constructor() { }

  ngOnInit() {
  }


  public createDrag(event){
    this.newEntity = event;
  }
}
