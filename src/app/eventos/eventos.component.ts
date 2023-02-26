import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  template: '<pdf-viewer [src]="pdfSrc"></pdf-viewer>',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  public pdfSrc: any;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

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

  constructor(private eventosrv: EventoService) {}

  ngOnInit(): void {
    this.getEventos();
    this.getEventoPorId(1);
    this.getEventoPorTema('angular');
  }

  public mostrarImg(): void {
    this.mostrar = !this.mostrar;
    if (this.mostrar) {
      this.botao = 'Esconder';
    } else {
      this.botao = 'Mostrar';
    }
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) != -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) != -1
    );
  }

  public getEventos(): any {
    this.eventosrv.listarEventos().subscribe({
      next: (response) => {
        (this.eventos = response), (this.eventosFiltrados = this.eventos);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  public getEventoPorTema(tema: string): any {
    this.eventosrv.listarEventoByTema(tema).subscribe({
      next: (response) => {
        //console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  public getEventoPorId(id: number): any {
    this.eventosrv.listarEventoById(id).subscribe({
      next: (response) => {
        // console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }
}
