import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  @Input() titulo!: string;
  @Input() iconClass: string = 'fa fa-user';
  @Input() subTitulo: string = 'desde 2021';
  @Input() botaoListar = false;

  constructor() { }

  ngOnInit() {
  }


}
