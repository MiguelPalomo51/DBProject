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
  usuario: string = '';
  password: string = '';
  mostrarRegistro = false;
  usuarioRegistro = '';
  passwordRegistro = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const params = new HttpParams()
      .set('usuario', this.usuario)
      .set('password', this.password);

    this.http.post('http://localhost:9090/Aut/login', null, { params}).subscribe(
      (response: any) => {
        console.log(response);
        if (response.estado) {
          alert('Login succesfully!');
          this.menuprincipal();
        }else{
          alert('Login fallido!');
        }
      },
      error => {
        alert('Ocurrió un error: ' + error.message);
      }
    );
  }

  menuprincipal(){
    this.router.navigate(['/menuprincipal']);
  }

  llamarForm() {
    this.mostrarRegistro = true;
    console.log('si entro aca');
  }

  registrarUsuario() {
    // Aquí va la lógica para registrar el usuario
    console.log('Usuario:', this.usuarioRegistro);
    console.log('Contraseña:', this.passwordRegistro);
    // Puedes agregar aquí la llamada a tu servicio de registro
    this.mostrarRegistro = false; // Oculta el formulario después de registrar
  }

  cancelarRegistro() {
    this.mostrarRegistro = false;
  }
}
