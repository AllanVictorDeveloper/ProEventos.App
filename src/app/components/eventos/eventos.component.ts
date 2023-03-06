import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  template: '<pdf-viewer [src]="pdfSrc"></pdf-viewer>',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  ngOnInit(): void {

  }
}
