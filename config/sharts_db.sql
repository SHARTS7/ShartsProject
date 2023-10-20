/*drop database sharts_db;*/

ALTER USER 'root'@'localhost' 
IDENTIFIED 
with 
mysql_native_password 
BY '@ITB123456';

CREATE DATABASE sharts_db;
USE sharts_db;

CREATE TABLE comentario(
    id_comentario int not null auto_increment primary key,
    qtd_views int,
    qtd_curtidas int,
    username varchar(45) not null
);

CREATE TABLE usuario (
  id_usuario int not null auto_increment primary key,
  nome varchar(45) not null,
  email varchar(100) not null,
  senha varchar(60) not null,
  data_nasc DATE DEFAULT NULL,	
  tipo_usuario int not null DEFAULT '1',
  status_usuario int DEFAULT '1',
  img_banner_url varchar(255),
  img_perfil_pasta varchar(255),
  num_seguidores int,
  qtd_views int,
  qtd_likes int,
  id_comentario int,
  foreign key (id_comentario) references comentario(id_comentario)
);

INSERT INTO usuario (nome, email, senha, tipo_usuario, status_usuario) VALUES ("Admin", "admin@gmail.com", "$2a$12$kdUxRAsjBKQCEWEaaHWJZexsk/T3Q0k9R0.a/nherYvfixHYPCKt6", "2", "1");

CREATE TABLE tipo_usuario (
  id_tipo_usuario int NOT NULL AUTO_INCREMENT,
  tipo_usuario varchar(25) DEFAULT NULL,
  descricao_usuario varchar(155) DEFAULT NULL,
  status_tipo_usuario int DEFAULT '1',
  PRIMARY KEY (id_tipo_usuario)
);

/*select * FROM usuario;*/

/*Admin - Email: shartsproject@gmail.com | Senha: @Sharts123*/

CREATE TABLE categoria(
    id_categoria int not null auto_increment primary key,
    titulo_categoria varchar(45) not null,
    desc_categoria varchar(1200) not null
);

CREATE TABLE usuario_categoria(
    id_usuario_categoria int not null auto_increment primary key,
    id_usuario int not null,
    foreign key (id_usuario) references usuario(id_usuario),
    id_categoria int not null,
    foreign key (id_categoria) references categoria(id_categoria)
);

CREATE TABLE postagem(
    id_postagem int not null auto_increment primary key,
    qtd_views int,
    qtd_curtidas int,
    username varchar(45) not null,
    id_comentario int not null,
    foreign key (id_comentario) references comentario(id_comentario)
);

CREATE TABLE usuario_postagem(
    id_usuario_postagem int not null auto_increment primary key,
    id_usuario int not null,
    foreign key (id_usuario) references usuario(id_usuario),
    id_postagem int not null,
    foreign key (id_postagem) references postagem(id_postagem)
);

CREATE TABLE midia(
    id_midia int not null auto_increment primary key,
    tipo_midia varchar(30)
);

CREATE TABLE postagem_midia(
    id_postagem_midia int not null auto_increment primary key,
    id_postagem int not null,
    foreign key (id_postagem) references postagem(id_postagem),
    id_midia int not null,
    foreign key (id_midia) references midia(id_midia)
);




