const { validationResult } = require("express-validator");

function verificarUsuAutenticado(req, res, next) {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null };
    }
    req.session.autenticado = autenticado;
    next();
}

function limparSessao(req, res, next) {
    req.session.destroy();
    console.log("Sessão encerrada")
    next()
}

function gravarUsuAutenticado(usuarioDAL, bcrypt) {
    return async (req, res, next) => {
        erros = validationResult(req)
        if (erros.isEmpty()) {
            var dadosForm = {
                nome: req.body.nome,
                senha: req.body.senha,
                datan: req.body.datan,
            };
            console.log(dadosForm);
            var results = await usuarioDAL.findUserEmail(dadosForm);
            console.log(results);
            var total = Object.keys(results).length;
            if (total == 1) {
                if (bcrypt.compareSync(dadosForm.senha, results[0].senha)) {
                    var autenticado = {
                        autenticado: results[0].nome,
                        id: results[0].id_usuario,
                        tipo: results[0].tipo_usuario,
                        img_perfil_pasta:results[0].img_perfil_pasta,
                        status_usuario: results[0].status_usuario,
                    };
                }else{
                    var autenticado =  null ;
                }
            } else {
                var autenticado =  null ;
            }
        } else {
            var autenticado = null ;
            //tratar os erros no campo do formulário
        }
        req.session.autenticado = autenticado;
        next();
    }
}


function verificarUsuAutorizado(tipoPermitido, destinoFalha) {
    return (req, res, next) => {
        if (req.session.autenticado.autenticado != null &&
            tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined) {
            next();
        } else {
            res.render(destinoFalha);
        }
    };
}


module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}