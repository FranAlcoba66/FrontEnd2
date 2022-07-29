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
    private EducacionService:EducacionService,
    private tokenService:TokenService) {
    // customize default values of modals used by this component tree
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
    this.EducacionService.getEducacion().subscribe(data => (this.educacion = data));

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }


  //  getEducacion(){
  //   this.httpClient.get<any>('http://localhost:8080/educacion/traer').subscribe(
  //      response =>{
  //       console.log(response);
  //       this.educacion =response;
  //     }
  //   )
  // }
  obtener(e: any) {     
    this.base64 = e[0].base64; 
    this.editForm.value.imagen=this.base64;  
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
    const url = 'http://localhost:8080/educacion/crear';
    this.httpClient.post(url, f.value)
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
    const editURL = 'http://localhost:8080/educacion/' + 'editar/'  + this.editForm.value.id ;
    this.httpClient.put(editURL, this.editForm.value)
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
    const deleteURL = 'http://localhost:8080/educacion/' +  'borrar/'+ this.deleteId ;
    this.httpClient.delete(deleteURL)
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



function next(next: any, arg1: (response: any) => void) {
  throw new Error('Function not implemented.');
}
