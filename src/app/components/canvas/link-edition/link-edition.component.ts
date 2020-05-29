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

  @Output()
  onDelete: EventEmitter<Link> = new EventEmitter();
  

  constructor() { }

  ngOnInit() { }

  deleteEntity(){
    this.onDelete.emit(this.link)
  }

  validate(){
    this.linkChange.emit(this.link);
    console.log(this.link)
  }

}
