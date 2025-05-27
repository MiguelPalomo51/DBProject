package com.dbproject.db.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.dbproject.db.service.AuthService;

// comentario para pull simultaneos

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/Aut")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}
