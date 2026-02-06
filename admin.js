// 🔐 Inicializar Backendless
Backendless.initApp(
  "SUA-APP-ID",
  "SUA-JAVASCRIPT-KEY"
);

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  Backendless.UserService.login(email, password, true)
    .then(() => {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("adminBox").style.display = "block";
    })
    .catch(() => alert("Login inválido"));
}

// SALVAR MOTO
function salvarMoto() {
  const moto = {
    nome: document.getElementById("nome").value,
    marca: document.getElementById("marca").value,
    ano: document.getElementById("ano").value,
    preco: document.getElementById("preco").value,
    imagem: document.getElementById("imagem").value,
    descricao: document.getElementById("descricao").value
  };

  Backendless.Data.of("Motos").save(moto)
    .then(() => {
      alert("Moto salva com sucesso!");
      document.querySelectorAll("input, textarea").forEach(el => el.value = "");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao salvar moto");
    });
}
