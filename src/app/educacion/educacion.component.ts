import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Educacion } from '../Models/educacion.model';
import { EducacionService } from '../Services/educacion.service';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {


  educacion: Educacion[];
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
    private educacionService:EducacionService,
    private tokenService:TokenService) {
    //config
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void {
    this.getEducacion();
    this.editForm = this.fb.group({
      id: [''],
      nombre: [''],
      institucion: [''],
      fechaIni: [''],
      fechaFin: [''],
      imagen:[''],
    });
  }


    public getEducacion(){
    this.educacionService.getEducacion().subscribe(data => (this.educacion = data));

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  obtener(e:any): void {     
    this.editForm.value.imagen= e[0].base64;
    // this.base64 = e[0].base64; 
    // this.editForm.value.imagen=this.base64;  
  }




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
    this.educacionService.addEducacion(f.value)
      .subscribe((result) => {
        this.ngOnInit(); // reload the table
      });
     f.form.value.imagen=this.base64='';
    this.modalService.dismissAll(); // dismiss the modal
  }

  openEdit(targetModal, educacion:Educacion) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: educacion.id,
      nombre: educacion.nombre,
      institucion: educacion.institucion,
      fechaIni: educacion.fechaIni,
      fechaFin: educacion.fechaFin,
      imagen: educacion.imagen,
    
    });
   }



  onSave() {
    this.educacionService.updateEducacion(this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, educacion:Educacion) {
    this.deleteId = educacion.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    this.educacionService.deleteEducacion(this.deleteId) .subscribe((results) => {
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


function next(next: any, arg1: (response: any) => void) {
  throw new Error('Function not implemented.');
}

