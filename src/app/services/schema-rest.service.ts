import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface SchemaDTO {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchemaRestService {

  constructor(private http:  HttpClient) { }

  findAllSchemasByName(name: string): Observable<Array<SchemaDTO>>{
    return this.http.get(`/api/schema/byName/${name}`)
    .pipe(map( (response:Array<SchemaDTO>) => response));
  }

  getSchemaDTOs(){

  }
}
