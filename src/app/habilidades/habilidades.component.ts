import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Habilidad } from '../Models/habilidad.model';
import { HabilidadService } from '../Services/habilidad.service';
import { TokenService } from '../Services/token.service';
import  Swal from  'sweetalert2' ;

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
    this.HabilidadService.addHabilidad(f.value)
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          title: 'Excelente',
          text: 'Habilidad ingresada!',
          timer:2000 ,
        })
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
    this.HabilidadService.updateHabilidad(this.editForm.value)
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
   this.HabilidadService.deleteHabilidad(this.deleteId)
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
