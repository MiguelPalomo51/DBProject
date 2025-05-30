package com.dbproject.db.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dbproject.db.service.MySQLService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/mysql")

public class MySQLController {
    private final MySQLService mySQLService;

    public MySQLController(MySQLService mySQLService) {
        this.mySQLService = mySQLService;
        System.out.println("Controlador MySQLController iniciado...");

    }

    // @GetMapping("/ejecutar")
    // public List<Map<String, Object>>
    // ejecutarConsulta(@RequestParam String sql){
    // return mySQLService.ejecutarConsulta(sql);
    // }
    @GetMapping("/ejecutar")
    public List<Map<String, Object>> ejecutarConsulta(@RequestParam(required = false) String sql) {
        if (sql == null || sql.isEmpty()) {
            throw new IllegalArgumentException("El parámetro 'sql' es obligatorio.");
        }
        return mySQLService.ejecutarConsulta(sql);
    }

    // @GetMapping("/listarbd")
    // public List<String> listarBasesDeDatos() {
    // return mySQLService.listarBasesDeDatos();
    // }

    @GetMapping("/basededatos")
    public List<String> listarBasesDeDatos() {
        return mySQLService.listarBasesDeDatos();
    }

    @PostMapping("/creardb/{nombreDB}")
    public String crearBaseDatos(@PathVariable String nombreDB) {
        mySQLService.crearBaseDatos(nombreDB);
        return "Base de datos'" + nombreDB + "'creada exitosamente";
    }

    @DeleteMapping("/eliminar/{nombreDB}")
    public String eliminarBaseDatos(@PathVariable String nombreDB) {
        mySQLService.eliminarBaseDatos(nombreDB);
        return "Base de datos'" + nombreDB + "'eliminada exitosamente";
    }

    @PostMapping("/crearusuario")
    public String crearUsuario(@RequestParam String usuario, @RequestParam String password) {
        mySQLService.crearUsuario(usuario, password);
        return "Usuario'" + usuario + "'creado exitosamente";
    }

    // Listar todos los permisos de un usuario
    @GetMapping("/permisos")
    public List<String> listarPermisos(@RequestParam String usuario) {
        return mySQLService.listarPermisos(usuario);
    }

    @PostMapping("/otorgarPermiso")
    public ResponseEntity<?> otorgarPermiso(@RequestBody Map<String, String> body) {
    try {
        String usuario = body.get("usuario");
        String base = body.get("base");
        String permiso = body.get("permiso");
        mySQLService.otorgarPermiso(usuario, base, permiso);
        return ResponseEntity.ok(Collections.singletonMap("mensaje", "Permiso otorgado correctamente."));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Collections.singletonMap("error", "Error al otorgar permiso: " + e.getMessage()));
    }
}

@PostMapping("/removerPermiso")
public ResponseEntity<?> removerPermiso(@RequestBody Map<String, String> body) {
    try {
        String usuario = body.get("usuario");
        String base = body.get("base");
        String permiso = body.get("permiso");
        mySQLService.removerPermiso(usuario, base, permiso);
        return ResponseEntity.ok(Collections.singletonMap("mensaje", "Permiso removido correctamente."));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Collections.singletonMap("error", "Error al remover permiso: " + e.getMessage()));
    }
}

    @PostMapping("/ejecutar")
    public ResponseEntity<?> ejecutarConsulta(@RequestBody Map<String, String> body) {
    try {
        String usuario = body.get("usuario");
        String password = body.get("password");
        String base = body.get("base");
        String consulta = body.get("consulta");

        // Mostrar en consola los datos recibidos
        System.out.println("Usuario recibido: " + usuario);
        System.out.println("Password recibido: " + password);
        System.out.println("Base de datos recibida: " + base);

        // Validaciones
        if (usuario == null || usuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error 2003: No hay usuario especificado.");
        }
        if (password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error 2004: No hay contraseña especificada.");
        }
        if (base == null || base.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error 2000: No hay base de datos especificada.");
        }
        if (consulta == null || consulta.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error 2001: No hay consulta SQL especificada.");
        }

        List<Map<String, Object>> resultado = mySQLService.ejecutarConsulta(usuario, password, base, consulta);

        if (resultado == null || resultado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error 2002: No se encontraron resultados para la consulta.");
        }
        return ResponseEntity.ok(resultado);
    } catch (Exception e) {
        String msg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
        if (msg.contains("access denied") || msg.contains("failed to obtain jdbc connection")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Error 2005: Permisos insuficientes. Asegúrese de que el usuario tenga los permisos necesarios para ejecutar la consulta.");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
}
}
