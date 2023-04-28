import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

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
    const eventoIdParam = this.route.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.spinner.show();
      this.eventoService.listarEventoById(+eventoIdParam).subscribe({
        next: (res: Evento) => {
          if (res) {
            this.evento = {...res};
            this.form.patchValue(this.evento);
          }
        },
        error: (err) => {
          this.spinner.hide();
          console.error(err);
          this.toastr.error('Erro ao carregar o evento.', 'Erro!')
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }
}
