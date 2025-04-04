package com.dbproject.db.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Service
public class AuthService {
    private final JdbcTemplate jdbcTemplate;

    public AuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Crear un nuevo usuario en MySQL
    public String crearUsuario(String usuario, String password, boolean esAdmin) {
        String sqlCreateUser = "CREATE USER '" + usuario + "'@'%' IDENTIFIED BY '" + password + "'";
        String sqlGrant = esAdmin ? "GRANT ALL PRIVILEGES ON . TO '" + usuario + "'@'%'"
                : "GRANT SELECT, INSERT, UPDATE, DELETE ON mydatabase.* TO '" + usuario + "'@'%'";

        jdbcTemplate.execute(sqlCreateUser);
        jdbcTemplate.execute(sqlGrant);

        return "Usuario '" + usuario + "' creado exitosamente.";
    }

    // Intentar conectar con las credenciales del usuario para validar el login
    public boolean iniciarSesion(String usuario, String password) {
        String url = "jdbc:mysql://localhost:3306/";
        try (Connection connection = DriverManager.getConnection(url, usuario, password)) {
            return true; // Si la conexión es exitosa, el usuario es válido
        } catch (SQLException e) {
            System.err.println("Error de conexión: " + e.getMessage());
            return false; // Si hay error, las credenciales son incorrectas
        }
    }
}
