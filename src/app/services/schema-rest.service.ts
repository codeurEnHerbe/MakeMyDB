import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SchemaDataDTO, SchemaDTO, SchemaDTOResponse, SchemaDTOResponseLight } from '../interfaces/schema-data.interface';


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

  saveSchema(schemaDTO: SchemaDTO): Observable<any> {
    const request: SchemaDTO = { id: 0, name: schemaDTO.name, schemaData: schemaDTO.schemaData };
    return this.http.post<SchemaDTO>(`/api/schema/`, request);
  }

  generateSql(idSchema: number): Observable<any> {
    let options = { withCredentials: true };
    return this.http.get<String>(`/api/schema/generate?id=` + idSchema, options)
  }
}
