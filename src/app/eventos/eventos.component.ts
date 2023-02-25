import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  template: '<pdf-viewer [src]="pdfSrc"></pdf-viewer>',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  private url = 'https://localhost:44341/api/Eventos';

  public pdfSrc: any;
  public eventos: any = [];
  public eventosFiltrados: any = [];

  public mostrar = true;
  public botao = 'Esconder';
  public margemImagem: number = 2;
  public tamanhoImagem: number = 120;
  private _filtroLista: string = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) != -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) != -1
    );
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos(): void {
    this.http.get(`${this.url}/ListarEventos`).subscribe(
      (response) => {
        this.eventos = response;
        this.eventosFiltrados = response;
      },
      (error) => console.log(error)
    );
  }

  mostrarImg() {
    this.mostrar = !this.mostrar;
    if (this.mostrar) {
      this.botao = 'Esconder';
    } else {
      this.botao = 'Mostrar';
    }
  }

}
