package com.dbproject.db.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class MySQLService {
    private final JdbcTemplate jdbcTemplate;

    public  MySQLService(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>>
    ejecutarConsulta(String sql){
        return jdbcTemplate.queryForList(sql);

    }

    public List<String> listarBasesDeDatos() {
    List<Map<String, Object>> resultados = jdbcTemplate.queryForList("SHOW DATABASES");
    List<String> bases = new ArrayList<>();
    List<String> ignorar = List.of("information_schema", "mysql", "performance_schema", "sys");

for (Map<String, Object> fila : resultados) {
    String nombre = fila.get("Database").toString();
    if (!ignorar.contains(nombre)) {
        bases.add(nombre);
    }
  }
return bases;
}


    public void crearBaseDatos(String nombreDB){
        String sql = "CREATE DATABASE " + nombreDB;
        jdbcTemplate.execute(sql);
    } 

    public void eliminarBaseDatos(String nombreDB){
        String sql = "DROP DATABASE " + nombreDB;
        jdbcTemplate.execute(sql);
    }

    public void crearUsuario(String usuario, String password){
        String sql = "CREATE USER '" + usuario + "'@'%' IDENTIFIED BY '" + password + "'";
        jdbcTemplate.execute(sql);
    }
    

    public void otorgarPermisos(String usuario, String database){
        String sql = "GRANT ALL PRIVILEGES ON " + database + ".* TO '" + usuario + "'@'%'";
        jdbcTemplate.execute(sql); 
    }
}
