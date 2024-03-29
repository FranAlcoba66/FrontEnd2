import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habilidad } from '../Models/habilidad.model';

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {
  //URL = 'https://backendportfolioap.herokuapp.com/habilidad/';
  
   URL = 'http://localhost:8080/habilidad/';

  constructor(private http:HttpClient) { }
  
  public getHabilidad(): Observable<Habilidad[]>  {
    return this.http.get<Habilidad[]>(this.URL + 'traer');
  }

  public getHabilidadId(id: any): Observable<Habilidad> {
    return this.http.get<Habilidad>(this.URL + 'traer/' + id);
  }
  public addHabilidad(habilidad: Habilidad) {
    return this.http.post<Habilidad>(this.URL + 'crear', habilidad);
  }

  public deleteHabilidad(id: any) {
    return this.http.delete<Habilidad>(this.URL + 'borrar/' + id);
  }

  public updateHabilidad(habilidad: Habilidad ) {
    return this.http.put<Habilidad>(this.URL + 'editar/'+ habilidad.id,habilidad)
  }
 

}
