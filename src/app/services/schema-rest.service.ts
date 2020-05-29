import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Schema } from '../interfaces/schema.interface';

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
    return this.http.get(`/api/schema/byName/${name}`, {withCredentials: true})
    .pipe(map( (response:Array<SchemaDTO>) => response));
  }

  getSchemaDTOs(){

  }

  saveSchema(schema: Schema) {
    this.http.post(`/api/schema/`, {"name": "test", "schemaData": "{\"entitys\": " + JSON.stringify(schema.entitys) + ", \"relations\" :" + JSON.stringify(schema.relations) + "}"}, {withCredentials: true, observe: 'response'}).subscribe( res =>{
      if(res.status == 200){
        console.log("Register Success")
        return true;
      }else{
        console.log("Something went wrong :c")
      }
    }
  );
  }
}
