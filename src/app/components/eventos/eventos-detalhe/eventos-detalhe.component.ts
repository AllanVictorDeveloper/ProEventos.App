import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.css']
})
export class EventosDetalheComponent {
  form!: FormGroup;
  constructor(){}
  ngOnInit(): void{

  }

  validator(): void{
    this.form = new FormGroup({
      tema: new FormControl('', Validators.required),
      local: new FormControl('', Validators.required),
      dataEvento: new FormControl('', Validators.required),
      qtdPessoas: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagemUrl: new FormControl('', Validators.required),
    });
  }
}
