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
  permisosUsuario: string[] = [];
  mensajePermisos: string = '';

  mostrarListarPermisos = false;
  usuarioListarSeleccionado: string = '';
  baseListarSeleccionada: string = '';
  permisosListados: string[] = [];

  usuarioActual: string = '';
  passwordActual: string = '';

  esRoot = false;
  mostrarMisPermisos = false;
  baseMisPermisosSeleccionada: string = '';
  misPermisosListados: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarBasesDeDatos();
    this.usuarioActual = localStorage.getItem('usuario') || '';
    this.passwordActual = localStorage.getItem('password') || '';
    this.esRoot = this.usuarioActual === 'root';
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
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error => {
          console.error('Error al ejecutar la consulta:', error);
          this.resultadoConsulta = [];
          this.mensajeError = error.error ? error.error : 'Error desconocido al ejecutar la consulta.';
          this.mensajeExito = '';
          setTimeout(() => this.mensajeError = '', 4000);
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
    this.mensajePermisos = '';
    this.permisosUsuario = [];
    if (!this.usuarioSeleccionado || !this.baseSeleccionada) return;
    this.http.get<string[]>(`http://localhost:9090/mysql/permisos?usuario=${this.usuarioSeleccionado}&base=${this.baseSeleccionada}`)
      .subscribe({
        next: data => this.permisosUsuario = data,
        error: () => this.mensajePermisos = 'No se pudieron obtener los permisos.'
      });
  }

  otorgarPermiso() {
    if (!this.usuarioSeleccionado || !this.baseSeleccionada || !this.permisoSeleccionado) return;
    const payload = {
      usuario: this.usuarioSeleccionado,
      base: this.baseSeleccionada,
      permiso: this.permisoSeleccionado
    };
    this.http.post<{mensaje: string}>('http://localhost:9090/mysql/otorgarPermiso', payload)
      .subscribe({
        next: (resp) => {
          this.mensajePermisos = resp.mensaje || 'Permisos otorgados exitosamente.';
          this.consultarPermisos();
        },
        error: (error) => {
          this.mensajePermisos = error.error?.error || 'No se pudo otorgar el permiso.';
        }
      });
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
    if (!this.usuarioListarSeleccionado) return;
    this.http.get<string[]>(`http://localhost:9090/mysql/permisos?usuario=${this.usuarioListarSeleccionado}`)
      .subscribe({
        next: data => {
          this.permisosListados = data;
        },
        error: () => this.permisosListados = []
      });
  }

  abrirMisPermisos() {
    this.mostrarMisPermisos = true;
    this.misPermisosListados = [];
    this.http.get<string[]>(`http://localhost:9090/mysql/permisos?usuario=${this.usuarioActual}`)
      .subscribe({
        next: data => {
          this.misPermisosListados = data;
        },
        error: () => this.misPermisosListados = []
      });
  }

  cerrarMisPermisos() {
    this.mostrarMisPermisos = false;
  }

  listarMisPermisos() {
    this.misPermisosListados = [];
    if (!this.baseMisPermisosSeleccionada) return;
    this.http.get<string[]>(`http://localhost:9090/mysql/permisos?usuario=${this.usuarioActual}&base=${this.baseMisPermisosSeleccionada}`)
      .subscribe({
        next: data => {
          this.misPermisosListados = data;
        },
        error: () => this.misPermisosListados = []
      });
  }

  parsearPermisos(permisos: string[]): { base: string, acciones: string[] }[] {
    const resultado: { base: string, acciones: string[] }[] = [];
    permisos.forEach(linea => {
      const match = linea.match(/^GRANT (.+) ON [`]?([a-zA-Z0-9_]+)[`]?.\* TO/i);
      if (match) {
        const acciones = match[1].split(',').map(a => a.trim());
        const base = match[2];
        if (acciones.length === 1 && acciones[0].toUpperCase() === 'USAGE') return;
        resultado.push({ base, acciones });
      }
    });
    return resultado;
  }

  removerPermiso(permiso: string, base: string) {
    if (!this.usuarioSeleccionado || !base || !permiso) return;
    const payload = {
      usuario: this.usuarioSeleccionado,
      base: base,
      permiso: permiso
    };
    this.http.post<{mensaje: string}>('http://localhost:9090/mysql/removerPermiso', payload)
      .subscribe({
        next: resp => {
          this.mensajePermisos = resp.mensaje || 'Permiso removido correctamente.';
          this.consultarPermisos(); // Refresca la lista de permisos
        },
        error: err => {
          this.mensajePermisos = err.error?.error || 'No se pudo remover el permiso.';
        }
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
