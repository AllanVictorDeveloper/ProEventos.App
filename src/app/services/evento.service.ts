import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroments/environment';
import { map, Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable(
  //{providedIn: 'root',}
)
export class EventoService {

  private baseURL = `${environment.apiURL}/api/Eventos`

  constructor(private http: HttpClient) {}

  public listarEventos(): Observable<Evento[]>{
      return this.http
        .get<Evento[]>(`${this.baseURL}/ListarTodosEventos`)
        .pipe(map(response => response));
  }

  public listarEventoByTema(tema: string): Observable<Evento[]>{
    return this.http
      .get<Evento[]>(`${this.baseURL}/ListarEventosPorTema/${tema}`)
      .pipe(map(response => response));
  }

  public listarEventoById(id: number): Observable<Evento>{
    return this.http
      .get<Evento>(`${this.baseURL}/ListarEventosPorId/${id}`)
      .pipe(map(response => response));
  }

  public adicionar(evento: Evento): Observable<Evento>{
    return this.http
      .post<Evento>(`${this.baseURL}/AdicionarEvento`, evento)
      .pipe(map(response => response));
  }

  public atualizar(id: number, evento: Evento): Observable<any>{
  debugger
    return this.http
      .post<Evento>(`${this.baseURL}/AtualizarEvento/${id}`, evento)
      .pipe(map(response => response));
  }

  public deletar(id: number): Observable<any>{
    return this.http
      .delete<any>(`${this.baseURL}/DeletarEvento/${id}`)
      .pipe(map((response) => response));
  }

  public postUpload(eventoId: number, file:File): Observable<Evento>{

    const filToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', filToUpload)

    return this.http
      .post<Evento>(`${this.baseURL}/upload-imagem/${eventoId}`, formData)
      .pipe(map(response => response));
  }
}
