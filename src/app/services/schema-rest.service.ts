import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SchemaDataDTO, SchemaDTO, schemaDTOResponse, schemaDTOResponseLight } from '../interfaces/schema-data.interface';


export interface NamedSchemaDTO {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class SchemaRestService {

  constructor(private http: HttpClient) { }

  loadAllSchemas(): Observable<Array<schemaDTOResponseLight>> {
    return this.http.get<Array<schemaDTOResponseLight>>('/api/schema/load/', { withCredentials: true })
  }

  getSchemaDTOs() {

  }

  saveSchema(schemaDTO: SchemaDTO) {
    const request: SchemaDTO = { id: 0, name: "test", schemaData: schemaDTO.schemaData };

    this.http.post<SchemaDTO>(`/api/schema/`, request, { withCredentials: true }).subscribe(res => {
      console.log("Succeded");
      schemaDTO.id = res.id;
    },
      error => {
        console.log("Failed", error);
      }
    );
  }
}
