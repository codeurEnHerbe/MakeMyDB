import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SchemaDataDTO, SchemaDTO } from '../interfaces/schema-data.interface';


export interface NamedSchemaDTO {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class SchemaRestService {

  constructor(private http: HttpClient) { }

  findAllSchemasByName(name: string): Observable<Array<SchemaDTO>> {
    return this.http.get(`/api/schema/byName/${name}`, { withCredentials: true })
      .pipe(map((response: Array<SchemaDTO>) => response));
  }

  getSchemaDTOs() {

  }

  saveSchema(schemaDTO: SchemaDTO) {
    const request: SchemaDTO = { id: 0, name: "test", schemaData: schemaDTO.schemaData };
    console.log(request)
    this.http.post<SchemaDTO>(`/api/schema/`, request, { withCredentials: true }).subscribe(res => {
      console.log("Succeded");
      schemaDTO.id = res.id;
    },
      error => {
        console.log("Failed", error);
      }
    );
  }

  generateSql(idSchema: number) {
    let options = { withCredentials: true };
    this.http.get<String>(`/api/schema/generate?id=` + 1, options).subscribe(res => {
      console.log(res);
    },
    error => {
      console.log("Failed", error);
    })
  }
}
