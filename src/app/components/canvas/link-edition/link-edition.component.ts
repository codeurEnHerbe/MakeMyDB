import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from 'src/app/interfaces/link.interface';

@Component({
  selector: 'app-link-edition',
  templateUrl: './link-edition.component.html',
  styleUrls: ['./link-edition.component.scss']
})
export class LinkEditionComponent implements OnInit {

  @Input()
  link: Link;

  @Output()
  linkChange: EventEmitter<Link> = new EventEmitter();
  
  cardinal;

  constructor() { }

  ngOnInit() {
    this.cardinal = this.link.cardinalMin+","+this.link.cardinalMax
  }

  validate(){
    this.linkChange.emit(this.link);
  }

  setCardinal($val){
    this.cardinal = $val.srcElement.value;
    const cardial = $val.srcElement.value.split(",");
    this.link.cardinalMin = cardial[0];
    this.link.cardinalMax = cardial[1];
  }

}
