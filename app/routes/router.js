var express = require('express');
// const md5 = require('md5');
const { body, validationResult } = require('express-validator');

/*--------------------*/

const connectionFactory = require('../../config/connection-factory');
var router = express.Router();

var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);

const multer = require('multer');
const path = require('path');

var storagePasta = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './app/public/imagens/perfil/') // diretório de destino  
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    //renomeando o arquivo para evitar duplicidade de nomes
  }
})

var upload = multer({ storage: storagePasta });

var fabricaDeConexao = require("../../config/connection-factory")
var sharts_db = fabricaDeConexao();

var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(sharts_db);

var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado,
    verificarUsuAutorizado } = require("../models/autenticador_middleware");
const e = require('express');

// router.get("/", verificarUsuAutenticado, function (req, res){
//     req.session.autenticado.login = req.query.login;
//     res.render("pages/index", req.session.autenticado);
// });

router.get("/", verificarUsuAutenticado, function (req, res) {
  req.session.autenticado.login = req.query.login;
  res.render("pages/index", { autenticado: req.session.autenticado, login: req.session.autenticado.login, tipo_usuario: req.session.autenticado.tipo, img_perfil_pasta: req.session.autenticado.img_perfil_pasta });
});

router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
});

router.get("/restrito", verificarUsuAutenticado, function (req, res) {
  req.session.autenticado.login = req.query.login;
  res.render("pages/restrito", req.session.autenticado);
});

router.get("/login",  function (req, res) {
  // req.session.autenticado.login = req.query.login;
  res.locals.erroLogin = null
  res.render("pages/login", { listaErros: null, dadosNotificacao: null, valores: { nome: "", senha: ""}});
});

router.get("/post", verificarUsuAutenticado,  function (req, res) {
  req.session.autenticado.login = req.query.login;
  res.render("pages/post", req.session.autenticado);
});

// router.get("/login", function (req, res, next) {
//   if (req.session.autenticado) {
//     if(req.session.login){
//     res.redirect("pages/usuarioLogado");
//     }
//   } else {
//     next();
//   }
// }, function (req, res) {
//   // Esta função será executada apenas se o usuário não estiver logado
//   res.locals.erroLogin = null
//   res.render("pages/login", { listaErros: null, dadosNotificacao: null, valores: { nome: "", senha: "", autenticado: req.session.autenticado }});
// });

// router.get("/painel_adm", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) =>{
//   sharts_db.query("SELECT COUNT(id_usuario) AS total_usuarios FROM usuario", (error, results) => {
//     if (error) {
//       console.error("Erro ao contar usuários:", error);
//       res.status(500).send("Erro ao contar usuários.");
//     } else {
//     const totalUsuarios = results[0].total_usuarios;
//     res.render("pages/painel_adm", { listaErros: null, dadosNotificacao: null, valores: { nome: "", email: "", senha: "" }, autenticado: req.session.autenticado, totalUsuarios: totalUsuarios});

//   // req.session.autenticado.login = req.query.login;
// }
// });
// });

