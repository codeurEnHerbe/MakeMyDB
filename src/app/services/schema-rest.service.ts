import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SchemaDTO, SchemaDTOResponseLight, SchemaDTOResponse, } from '../interfaces/schema-data.interface';


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

  generateSql(idSchema: number): Observable<HttpResponse<string>> {
    return this.http.get<string>(`/api/schema/generate/` + idSchema, {observe: 'response'})
  }

  deleteSchema(): Observable<any>{
    
    console.log("value")
    return of();
  }
}
