import { HttpClient } from '@angular/common/http';
import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild("modalView") modalView: ElementRef | undefined;
  @ViewChild("modalAdd") modalAdd: ElementRef | undefined;
  reportes=[]
  todos_reportes=[];
  current_server='Servidor A'
  index=-1;
  filter='';
  last_request_time=new Date().toLocaleString();


  myForm = new FormGroup({
    name: new FormControl(''),
    carnet: new FormControl(''),
    course: new FormControl(''),
    body: new FormControl('')
  });

  constructor(private http: HttpClient,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.http.get('https://proyecto.grupo16-api.codes/reports')
    .subscribe({
      next: (res)=>{
        let converted = JSON.stringify(res);
        let conv=JSON.parse(converted);
        console.log(conv);
        this.todos_reportes=conv.reports;
        this.reportes=this.todos_reportes;  // al iniciar tendrán todos
        this.current_server=conv.attended;
      }, 
      error: (error) =>{
        console.log(error);
        alert(error);
      }
    });
    this.last_request_time=new Date().toLocaleString();
  }

  filterChange(){
    this.reportes=[];
    if(Number(this.filter)){
      for (const iterator of this.todos_reportes) {
        if(iterator.carnet==this.filter){{
          this.reportes.push(iterator);
        }}
      }
    }else{
      this.reportes=this.todos_reportes;
    }
  }




  abrirModalVista(index:number) {
    this.index=index;
    this.modalService.dismissAll();
    this.modalService.open(this.modalView);
  }

  abrirModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.modalAdd);
  }


  async submit() {
    let entrada = { name: this.myForm.value.name, carnet: this.myForm.value.carnet, course: this.myForm.value.course, body: this.myForm.value.body  };

    console.log('La entrada es: ', entrada);
    this.http.post('https://proyecto.grupo16-api.codes/reports', entrada)
      .subscribe({
        next: (res) => {
          let converted = JSON.stringify(res);
          let result = JSON.parse(converted);
          console.log(result);
          this.reportes.push(result);
          this.filter='';
          alert("Reporte agregado satisfactoriamente!!");
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.log(error);
          alert("No se pudo crear el producto, " + JSON.stringify(error));
        }
      });
    this.myForm.reset();
  }

}
