import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.css'],
})
export class EventosDetalheComponent implements OnInit {
  form!: FormGroup;
  bsValue = new Date();

  evento!: Evento;

  eventoIdParam!: any;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private routerLink: Router
  ) {
    this.eventoIdParam = this.route.snapshot.paramMap.get('id');
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
    });
  }

  public carregarEvento(): void {
    if (this.eventoIdParam !== null) {
      this.spinner.show();
      this.eventoService.listarEventoById(+this.eventoIdParam).subscribe({
        next: (res: Evento) => {
          if (res) {
            this.evento = { ...res };
            this.form.patchValue(this.evento);
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

  public atualizarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento = { ...this.form.value };

      console.log(this.evento);
      this.eventoService.atualizar(this.eventoIdParam, this.evento).subscribe({
        next: (res) => {
          if (res.status == 200) {
            this.toastr.success(`${res.mensagem}`, 'Atualizado!');
            this.spinner.hide();

            // setTimeout(()=>{
            //  window.location.reload();
            // }, 3999);
          }
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
  }

  voltar(): void{
    this.routerLink.navigate(['eventos/lista'])
  }
}
