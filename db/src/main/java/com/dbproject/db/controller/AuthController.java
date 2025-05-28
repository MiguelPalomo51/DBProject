package com.dbproject.db.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.dbproject.db.service.AuthService;
import com.dbproject.db.service.MySQLService;

// comentario para pull simultaneos

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/Aut")
public class AuthController {
    private final AuthService authService;
    private final MySQLService mySQLService; 

    public AuthController(AuthService authService, MySQLService mySQLService) {
        this.authService = authService;
        this.mySQLService = mySQLService; 
    }

    @PostMapping("/crear-usuario")
    public ResponseEntity<Map<String, String>> crearUsuario(@RequestParam String usuario, @RequestParam String password, @RequestParam boolean esAdmin) {
        String resultado = authService.crearUsuario(usuario, password, esAdmin);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", resultado);
        response.put("estado", String.valueOf(true));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String usuario, @RequestParam String password) {
        boolean autenticado = authService.iniciarSesion(usuario, password);

        Map<String, Object> response = new HashMap<>();
        if (autenticado) {
            response.put("mensaje", "Login exitoso!");
            response.put("estado", true);
        } else {
            response.put("mensaje", "Credenciales incorrectas");
            response.put("estado", false);
        }

        return response; // Spring lo convertirá automáticamente a JSON
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        try {
            return ResponseEntity.ok(mySQLService.listarUsuarios());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener usuarios: " + e.getMessage());
        }
    }

    @GetMapping("/permisos")
    public ResponseEntity<?> listarPermisos(@RequestParam String usuario) {
        try {
            return ResponseEntity.ok(mySQLService.listarPermisos(usuario));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener permisos: " + e.getMessage());
        }
    }
}
