import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-eventos-lista',
  templateUrl: './eventos-lista.component.html',
  styleUrls: ['./eventos-lista.component.css'],
})
export class EventosListaComponent {
  modalRef?: BsModalRef;
  public pdfSrc: any;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public mostrar = true;
  public botao = 'Esconder';
  public margemImagem: number = 2;
  public tamanhoImagem: number = 80;
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

  constructor(
    private eventosrv: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
    this.getEventoPorId(1);
    this.getEventoPorTema('angular');
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('O Evento foi deletado com sucesso', 'Deletado!');
  }

  decline(): void {
    this.modalRef?.hide();
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
        console.log(this.eventosFiltrados)
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos', 'Erro!');
      },
      complete: () => {
        this.spinner.hide();
      },
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
        //console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  detalheEvento(id: number): void {
    this.router.navigate([`/eventos/detalhe/${id}`]);
  }
}
