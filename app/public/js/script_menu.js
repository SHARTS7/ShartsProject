var menuButton = document.getElementById("IconePerfil");
var menu = document.getElementById("u-sessao");
var hoverTimer; // Variável para armazenar o ID do timeout

menuButton.addEventListener("mouseenter", function() {
  clearTimeout(hoverTimer); // Limpa o timeout anterior, se houver

  menu.style.display = "block";
  menu.style.transform = "none";
});

menuButton.addEventListener("mouseleave", function() {
  // Define um timeout de 5 segundos para ocultar o menu após o mouse sair do elemento
  hoverTimer = setTimeout(function() {
    menu.style.transform = "translate(-100%, 0)";
    menu.style.display = "none";
  }, 2000); // 5000 milissegundos = 5 segundos
});