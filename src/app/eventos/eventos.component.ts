import { HttpClient} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { EventoService } from '../evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  template: '<pdf-viewer [src]="pdfSrc"></pdf-viewer>',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  private url = 'https://localhost:44341/api/Eventos';

  public pdfSrc: any;
  public eventos: any = [] ;

  public mostrar = true;
  public botao = "Esconder";
  public margemImagem: number = 2;
  public tamanhoImagem: number = 120;



  constructor(private http: HttpClient ,private srv: EventoService) { }

  ngOnInit(): void {

    // this.getEventos();
    this.visualizarArquivo();

  }

  getEventos(): void {
    this.http.get(`${this.url}/ListarEventos`).subscribe( (response) => {
      console.log(response);
      this.eventos = response;
      (console.error());
    });

  }

  mostrarImg(){
    this.mostrar = !this.mostrar;
    if(this.mostrar){
      this.botao = 'Esconder';
    }
    else{
      this.botao = 'Mostrar'
    }
  }

  visualizarArquivo(){
    // this.srv.getArquivo().subscribe((res: Blob) =>{
    //   let url = window.URL.createObjectURL(res);
    //   window.open(url);
    // });
    this.srv.getArquivo().subscribe(res =>{
      let blob: Blob = res as Blob;
      let url = window.URL.createObjectURL(blob);
      // window.open(url);
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(blob);
        fileReader.onload = (event: any) => {
          this.pdfSrc = event.target.result;
        };
    });

    // this.srv.getArquivo().pipe(
    //   map((blob: Blob) => {
    //     const fileReader = new FileReader();
    //     fileReader.readAsArrayBuffer(blob);
    //     fileReader.onload = (event: any) => {
    //       this.pdfSrc = event.target.result;
    //     };
    //   })
    // ).subscribe();


  }

  downArquivo(){
    this.srv.dowArquivo().subscribe(res =>{
      console.log(res);
      let blob: Blob = res as Blob;
      let url = window.URL.createObjectURL(blob);
      let a=document.createElement('a');
      a.download = '';
      a.href= url;
      a.click();
    });
  }

}
