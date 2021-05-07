import { HttpClient } from '@angular/common/http';
import { Component,  ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  @ViewChild("modalAdd") modalAdd: ElementRef | undefined;
  current_server='';
  filter_id='';
  filter_carnet='';
  reportes=[];
  todos_reportes=[];
  last_request_time=new Date().toLocaleString();

  imageSrc: string = "";
  myForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    event: new FormControl(''),
    carnet: new FormControl(''),
    file: new FormControl(''),
    fileSource: new FormControl('')
  });
  constructor(private http: HttpClient,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.http.get('https://proyecto.grupo16-api.codes/asistencias')
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


  bothFilters(){
    this.reportes=[];
    if(Number(this.filter_carnet) && Number(this.filter_id)){
      for (const iterator of this.todos_reportes) {
        if(iterator.carnet==this.filter_carnet && iterator.id==this.filter_id){{
          this.reportes.push(iterator);
        }}
      }
    }else{
      this.reportes=this.todos_reportes;
    }
  }

  filterChange(){
    if(Number(this.filter_id)){
      // si tiene algo en el id, vamos a aplicar ambos filtros
      this.bothFilters();
    }else{
      this.reportes=[];
      if(Number(this.filter_carnet)){
        for (const iterator of this.todos_reportes) {
          if(iterator.carnet==this.filter_carnet){{
            this.reportes.push(iterator);
          }}
        }
      }else{
        this.reportes=this.todos_reportes;
      }
    }
  }
  filterIdChange(){
    if(Number(this.filter_carnet)){
      this.bothFilters();
    }else{
      this.reportes=[];
      if(Number(this.filter_id)){
        for (const iterator of this.todos_reportes) {
          if(iterator.id==this.filter_id){{
            this.reportes.push(iterator);
          }}
        }
      }else{
        this.reportes=this.todos_reportes;
      }
    }
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;

        this.myForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }
  get f() {
    return this.myForm.controls;
  }


  abrirModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.modalAdd);
  }

  async submit() {
    let entrada = { name: this.myForm.value.name, carnet: this.myForm.value.carnet, event: this.myForm.value.event, id: this.myForm.value.id, img: ''  };
    entrada.img='https://redes2-201701048.s3.us-east-2.amazonaws.com/'+entrada.carnet+'-'+entrada.id+'.jpg';

    let entrada_lambda={name:entrada.carnet+'-'+entrada.id+'.jpg', file:this.myForm.value.fileSource};
    console.log(entrada_lambda);
    this.http.post('https://zl4b06ela2.execute-api.us-east-2.amazonaws.com/prod/upload-on-s3-function', entrada_lambda)
    .subscribe({
      next: (res) => {
        let converted = JSON.stringify(res);
        let result = JSON.parse(converted);
        console.log(result);
      },
      error: (error) => {
        console.log(error);
      }
    });

    
    console.log('La entrada es: ', entrada);
    this.http.post('https://proyecto.grupo16-api.codes/asistencia', entrada)
      .subscribe({
        next: (res) => {
          let converted = JSON.stringify(res);
          let result = JSON.parse(converted);
          console.log(result);
          this.reportes.push(result);
          this.filter_carnet='';
          this.filter_id='';
          alert("Reporte agregado satisfactoriamente!!");
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.log(error);
          alert("No se pudo registrar la asistencia, " + JSON.stringify(error));
        }
      });
    this.myForm.reset();
  }

}
