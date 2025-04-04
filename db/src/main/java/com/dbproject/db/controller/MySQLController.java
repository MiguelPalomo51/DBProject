package com.dbproject.db.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dbproject.db.service.MySQLService;

@RestController
@RequestMapping("/mysql")

public class MySQLController {
    private final MySQLService mySQLService;

   

    public MySQLController(MySQLService mySQLService){
        this.mySQLService = mySQLService;
        System.out.println("Controlador MySQLController iniciado...");

    }

    
    //@GetMapping("/ejecutar")   
    //public List<Map<String, Object>>
    //ejecutarConsulta(@RequestParam String sql){
        //return mySQLService.ejecutarConsulta(sql);
    //}
    @GetMapping("/ejecutar")   
    public List<Map<String, Object>> ejecutarConsulta(@RequestParam(required = false) String sql) {
        if (sql == null || sql.isEmpty()) {
            throw new IllegalArgumentException("El parámetro 'sql' es obligatorio.");
        }
        return mySQLService.ejecutarConsulta(sql);
    }

    //@GetMapping("/listarbd")
    //public List<String> listarBasesDeDatos() {
      //  return mySQLService.listarBasesDeDatos();
    //}

    @GetMapping("/basededatos")
    public List<Map<String, Object>> listarBasesDeDatos() {
      return mySQLService.listarBasesDeDatos();
}

    @PostMapping("/creardb/{nombreDB}")
    public String crearBaseDatos(@PathVariable String nombreDB){
        mySQLService.crearBaseDatos(nombreDB);
        return "Base de datos'" + nombreDB + "'creada exitosamente";
    }

    @DeleteMapping("/eliminar/{nombreDB}")
    public String eliminarBaseDatos(@PathVariable String nombreDB){
        mySQLService.eliminarBaseDatos(nombreDB);
        return "Base de datos'" + nombreDB + "'eliminada exitosamente";
    }

    @PostMapping("/crearusuario")
    public String crearUsuario(@RequestParam String usuario, @RequestParam String password){
        mySQLService.crearUsuario(usuario, password);
        return "Usuario'" + usuario + "'creado exitosamente";
    }
    
    @PostMapping("/permisos")
    public String otorgarPermisos(@RequestParam String usuario, @RequestParam String database){
        mySQLService.otorgarPermisos(usuario, database);
        return "Permisos otorgados '" + database;
    }
}
