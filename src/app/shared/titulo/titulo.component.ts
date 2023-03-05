import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  @Input() titulo!: string;
  @Input() iconClass: string = 'fa fa-user';
  @Input() subTitulo: string = 'desde 2023';
  @Input() botaoListar = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  listar(): void {
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`])
  }

}
