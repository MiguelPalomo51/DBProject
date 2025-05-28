import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menuprincipal',
  standalone: false,
  templateUrl: './menuprincipal.component.html',
  styleUrl: './menuprincipal.component.css'
})
export class MenuprincipalComponent implements OnInit {
  basesDeDatos: string[] = [];
  baseSeleccionada: string = '';
  consultaSQL: string = '';
  resultadoConsulta: any[] = [];
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarBasesDeDatos();
  }

  cargarBasesDeDatos(): void {
    this.http.get<string[]>('http://localhost:9090/mysql/basededatos')
      .subscribe(
        data => {
          this.basesDeDatos = data;
        },
        error => {
          console.error('Error al obtener las bases de datos:', error);
        }
      );
  }

  onBaseSeleccionada(event: any): void {
    this.baseSeleccionada = event.target.value;
    console.log('Base seleccionada:', this.baseSeleccionada);
  }

  ejecutarConsulta(): void {
    const payload = {
      base: this.baseSeleccionada,
      consulta: this.consultaSQL
    };

    this.http.post<any[]>('http://localhost:9090/mysql/ejecutar', payload)
    .subscribe(
      data => {
        this.resultadoConsulta = data;
        this.mensajeExito = 'Consulta ejecutada correctamente.';
        
        this.mensajeError = '';
        setTimeout(() => this.mensajeExito = '', 6000); // Oculta el mensaje de éxito después de 6 segundos
      },
      error => {
        console.error('Error al ejecutar la consulta:', error);
        this.resultadoConsulta = [];
        this.mensajeError = error.error ? error.error : 'Error desconocido al ejecutar la consulta.';
        this.mensajeExito = '';
        setTimeout(() => this.mensajeError = '', 2000);
      }
    );

  }
}

@Injectable({ providedIn: 'root' })
export class BaseDatosService {
  private apiUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  listarBases() {
    return this.http.get<string[]>(`${this.apiUrl}/mysql/basededatos`);
  }
}
