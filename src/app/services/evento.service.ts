import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable(
  //{providedIn: 'root',}
)
export class EventoService {

  private baseURL = 'https://localhost:44341/api/Eventos'

  constructor(private http: HttpClient) {}

  public listarEventos(): Observable<Evento[]>{
      return this.http.get<Evento[]>(`${this.baseURL}/ListarTodosEventos`).pipe(map(response => response));
  }

  public listarEventoByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/ListarEventosPorTema/${tema}`).pipe(map(response => response));
  }

  public listarEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/ListarEventosPorId/${id}`).pipe(map(response => response));
  }

  public postEvento(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(`${this.baseURL}/AdicionarEvento`, evento).pipe(map(response => response));
  }

  public putEvento(id: number, evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(`${this.baseURL}/AtualizarEvento`, evento).pipe(map(response => response));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete<any>(`${this.baseURL}/DeletarEvento/${id}`).pipe(map((response) => response));
  }
}
