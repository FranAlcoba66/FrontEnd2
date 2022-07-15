import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from '../Models/persona';
import { PersonaService } from '../Services/persona.service';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  persona: Persona =new Persona();
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;
  base64:String;

  isAdmin = false;
  roles: string[];


  constructor(config: NgbModalConfig, 
    private modalService: NgbModal,
    private fb:FormBuilder,
    public httpClient:HttpClient,
    private PersonaService:PersonaService,
    private tokenService:TokenService) {
      // customize default values of modals used by this component tree
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit(): void {
    this.getPersona();
    this.editForm = this.fb.group({
      id: [''],
      nombre: [''],
      apellido: [''],
      titulo: [''],
      acercaDe: [''],
      img:[''],
      banner:[''],
    });
  }

  
  getPersona():void {
    this.PersonaService.getPersona().subscribe(
      data => {
        this.persona = data;
      }),

      this.roles = this.tokenService.getAuthorities();
      this.roles.forEach(rol => {
        if (rol === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
      });
  }




  // getPersona(){
  //   this.PersonaService.getPersona().subscribe(data=>(this.persona=data));
  // }

  // updatePersona(persona:Persona){
  //   this.PersonaService.updatePersona(persona).subscribe(data=>(this.persona=data));
  // }

  obtener(e: any) {     
    this.base64 = e[0].base64; 
    this.editForm.value.img=this.base64;  
  }
  obtener2(e: any) {     
    this.base64 = e[0].base64; 
    this.editForm.value.banner=this.base64;  
  }



  openEdit(targetModal, persona:Persona) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: persona.id,
      nombre: persona.nombre,
      apellido: persona.apellido,
      titulo: persona.titulo,
      acercaDe: persona.acercaDe,
      img: persona.img,
      banner: persona.banner,
      
    
    });
   }




  onSave() {
    const editURL = 'http://localhost:8080/persona/' + 'editar/'  + this.editForm.value.id ;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
