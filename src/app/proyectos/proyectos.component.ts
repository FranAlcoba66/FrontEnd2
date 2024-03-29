import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Proyecto } from '../Models/proyecto';
import { ProyectoService } from '../Services/proyecto.service';
import { TokenService } from '../Services/token.service';
import  Swal from  'sweetalert2' ;
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  
  proyecto:Proyecto[];
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
    private proyectoService:ProyectoService,
    private tokenService:TokenService) { }


  ngOnInit(): void {
    this.getProyecto();
    this.editForm = this.fb.group({
      id: [''],
      titulo: [''],
      descripcion: [''],
      link:[''],
      img:[''],
    });
  }

  public getProyecto(){
    this.proyectoService.getProyecto().subscribe(data=>(this.proyecto=data));

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  obtener(e:any): void {     
    this.base64 = e[0].base64; 
    this.editForm.value.img=this.base64;  
  }

  


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  onSubmit(f: NgForm) {
    f.form.value.img=this.base64;
    console.log(f.form.value);
    this.proyectoService.addProyecto(f.value)
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          title: 'Excelente',
          text: 'Proyecto ingresado!',
          timer:2000 ,
        })
        this.ngOnInit(); // reload the table
      });
      f.form.value.img=this.base64='';
    this.modalService.dismissAll(); // dismiss the modal
  }

  openEdit(targetModal, proyecto:Proyecto) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: proyecto.id,
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      link: proyecto.link,
      img: proyecto.img,
    
    });
   }



  onSave() {
    this.proyectoService.updateProyecto(this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      }); 
  }

  openDelete(targetModal, proyecto:Proyecto) {
    this.deleteId = proyecto.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    this.proyectoService.deleteProyecto(this.deleteId)
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
