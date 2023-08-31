import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { DateTimeFormatPipe } from '@app/helpers/DateTimeFormat.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.css'],
  providers: [DatePipe],
})
export class EventosDetalheComponent implements OnInit {
  form!: FormGroup;
  bsValue = new Date();
  modalRef?: BsModalRef;
  loteAtual = { id: 0 , nome: '', indice: 0 }

  evento!: Evento;

  eventoIdParam: number;
  estadoSalvar = 'post';


  get f(): any {
    return this.form.controls;
  }

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: Router,
    private modalService: BsModalService
  ) {
    this.eventoIdParam = +this.activatedRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.validator();
    this.carregarEvento();
  }

  validator(): void {
    this.form = new FormGroup({
      tema: new FormControl('', [Validators.required, Validators.minLength(4)]),
      local: new FormControl('', Validators.required),
      dataEvento: new FormControl('', Validators.required),
      qtdPessoas: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagemUrl: new FormControl('', Validators.required),
      lotes: this.fb.array([]),
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public mudarValorData(value: Date, indice: number, campo: string): void {
    this.lotes.value[indice][campo] = value
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public carregarEvento(): void {
    if (this.eventoIdParam !== null && this.eventoIdParam !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.listarEventoById(this.eventoIdParam).subscribe({
        next: (res: Evento) => {
          if (res) {
            console.log(res);
            this.evento = { ...res };
            this.form.patchValue(this.evento);
            // this.carregarLotes();
            this.evento.lotes.forEach(item => {
              this.lotes.push(this.criarLote(item))
            })
          }
        },
        error: (err) => {
          this.spinner.hide();
          console.error(err);
          this.toastr.error('Erro ao carregar o evento.', 'Erro!');
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      console.log(this.form);
      debugger
      this.estadoSalvar == "put"
        ? this.evento = this.form.value
        : { id: this.form.value };

      if (this.eventoIdParam > 0) {
        debugger
        this.eventoService.atualizar(this.eventoIdParam, this.evento)
          .subscribe({
            next: (res) => {
              if (res.status == 200) {
                this.toastr.success(`${res.mensagem}`, 'Atualizado!');
                this.spinner.hide();
                setTimeout(() => {
                  window.location.reload();
                }, 4000);
              }
            },
            error: (res) => {
              console.error(res);
              if (res.status == 400) {
                this.toastr.error(`${res.error.mensagem}`, 'ERRO!');
                this.spinner.hide();
              } else {
                this.toastr.error(`${res.error.value}`, 'ERRO2!');
              }
            },
            complete: () => {
              this.spinner.hide();
            },
          })
          .add();
      } else {
        this.evento = { ...this.form.value };
        this.eventoService.adicionar(this.evento).subscribe({
          next: (res: Evento) => {
            console.log(res);
            this.toastr.success(`Evento Salvo com Sucesso!`, 'Sucesso!');
            this.spinner.hide();
            this.evento = res;
            setTimeout(() => {
              this.route.navigate([`/eventos/detalhe/${res.id}`]);
            }, 4000);
            this.estadoSalvar === 'put';
          },
          error: (res) => {
            console.error(res);
            if (res.status == 400) {
              this.toastr.error(`${res.error.mensagem}`, 'ERRO!');
              this.spinner.hide();
            }
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    } else {
      this.toastr.error('Preencha o formulário corretamente.', 'ERRO!');
      this.spinner.hide();
      console.log(this.form);
    }
  }

  public salvarLotes(): void {
    this.spinner.show();
    console.log(this.form.controls['lotes'].value)
    if (this.form.controls['lotes'].valid) {
      this.loteService
        .saveLote(this.eventoIdParam, this.form.value.lotes)
        .subscribe({
          next: (res) => {
            this.toastr.success(`Lotes Salvos com Sucesso!`, 'Sucesso!')
            // this.lotes.reset();
          },
          error: (err) => {
            this.toastr.error('Erro ao tentar salvar lotes.', 'ERROR!')
            console.error(err)
          },
        })
        .add(() => this.spinner.hide());
    }
  }


  public removerLote(template: TemplateRef<any>, indice: number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id').value
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value
    this.loteAtual.indice = indice

    this.modalRef = this.modalService.show(template, {class: 'modal-excluir'})

  }

  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.Remove(this.eventoIdParam, this.loteAtual.id).subscribe({
      next: () => {
        this.toastr.success(`Lote excluido com Sucesso`, 'Sucesso!')
        this.lotes.removeAt(this.loteAtual.indice)
      },

      error: (err) => {
        this.toastr.error(`Erro ao tentar deletar o Lote ${this.loteAtual.id}`, 'ERROR!')
        console.error(err);
      }

    }).add(() => {this.spinner.hide()})
  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }

  voltar(): void {
    this.route.navigate(['eventos/lista']);
  }

  public retornaTituloLote(nome: string): any{
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }
}
