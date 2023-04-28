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

  public eventoId: number = 0;

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
    this.carregarEventos();
    //this.carregarEventoPorId(1);
    //this.getEventoPorTema('angular');
  }

  openModal(event: any,template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventosrv.deleteEvento(this.eventoId).subscribe({
      next:(res) => {
        console.log(res)
        if(res.value.status == 200){
          this.toastr.success(`${res.value.mensagem}`, 'Deletado!');
          this.spinner.hide();
          this.carregarEventos();
        }
        window.location.reload();
      },
      error:(err) => {
        console.error(err);
        this.toastr.error(`${err.value.mensage}`, 'ERRO!');
        this.spinner.hide();
      },
      complete:()=> {
        this.spinner.hide();
      }
    });



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

  public carregarEventos(): any {
    this.eventosrv.listarEventos().subscribe({
      next: (response: Evento[]) => {

        (this.eventos = response), (this.eventosFiltrados = this.eventos);
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

  public carregarEventoPorId(id: number): any {
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