router.get("/painel_adm", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) => {
  try {
    const usuarios = await buscarUsuariosDoBanco();
    
    sharts_db.query("SELECT COUNT(id_usuario) AS total_usuarios FROM usuario", (error, results) => {
      if (error) {
        console.error("Erro ao contar usuários:", error);
        res.status(500).send("Erro ao contar usuários.");
      } else {
        const totalUsuarios = results[0].total_usuarios;
        
        res.render("pages/painel_adm", {
          listaErros: null,
          dadosNotificacao: null,
          valores: { nome: "", email: "", senha: "", img_perfil_pasta: ""},
          autenticado: req.session.autenticado,
          login: req.session.autenticado,
          tipo_usuario: req.session.autenticado.tipo,
          img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
          usuarios: usuarios,
          totalUsuarios: totalUsuarios, 
        });
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).send("Erro ao buscar usuários.");
  }
});

async function buscarUsuariosDoBanco() {
  return new Promise((resolve, reject) => {
    sharts_db.query("SELECT * FROM usuario", (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

router.post("/desativar-usuario/:id", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) => {
  const id = req.params.id;

  try {
    await usuarioDAL.delete(id);
    res.status(200).send("Usuário desativado com sucesso.");
    console.log("Usuário desativado com sucesso.");
  } catch (error) {
    console.error("Erro ao desativar o usuário:", error);
    res.status(500).send("Erro ao desativar o usuário.");
    console.log("Erro ao desativar o usuário.");
  }
});

router.post('/desativar-m-usuario', verificarUsuAutenticado, async (req, res) => {
  try {
    const id = req.session.autenticado.id;
    await usuarioDAL.delete(id);
    res.sendStatus(200); 
  } catch (error) {
    console.error("Erro ao desativar o usuário:", error);
    res.sendStatus(500);
  }
});

router.post("/reativar-usuario/:id", verificarUsuAutorizado([2, 3], "pages/restrito"), verificarUsuAutenticado, async (req, res) => {
  const id = req.params.id;

  try {
    await usuarioDAL.reactivate(id);
    res.status(200).send("Usuário reativado com sucesso.");
    console.log("Usuário reativado com sucesso.");
  } catch (error) {
    console.error("Erro ao reativar o usuário:", error);
    res.status(500).send("Erro ao reativar o usuário.");
    console.log("Erro ao reativar o usuário.");
  }
});

router.get("/sobrenos", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/sobrenos", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login})
});

router.get("/radio", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/radio", req.session.autenticado)
});

router.get("/termosECond", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/termosECond", req.session.autenticado)
});

router.get("/usuario", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/usuario", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

// router.get("/perfil", function (req, res){
//   res.render("../../app/views/pages/perfil", { listaErros: null, dadosNotificacao: null, valores: campos });
// });

router.get("/perfil", verificarUsuAutorizado([1, 2, 3], "pages/restrito"), verificarUsuAutenticado, async function (req, res) {
  try {
    let results = await usuarioDAL.findID(req.session.autenticado.id);
    console.log(results);
    let campos = {
      nome: results[0].nome, email: results[0].email,
      img_perfil_pasta: results[0].img_perfil_pasta, img_perfil_banco: results[0].img_perfil_banco,
      senha: ""
    }
    res.render("pages/perfil", { listaErros: null, dadosNotificacao: null, valores: campos, autenticado: req.session.autenticado, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta, tipo_usuario: req.session.autenticado.tipo })
  } catch (e) {
    res.render("pages/perfil", {
      listaErros: null, dadosNotificacao: null, valores: {
        img_perfil_banco: "", img_perfil_pasta: "", nome: "", email: "",
        nome: "", senha: "", tipo_usuario: req.session.autenticado.tipo
      }
    })
  }
});

router.get("/shartscinema", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
    res.render("pages/shartscinema", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/shartsdanca", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
    res.render("pages/shartsdanca", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/shartsfotografia", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
    res.render("pages/shartsfotografia", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/shartsmusica",verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/shartsmusica", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/shartsteatro", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
    res.render("pages/shartsteatro", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/shartsartesvisuais", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/shartsartesvisuais", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/shartsplanos", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/shartsplanos", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

router.get("/sobrenos", verificarUsuAutenticado, function (req, res){
  req.session.autenticado.login = req.query.login;
  res.render("pages/sobrenos", {autenticado: req.session.autenticado, tipo_usuario: req.session.autenticado.tipo, login: req.session.autenticado.login, img_perfil_pasta: req.session.autenticado.img_perfil_pasta})
});

// router.get("/cadastro-page", verificarUsuAutenticado,function (req, res){
//     // req.session.autenticado.login = req.query.login;
//     console.log(req.session.autenticado)
//     res.render("pages/cadastro", { listaErros: null, dadosNotificacao: null, valores: { nome: "", email: "", senha: "" }, autenticado: req.session.autenticado })
// }); 
/*correto para exibir nome no cadastro ou outras paginas^*/

router.get("/cadastro-page", function (req, res){
  res.render("pages/cadastro", { listaErros: null, dadosNotificacao: null, valores: { nome: "", email: "", senha: "" } })
});
  
router.post("/cadastro",
  body("nome")
    .isLength({ min: 2, max: 80 }).withMessage("Nome deve ter de 2 a 80 caracteres!"),
  body("email")
    .isEmail().withMessage("Digite um e-mail válido!"),
  body("senha")
    .isStrongPassword()
    .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
  async function (req, res) {
    var dadosForm = {
      senha: bcrypt.hashSync(req.body.senha, salt),
      nome: req.body.nome,
      email: req.body.email,
      data_nasc: req.body.datan,
    };
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      console.log("Erro ao cadastrar usuário:", erros);
      return res.render("pages/cadastro", { listaErros: erros, dadosNotificacao: null, valores: req.body })
    }
    try {
      let insert = await usuarioDAL.create(dadosForm);
      console.log(insert)
      console.log("Usuário cadastrado com sucesso - Sessão Iniciada")
      res.render("pages/cadastro", {
        listaErros: null, dadosNotificacao: {
          titulo: "Cadastro realizado!", mensagem: "Usuário criado com o id " + insert.insertId + "!", tipo: "success"
        }, valores: req.body

      })
    } catch (e) {
      console.error("Erro ao cadastrar usuário:", e);
      res.render("pages/cadastro", {
        listaErros: erros, dadosNotificacao: {
          titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
        }, valores: req.body
      })
    }
  }); 

  router.post("/login",
    body("nome")
      .isLength({ min: 4, max: 60 })
      .withMessage("O nome de usuário/e-mail deve ter de 8 a 60 caracteres"),
    body("senha")
      .isStrongPassword()
      .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"),
  
    gravarUsuAutenticado(usuarioDAL, bcrypt),
    function (req, res) {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        console.log("erro ao logar" + erros)
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null })
      }
      console.log("sessao "+req.session.autenticado);
      if (req.session.autenticado != null) {
        res.redirect("/?login=logado");
      } else {
        res.render("pages/login", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } })
      }

    });

var campos = {};

// router.post("/perfil", upload.single('img-perfil'),
//   body("nome")
//   .isLength({ min: 2, max: 80 }).withMessage("Nome deve ter de 2 a 80 caracteres!"),
//   body("email")
//     .isEmail().withMessage("Digite um e-mail válido!"),
//   verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
//   async function (req, res) {
//     const erros = validationResult(req);
//     console.log(erros)
//     if (!erros.isEmpty()) {
//       return res.render("pages/perfil", { listaErros: erros, dadosNotificacao: null, valores: req.body })
//     }
//     try {
//       var dadosForm = {
//         nome: req.body.nome,
//         email: req.body.email,
//         img_perfil_banco: null,
//         tipo_usuario: 1,
//         status_usuario: 1
//       };
//       console.log("senha: " + req.body.senha)
//       if (req.body.senha != "") {
//         dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
//       }
//       if (!req.file) {
//         console.log("Falha no carregamento");
//       } else {
//         caminhoArquivo = "imagens/perfil/" + req.file.filename;
//         dadosForm.img_perfil_pasta = caminhoArquivo
//       }
//       console.log(dadosForm);

//       let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
//       if (!resultUpdate.isEmpty) {
//         if (resultUpdate.changedRows == 1) {
//           var result = await usuarioDAL.findID(req.session.autenticado.id);
//           var autenticado = {
//             autenticado: result[0].nome,
//             id: result[0].id_usuario,
//             tipo: result[0].tipo_usuario,
//             img_perfil_banco: result[0].img_perfil_banco,
//             img_perfil_pasta: result[0].img_perfil_pasta
//           };
//           req.session.autenticado = autenticado;
//           var campos = {
//             nome: result[0].nome, email: result[0].email,
//             img_perfil_pasta: result[0].img_perfil_pasta, img_perfil_banco: result[0].img_perfil_banco,
//             senha: ""
//           }
//           res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "", tipo: "success" }, valores: campos });
//         }
//       }
//     } catch (e) {
//       console.log(e)
//       res.render("pages/perfil", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body })
//     }

//   });

router.post("/perfil", upload.single('img-perfil'),
  body("nome")
    .isLength({ min: 2, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  body("email")
    .isEmail().withMessage("Digite um e-mail válido!"),
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    const erros = validationResult(req);
    console.log(erros)
    if (!erros.isEmpty()) {
      return res.render("pages/perfil", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado, img_perfil_pasta: "", tipo_usuario: req.session.autenticado.tipo })
    }
    try {
      var dadosForm = {
        nome: req.body.nome,
        email: req.body.email,
        tipo_usuario: 1,
        status_usuario: 1
      };
      console.log("senha: " + req.body.senha)
      if (req.body.senha != "") {
        dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
      }
      if (!req.file) {
        console.log("Falha no carregamento");
      } else {
        caminhoArquivo = "imagens/perfil/" + req.file.filename;
        dadosForm.img_perfil_pasta = caminhoArquivo
      }
      console.log(dadosForm);

      let resultUpdate = await usuarioDAL.update(dadosForm, req.session.autenticado.id);
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var result = await usuarioDAL.findID(req.session.autenticado.id);
          console.log(result[0].nome)
          var autenticado = {
            autenticado: result[0].nome,
            id: result[0].id_usuario,
            tipo: result[0].tipo_usuario,
            img_perfil_banco: result[0].img_perfil_banco,
            img_perfil_pasta: result[0].img_perfil_pasta
          };
          req.session.autenticado = autenticado;
          var campos = {
            nome: result[0].nome, email: result[0].email,
            img_perfil_pasta: result[0].img_perfil_pasta, img_perfil_banco: result[0].img_perfil_banco,
            senha: ""
          }
          res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "", tipo: "success" }, valores: campos, autenticado: req.session.autenticado, img_perfil_pasta: "", tipo_usuario: req.session.autenticado.tipo });
        }
      }else{
        res.render("pages/perfil", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: campos, autenticado: req.session.autenticado, img_perfil_pasta: "", tipo_usuario: req.session.autenticado.tipo })
      }
    } catch (e) {
      console.log(e)
      res.render("pages/perfil", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body, autenticado: req.session.autenticado, img_perfil_pasta: "", tipo_usuario: req.session.autenticado.tipo })
    }

  });

