import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Habilidad } from '../Models/habilidad.model';
import { HabilidadService } from '../Services/habilidad.service';
import { TokenService } from '../Services/token.service';


@Component({
  selector: 'app-habilidades',
  templateUrl: './habilidades.component.html',
  styleUrls: ['./habilidades.component.css']
})
export class HabilidadesComponent implements OnInit {

  habilidad: Habilidad[];
  
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
    private HabilidadService:HabilidadService,
    private tokenService:TokenService,
    ) {
       // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
     }

  ngOnInit(): void {
    this.getHabilidad();
    this.editForm = this.fb.group({
      id: [''],
      nombre: [''],
      porcentaje: [''],
      logo: [''],
     
    });
  }

  

  public getHabilidad(){
    this.HabilidadService.getHabilidad().subscribe(data=>{
      // console.log(data);
      this.habilidad =data;
    });  

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  // public getHabilidad(){
  //   this.httpClient.get<any>('http://localhost:8080/habilidad/traer').subscribe(
  //      response =>{
  //       console.log(response);
  //       this.habilidad =response;
  //     }
  //   )
  // }




  obtener(e: any) {     
    this.base64 = e[0].base64; 
    this.editForm.value.logo=this.base64;  
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit(f: NgForm) {
    f.form.value.logo=this.base64;
    console.log(f.form.value);
    const url = 'http://localhost:8080/habilidad/crear';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); // reload the table
      });
      f.form.value.logo=this.base64='';
    this.modalService.dismissAll(); // dismiss the modal
  }

  openEdit(targetModal, habilidad:Habilidad) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: habilidad.id,
      nombre: habilidad.nombre,
      porcentaje: habilidad.porcentaje,
      logo: habilidad.logo,
    });
    console.log(this.editForm.value);
   }



  onSave() {  
    const editURL = 'http://localhost:8080/habilidad/' + 'editar/'  + this.editForm.value.id ;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }


  openDelete(targetModal, habilidad:Habilidad) {
    this.deleteId = habilidad.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:8080/habilidad/' +  'borrar/'+ this.deleteId ;
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
