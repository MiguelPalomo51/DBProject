import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Para cards de usuarios
  usuarios: string[] = [];
  mostrarPasswordForm = false;
  usuarioSeleccionado: string | null = null;
  password: string = '';
  mensajeError: string = '';
  mostrarConnections = false;

  // Para registro
  mostrarRegistro = false;
  usuarioRegistro: string = '';
  passwordRegistro: string = '';

  usuarioActual: string = '';
  passwordActual: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.cargarUsuarios();
  }

  // Cargar usuarios desde el backend
  cargarUsuarios() {
    this.http.get<string[]>('http://localhost:9090/Aut/usuarios').subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.mensajeError = 'No se pudieron cargar los usuarios'
    });
  }

  // Seleccionar usuario y mostrar form de contraseña
  seleccionarUsuario(usuario: string) {
    this.usuarioSeleccionado = usuario;
    this.mostrarPasswordForm = true;
    this.password = '';
    this.mensajeError = '';
  }

  // Cancelar form de contraseña
  cancelarPasswordForm() {
    this.mostrarPasswordForm = false;
    this.usuarioSeleccionado = null;
    this.password = '';
  }

  // Login solo con usuario seleccionado y contraseña
  loginConPassword() {
    const params = new HttpParams()
      .set('usuario', this.usuarioSeleccionado!)
      .set('password', this.password);

    this.http.post('http://localhost:9090/Aut/login', null, { params }).subscribe(
      (response: any) => {
        if (response.estado) {
          localStorage.setItem('usuario', this.usuarioSeleccionado!);
          localStorage.setItem('password', this.password);
          this.router.navigate(['/menuprincipal']);
        } else {
          this.mensajeError = response.mensaje;
        }
      },
      error => {
        this.mensajeError = 'Ocurrió un error: ' + error.message;
      }
    );
  }

  // Métodos de registro (igual que ya tienes)
  llamarForm() {
    this.mostrarRegistro = true;
  }

  registrarUsuario() {
    const params = new HttpParams()
      .set('usuario', this.usuarioRegistro)
      .set('password', this.passwordRegistro)
      .set('esAdmin', 'false');

    this.http.post('http://localhost:9090/Aut/crear-usuario', null, { params }).subscribe(
      (response: any) => {
        if (response.mensaje) {
          alert('¡Usuario registrado exitosamente!');
          this.mostrarRegistro = false;
          this.usuarioRegistro = '';
          this.passwordRegistro = '';
          this.cargarUsuarios(); // Recarga la lista de usuarios
        } else {
          alert('No se pudo registrar el usuario.');
        }
      },
      error => {
        alert('Ocurrió un error al registrar: ' + error.message);
      }
    );
  }

  cancelarRegistro() {
    this.mostrarRegistro = false;
  }
}
