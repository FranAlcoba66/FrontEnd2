import { Injectable } from '@angular/core';
import { Educacion } from '../Models/educacion.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EducacionService {

  //URL = 'https://backendportfolioap.herokuapp.com/educacion/';
   URL = 'http://localhost:8080/educacion/';

  // private _refresh$= new Subject<void>();
  
  constructor(private http: HttpClient) { }

 

  public getEducacion(): Observable<Educacion[]>  {
    return this.http.get<Educacion[]>(this.URL + 'traer');
  }
  public getEducacionId(id: any): Observable<Educacion> {
    return this.http.get<Educacion>(this.URL + 'traer/' + id);
  }
  public addEducacion(educacion: Educacion) {
    return this.http.post<Educacion>(this.URL + 'crear', educacion);
  }

  public deleteEducacion(id: any) {
    return this.http.delete<Educacion>(this.URL + 'borrar/' + id);
  }

  public updateEducacion(educacion: Educacion) {
    return this.http.put<Educacion>(this.URL + 'editar/'+ educacion.id,educacion)
  }
 

}
