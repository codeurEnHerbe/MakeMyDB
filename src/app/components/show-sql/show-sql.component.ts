import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-sql',
  templateUrl: './show-sql.component.html',
  styleUrls: ['./show-sql.component.scss']
})
export class ShowSqlComponent implements OnInit {

  public sqlData;

  constructor( private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sqlData = +params['data'];
   });
  }

}
