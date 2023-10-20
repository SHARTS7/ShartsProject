let count = 1;
document.getElementById("radio1").checked = true;

setInterval(function () {
	nextImage();
}, 5000)

function nextImage() {
	count++;
	if (count > 4) {
		count = 1
	}

	document.getElementById("radio" + count).checked = true;
}

function openComents(){
	const modal_coments = document.getElementById('coments-modal')
	modal_coments.classList.add('abrir')

	modal_coments.addEventListener('click', (e) => {
		if(e.target.id == 'close' || e.target.id == 'coments-modal'){
			modal_coments.classList.remove('abrir')
		}
	})

}

// menuButton.addEventListener("click", function() {
// 	if (menu.style.display === "none") {
// 	menu.style.display = "block";
// 	} else {
// 	  menu.style.transform = "translate(-110%, 0)";
// 	  menu.style.display = "none";
// 	}
//   });

// var menuButton = document.getElementById("IconePerfil");
// var menu = document.getElementById("u-sessao");

// menuButton.addEventListener("click", function() {
//   if (menu.style.display === "block") {
//     menu.style.display = "none";
//   } else {
//     menu.style.display = "block";
//   }
// });

// var menuButton = document.getElementById("IconePerfil");
// var menu = document.getElementById("u-sessao");

// menuButton.addEventListener("mouseenter", function() {
//   menu.style.display = "block";
//   menu.style.transform = "none";
  
// });

// menuButton.addEventListener("mouseleave", function() {
//   menu.style.transform = "translate(-100%, 0)";
//   menu.style.display = "none";
// });









