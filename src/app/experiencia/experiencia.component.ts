import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Experiencia } from '../Models/experiencia';
import { ExprienciaService } from '../Services/expriencia.service';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  experiencia: Experiencia[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;
  base64:String;

  isAdmin = false;
  roles: string[];


  constructor(config: NgbModalConfig, 
    private modalService: NgbModal,
    private fb: FormBuilder,
    public httpClient:HttpClient,
    private experienciaService:ExprienciaService,
    private tokenService:TokenService) { 
      // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    }

  ngOnInit(): void {
    this.getExperiencia();
    this.editForm = this.fb.group({
      id: [''],
      puesto: [''],
      empresa: [''],
      fechaIni: [''],
      fechaFin: [''],
      imagen:[''],
    });

  }

  public getExperiencia(){
    this.experienciaService.getExperiencia().subscribe(data => (this.experiencia = data));

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  obtener(e:any): void {     
    this.base64 = e[0].base64; 
    this.editForm.value.imagen=this.base64;  
  }

  // obtener(e: any) {     
  //   this.base64 = e[0].base64; 
  //   this.editForm.value.imagen=this.base64;  
  // }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  onSubmit(f: NgForm) {
    f.form.value.imagen=this.base64;
    console.log(f.form.value);
    this.experienciaService.addExperiencia(f.value)
      .subscribe((result) => {
        this.ngOnInit(); // reload the table
      });
      f.form.value.imagen=this.base64='';
    this.modalService.dismissAll(); // dismiss the modal
  }

  openEdit(targetModal, experiencia:Experiencia) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: experiencia.id,
      puesto: experiencia.puesto,
      empresa: experiencia.empresa,
      fechaIni: experiencia.fechaIni,
      fechaFin: experiencia.fechaFin,
      imagen: experiencia.imagen,
    
    });
   }




  onSave() {
    this.experienciaService.updateExperiencia(this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, experiencia:Experiencia) {
    this.deleteId = experiencia.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    this.experienciaService.deleteExperiencia(this.deleteId)
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
