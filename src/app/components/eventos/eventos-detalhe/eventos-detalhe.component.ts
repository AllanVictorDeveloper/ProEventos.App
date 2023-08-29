import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.css'],
  providers: [DatePipe],
})
export class EventosDetalheComponent implements OnInit {
  form!: FormGroup;
  bsValue = new Date();

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

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: Router,
    private datePipe: DatePipe
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

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public carregarEvento(): void {
    if (this.eventoIdParam !== null || this.eventoIdParam == 0) {
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

  // public carregarLotes(): void {
  //   this.loteService.listarLoteByEventoId(this.eventoIdParam).subscribe({
  //     next: (lotesRetorno: Lote[]) => {
  //       lotesRetorno.forEach(item => {
  //         this.lotes.push(this.criarLote(item))
  //       })
  //     },
  //     error: (err) => {
  //       this.spinner.hide();
  //       this.toastr.error('Erro ao carregar os lotes.', 'Error!');
  //       console.error(err);
  //     },
  //     complete: () => {}
  //   });
  // }

  public salvarEvento(): void {
    this.spinner.show();
    debugger;
    if (this.form.valid) {
      console.log(this.form);

      this.estadoSalvar === 'post'
        ? { ...this.form.value }
        : { id: this.evento.id, ...this.form.value };

      if (this.eventoIdParam !== null) {
        this.eventoService.atualizar[this.estadoSalvar](this.evento)
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

  voltar(): void {
    this.route.navigate(['eventos/lista']);
  }
}