module.exports = router;


//{

   // router.post('/login', (req, res) => 

    // )


//     const { email, senha } = req.body

//     if (email && senha) {

//         sharts_db.query(
//             'SELECT * FROM usuario WHERE email = ?',
//             [email],
//             (error, results) => {
//                 if (results.length > 0){
//                     const storedPassword = results[0].senha
//                     const hashedPassword = md5(senha)

//                     if(storedPassword === hashedPassword){
//                         req.session.loggedin = true
//                         req.session.email = email
//                         // res.redirect('/')
//                         console.log(req.session.loggedin, "Usuário logado")
//                         //res.send('Login realizado com sucesso!')
//                         res.render('../../app/views/pages/index')
//                     }else {
//                         res.send("Senha incorreta")
//                     }
//                 }else {
//                     res.send('Email não encontrado')
//                 }
//             }
//         )
//     } else {
//         res.send("Informe um email e senha")
//     }
// })


//router.post("/cadastro", (req, res) =>{
    //     const email = req.body.email;
    //     const senha = req.body.senha;
    //     const user = req.body.user;
    //     const datan = req.body.datan;
    
    //     if(email && senha && user && datan){
    //         sharts_db.query(
    //             'SELECT email, senha, nome, data_nasc FROM usuario WHERE email = ?',
    //             [email],
    //             (error, results) => {
    //                 if(results && results.length > 0){
    //                     res.send('O E-mail inserido já foi cadastrado')
    //                 }else{
    //                     const hashedPassword = md5(senha);
    
    //                     //Iserção de novo usuário
    
    //                     sharts_db.query(
    //                         'INSERT INTO usuario(email, senha, nome, data_nasc) VALUES ("' + email + '", "' + hashedPassword + '", "' + user + '", "' + datan + '")',
    //                         (error, results) => {
    //                             if(error){
    //                                 console.error('Ocorreu um erro no cadastro do usuário:', error.message);
    //                                 res.send('Ocorreu um erro no cadastro do usuário');
    //                             }else{
    //                                 res.send('O cadastro do usuário foi realizado com sucesso!');
    //                             }
    //                         }
    //                     );
    //                 }
    //             }
                
    //         );
    //     }else{
    // res.send('Preencha todos os campos corretamente!')
    //     }
    
    // }
    // )

