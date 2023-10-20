const mysql = require("mysql");

module.exports = function () {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "@ITB123456",
    password: "",
    database: "sharts_db",
    port: 3306,
  });

  connection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
    } else {
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
    }
  });

  return connection;
};
