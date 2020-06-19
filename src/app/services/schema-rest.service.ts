import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SchemaDataDTO, SchemaDTO, SchemaDTOResponseLight, SchemaDTOResponse, } from '../interfaces/schema-data.interface';


export interface NamedSchemaDTO {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class SchemaRestService {

  constructor(private http: HttpClient) { }

  loadAllSchemas(): Observable<Array<SchemaDTOResponseLight>> {
    return this.http.get<Array<SchemaDTOResponseLight>>('/api/schema/load/')
  }

  public loadSchema(id: number): Observable<SchemaDTOResponse>{
    return this.http.get<SchemaDTOResponse>(`/api/schema/load/` + id);
  }

  saveSchema(schemaDTO: SchemaDTO): Observable<SchemaDTO> {
    const request: SchemaDTO = { id: 0, name: schemaDTO.name, schemaData: schemaDTO.schemaData };
    return this.http.post<SchemaDTO>(`/api/schema/`, request);
  }

<<<<<<< HEAD
  generateSql(idSchema: number): Observable<string> {
    return this.http.get<string>(`/api/schema/generate?id=` + idSchema)
=======
  generateSql(idSchema: number): Observable<any> {
    let options = { withCredentials: true };
    return this.http.get<String>(`/api/schema/generate?id=` + idSchema, options)
>>>>>>> 082f662b69b0961f21be75a199bea2ed070e1aa8
  }
}
