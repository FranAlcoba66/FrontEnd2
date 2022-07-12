import { Component, OnInit } from '@angular/core';
import { Persona } from '../Models/persona';
import { PersonaService } from '../Services/persona.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  persona: Persona[];

  constructor(private PersonaService:PersonaService) { }

  ngOnInit(): void {
    this.getPersona();
  }

  getPersona(){
    this.PersonaService.getPersona().subscribe(data=>(this.persona=data))
  }

}
