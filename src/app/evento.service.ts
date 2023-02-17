
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class EventoService {

  private url_base = 'http://localhost:5000/api/Arquivo';

constructor(private http: HttpClient) { }

getArquivo():Observable<any> {
  let endpoint = `${this.url_base}/ListarUltimoArquivo`;
  return this.http
      .get(endpoint, {responseType:'blob'}).pipe(map((res) => res));
}

dowArquivo():Observable<any> {
  let endpoint = `${this.url_base}/ListarUltimoArquivo`;
  return this.http
      .get(endpoint, {responseType:'blob'}).pipe(map((res) => res));
}

}
