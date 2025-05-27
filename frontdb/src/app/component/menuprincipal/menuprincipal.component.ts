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

constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarBasesDeDatos();
  }

  cargarBasesDeDatos(): void {
    this.http.get<any[]>('http://localhost:9090/mysql/basededatos')
      .subscribe(
        data => {
          // Si la respuesta viene como [{Database: 'nombre'}]
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

}

@Injectable({ providedIn: 'root' })
export class BaseDatosService {
  private apiUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  listarBases() {
    return this.http.get<string[]>(`${this.apiUrl}/mysql/basededatos`);
  }
}
