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

  mostrarListarPermisos = false;
  usuarioListarSeleccionado: string = '';
  baseListarSeleccionada: string = '';
  permisosListados: string[] = [];

  usuarioActual: string = '';
  passwordActual: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarBasesDeDatos();
    this.usuarioActual = localStorage.getItem('usuario') || '';
    this.passwordActual = localStorage.getItem('password') || '';
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
    console.log('Usuario:', this.usuarioActual);
    console.log('Password:', this.passwordActual);
    console.log('Base:', this.baseSeleccionada);
    console.log('Consulta:', this.consultaSQL);

    const payload = {
      usuario: this.usuarioActual,
      password: this.passwordActual,
      base: this.baseSeleccionada,
      consulta: this.consultaSQL
    };

    this.http.post<any[]>('http://localhost:9090/mysql/ejecutar', payload)
      .subscribe(
        data => {
          this.resultadoConsulta = data;
          this.mensajeExito = 'Consulta ejecutada correctamente.';
          this.mensajeError = '';
          setTimeout(() => this.mensajeExito = '', 6000);
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
    // Limpia el mensaje antes de cualquier acción
    this.mensajePermisos = '';

    // Solo consulta si ambos están seleccionados
    if (!this.usuarioSeleccionado || !this.baseSeleccionada) {
      this.permisosUsuario = [];
      return;
    }

    this.http.get<any[]>(
      `http://localhost:9090/mysql/permisos?usuario=${this.usuarioSeleccionado}&base=${this.baseSeleccionada}`
    ).subscribe({
      next: data => {
        this.permisosUsuario = data;
        this.mensajePermisos = '';
      },
      error: () => {
        this.permisosUsuario = [];
        this.mensajePermisos = 'No se pudieron obtener los permisos.';
      }
    });
  }

  otorgarPermiso() {
    // Aquí deberías implementar el endpoint para otorgar permisos en tu backend
    this.mensajePermisos = `Permiso "${this.permisoSeleccionado}" otorgado a "${this.usuarioSeleccionado}" (simulado)`;
    // Llama a tu backend real aquí si lo tienes implementado
  }

  abrirListarPermisos() {
    this.mostrarListarPermisos = true;
    this.usuarioListarSeleccionado = '';
    this.permisosListados = [];
    // Si no tienes usuarios cargados, llama aquí a tu método para obtenerlos
  }

  cerrarListarPermisos() {
    this.mostrarListarPermisos = false;
  }

  listarPermisosUsuario() {
    this.permisosListados = [];
    if (!this.usuarioListarSeleccionado || !this.baseListarSeleccionada) return;
    // Usa la ruta correcta según tu backend
    this.http.get<string[]>(`http://localhost:9090/Aut/permisos?usuario=${this.usuarioListarSeleccionado}&base=${this.baseListarSeleccionada}`)
      .subscribe({
        next: data => this.permisosListados = data,
        error: () => this.permisosListados = []
      });
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
