import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../Models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  
  //URL = 'https://backendportfolioap.herokuapp.com/persona/';
  
   URL = 'http://localhost:8080/persona/';


  constructor(private http:HttpClient) { }



  public getPersona(): Observable<Persona[]>{
    return this.http.get<Persona[]>(this.URL+'traer')
    }
  
  public  getPersonaId(id:number):Observable<Persona>{
      return this.http.get<Persona>(this.URL+"traer/"+id);
    }

  public updatePersona(persona: Persona):Observable<Persona>
    {
    return this.http.put<Persona>(this.URL+'editar/'+persona.id,persona)
  }
}
