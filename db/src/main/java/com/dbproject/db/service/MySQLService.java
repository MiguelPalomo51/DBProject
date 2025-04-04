package com.dbproject.db.service;

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

    public List<Map<String, Object>> listarBasesDeDatos() {
      return jdbcTemplate.queryForList("SHOW DATABASES");
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
