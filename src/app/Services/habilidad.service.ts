import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habilidad } from '../Models/habilidad.model';

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {
 
  URL = 'http://localhost:8080/habilidad/';

  constructor(private http:HttpClient) { }
  
  public getHabilidad(): Observable<Habilidad[]>  {
    return this.http.get<Habilidad[]>(this.URL + 'traer');
  }

  

}
