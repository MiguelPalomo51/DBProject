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

  mostrarPermisos = false;
  usuarios: string[] = [];
  usuarioSeleccionado: string = '';
  permisos: string[] = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL PRIVILEGES'
  ];
  permisoSeleccionado: string = '';
  permisosUsuario: any[] = [];
  mensajePermisos: string = '';

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

  // Llama esto en ngOnInit o cuando abras la card de permisos
  cargarUsuarios() {
    this.http.get<string[]>('http://localhost:9090/Aut/usuarios').subscribe({
      next: data => this.usuarios = data,
      error: () => this.usuarios = []
    });
  }

  abrirPermisos() {
    this.mostrarPermisos = true;
    this.cargarUsuarios();
    this.usuarioSeleccionado = '';
    this.permisoSeleccionado = '';
    this.permisosUsuario = [];
    this.mensajePermisos = '';
  }

  cerrarPermisos() {
    this.mostrarPermisos = false;
  }

  consultarPermisos() {
    if (!this.usuarioSeleccionado || !this.baseSeleccionada) return;
    this.http.get<any[]>(
      `http://localhost:9090/mysql/permisos?usuario=${this.usuarioSeleccionado}&base=${this.baseSeleccionada}`
    ).subscribe({
      next: data => this.permisosUsuario = data,
      error: () => this.mensajePermisos = 'No se pudieron obtener los permisos.'
    });
  }

  otorgarPermiso() {
    // Aquí deberías implementar el endpoint para otorgar permisos en tu backend
    this.mensajePermisos = `Permiso "${this.permisoSeleccionado}" otorgado a "${this.usuarioSeleccionado}" (simulado)`;
    // Llama a tu backend real aquí si lo tienes implementado
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
