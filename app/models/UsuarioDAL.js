module.exports = class UsuarioDAL {

    constructor(sharts_db) {
        this.sharts_db = sharts_db;
    }

    // findAll() {
    //     return new Promise((resolve, reject) => {
    //         this.sharts_db.query("SELECT u.id_usuario, u.nome, u.img_perfil_pasta" +
    //             "u.senha, u.email, u.tipo_usuario," +
    //             " u.status_usuario, t.tipo_usuario, t.descricao_usuario FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
    //             " u.tipo_usuario = t.id_tipo_usuario", function (error, elements) {
    //                 if (error) {
    //                     return reject(error);
    //                 }

    //                 return resolve(elements);
    //             });
    //     });
    // };

    findAll() {
        return new Promise((resolve, reject) => {
            this.conexao.query("SELECT u.id_usuario, u.nome, " +
                "u.senha, u.email, u.data_nasc, u.tipo_usuario," +
                " u.status_usuario, t.tipo_usuario, t.descricao_usuario FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
                " u.tipo_usuario = t.id_tipo_usuario", function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    findUserEmail(camposForm) {
        return new Promise((resolve, reject) => {
            this.sharts_db.query("SELECT * FROM usuario WHERE nome = ? or email = ?",
            [camposForm.nome, camposForm.nome],
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    // findID(id) {
    //     return new Promise((resolve, reject) => {
    //         this.sharts_db.query("SELECT u.id_usuario, u.nome, " +
    //             "u.senha, u.email, u.tipo_usuario," +
    //             "u.img_perfil_pasta, " +
    //             " u.status_usuario, t.tipo_usuario, t.descricao_usuario FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
    //             " u.tipo_usuario = t.id_tipo_usuario and u.id_usuario = ?", [id], function (error, elements) {
    //                 if (error) {
    //                     return reject(error);
    //                 }

    //                 return resolve(elements);
    //             });
    //     });
    // };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.sharts_db.query("SELECT u.id_usuario, u.nome, " +
                "u.senha, u.email, u.data_nasc, u.tipo_usuario," +
                "u.img_perfil_pasta, " +
                " u.status_usuario FROM usuario u where u.status_usuario = 1 and " +
                " u.id_usuario = ?", [id], function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    // findID(id) {
    //     return new Promise((resolve, reject) => {
    //         this.conexao.query("SELECT u.id_usuario, u.nome, " +
    //             "u.senha, u.email, u.tipo_usuario," +
    //             "u.img_perfil_pasta, " +
    //             " u.status_usuario, t.tipo_usuario FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
    //             " u.tipo_usuario = t.id_tipo_usuario and u.id_usuario = ?", [id], function (error, elements) {
    //                 if (error) {
    //                     return reject(error);
    //                 }

    //                 return resolve(elements);
    //             });
    //     });
    // };


    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.sharts_db.query("insert into usuario set ?",
                camposJson,
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(elements);
                });
        });
    }
    
    update(camposJson, id) {
        return new Promise((resolve, reject) => {
            this.sharts_db.query(
                "UPDATE usuario SET  ? WHERE id_usuario = ?",
                [camposJson, id],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.sharts_db.query("UPDATE usuario SET status_usuario = 0 WHERE id_usuario = ?", [id], function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }

    reactivate(id) {
        return new Promise((resolve, reject) => {
            this.sharts_db.query("UPDATE usuario SET status_usuario = 1 WHERE id_usuario = ?", [id], function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }
}

