    package com.dbproject.db.service;

    import java.util.ArrayList;
    import java.util.List;
    import java.util.Map;

    import javax.sql.DataSource;

    import org.springframework.boot.jdbc.DataSourceBuilder;
    import org.springframework.jdbc.core.JdbcTemplate;
    import org.springframework.stereotype.Service;

    @Service
    public class MySQLService {
        private final JdbcTemplate jdbcTemplate;

        public MySQLService(JdbcTemplate jdbcTemplate) {
            this.jdbcTemplate = jdbcTemplate;
        }

        public List<Map<String, Object>> ejecutarConsulta(String sql) {
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

        public void crearBaseDatos(String nombreDB) {
            String sql = "CREATE DATABASE " + nombreDB;
            jdbcTemplate.execute(sql);
        }

        public void eliminarBaseDatos(String nombreDB) {
            String sql = "DROP DATABASE " + nombreDB;
            jdbcTemplate.execute(sql);
        }

        public void crearUsuario(String usuario, String password) {
            String sql = "CREATE USER '" + usuario + "'@'%' IDENTIFIED BY '" + password + "'";
            jdbcTemplate.execute(sql);
        }

        public void otorgarPermisos(String usuario, String database) {
            String sql = "GRANT ALL PRIVILEGES ON " + database + ".* TO '" + usuario + "'@'%'";
            jdbcTemplate.execute(sql);
        }

        public List<Map<String, Object>> ejecutarConsulta(String base, String consulta) {
            String url = "jdbc:mysql://localhost:3306/" + base + "?serverTimezone=UTC";
            DataSource dataSource = DataSourceBuilder.create()
                    .url(url)
                    .username("root")
                    .password("123456")
                    //.password("Admin$2025")
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .build();

            JdbcTemplate template = new JdbcTemplate(dataSource);

            if (consulta.trim().toLowerCase().startsWith("select")) {
                return template.queryForList(consulta);
            } else 
            if (consulta.trim().toLowerCase().startsWith("show")) {
                return template.queryForList(consulta);
            } else {
                int affectedRows = template.update(consulta);
                // Puedes retornar información sobre la operación si lo deseas
                // Por ejemplo, una lista con un solo mapa indicando filas afectadas:
                Map<String, Object> result = Map.of("Lineas afectadas: ", affectedRows);
                List<Map<String, Object>> response = new ArrayList<>();
                response.add(result);
                return response;
            }   
        }

        // RV quiero agregar un listador de usuarios
        public List<String> listarUsuarios() {
            String sql = "SELECT user FROM mysql.user";
            return jdbcTemplate.queryForList(sql, String.class);
        }

        // RV quiero agregar un listador de permisos
        public List<Map<String, Object>> listarPermisos(String usuario) {
            String sql = "SHOW GRANTS FOR '" + usuario + "'@'%'";
            return jdbcTemplate.queryForList(sql);
        }
        

    }
