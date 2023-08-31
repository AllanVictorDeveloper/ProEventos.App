import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoteService {

  private baseURL = 'http://localhost:57644/api/lotes'

  constructor(private http: HttpClient) {}



  public listarLoteByEventoId(eventoId: number): Observable<Lote[]>{
    return this.http
      .get<Lote[]>(`${this.baseURL}/${eventoId}`)
      .pipe(map(response => response));
  }



  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]>{
    return this.http
      .post<Lote[]>(`${this.baseURL}/${eventoId}`, lotes)
      .pipe(map(response => response));
  }


  public Remove(eventoId: number, loteId: number): Observable<any>{
    return this.http
      .delete<any>(`${this.baseURL}/deletarLote/${eventoId}/${loteId}`)
      .pipe(map((response) => response));
  }

}
