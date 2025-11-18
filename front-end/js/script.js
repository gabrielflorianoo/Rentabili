//virado o card
function virarCard() {
  document.getElementById('cardLogin').classList.toggle('virado');
}

//usando o canvas como efeito de fundo
(function() {
  const canvas = document.getElementById('bg-effect');
  const ctx = canvas.getContext('2d');
  let escala = window.devicePixelRatio || 1;

  function ajustarTamanho() {
    escala = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * escala);
    canvas.height = Math.floor(window.innerHeight * escala);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(escala, 0, 0, escala, 0, 0); 
  }
  ajustarTamanho();
  window.addEventListener('resize', ajustarTamanho);

  const qtdLinhas = 60;
  const minhasLinhas = [];

  function criarLinha(l) {
    l.x = Math.random() * (window.innerWidth * 1.5) - window.innerWidth * 0.25;
    l.y = window.innerHeight + Math.random() * 200 + 20;
    l.tamanho = 80 + Math.random() * 220;
    l.vel = 0.6 + Math.random() * 2.4;
    l.grossura = 1 + Math.random() * 2;
    l.transparencia = 0.15 + Math.random() * 0.35;
    const anguloFixo = -Math.PI / 4;
    l.angulo = anguloFixo + (Math.random() - 0.5) * 0.25;
    // sorteia um tom de verde
    const verde = 150 + Math.floor(Math.random() * 105); 
    l.cor = `rgba(0, ${verde}, 0, ${l.transparencia})`;
  }

//inicializa o array
  for (let i = 0; i < qtdLinhas; i++) {
    const obj = {};
    criarLinha(obj);
    obj.y += Math.random() * 800;
    minhasLinhas.push(obj);
  }

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < minhasLinhas.length; i++) {
      const linha = minhasLinhas[i];

      ctx.beginPath();
      ctx.strokeStyle = linha.cor;
      ctx.lineWidth = linha.grossura;
      ctx.lineCap = 'round';

      const x1 = linha.x;
      const y1 = linha.y;
      const x2 = x1 + Math.cos(linha.angulo) * linha.tamanho;
      const y2 = y1 + Math.sin(linha.angulo) * linha.tamanho;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      linha.y -= linha.vel;
      linha.x -= linha.vel * 0.9;

      if (y2 < -50 || x2 < -200) {
        criarLinha(linha);
        linha.y = window.innerHeight + Math.random() * 300;
      }
    }
    requestAnimationFrame(desenhar);
  }
  desenhar();
})();


//Simulador de usuário

let listaUsuarios = [];
let emailParaRecuperar = ""; 

//reseta mensagens
function resetarErros() {
  const spans = document.querySelectorAll('.msg-erro');
  spans.forEach(s => {
    s.textContent = '';
    s.style.display = 'none';
  });

  const campos = document.querySelectorAll('.input-custom');
  campos.forEach(c => {
    c.classList.remove('erro-borda');
  });
}


//Login

function fazerLogin(e) {
  e.preventDefault();
  resetarErros(); 
  
  const emailDigitado = document.getElementById('login-email').value;
  const senhaDigitada = document.getElementById('login-senha').value;
  const usuario = listaUsuarios.find(u => u.email === emailDigitado); //verifica se tem e-mail

  if (!usuario) {
    //avisa que nao achou
    document.getElementById('erro-login-email').textContent = 'Não existe conta com esse e-mail.';
    document.getElementById('erro-login-email').style.display = 'block';
    document.getElementById('login-email').classList.add('erro-borda');
    return;
  }

  //onfere a senha
  if (usuario.senha === senhaDigitada) {
    alert('Login realizado com sucesso! Bem-vindo(a), ' + usuario.nome + '!');
    e.target.reset(); 
  } else {
    document.getElementById('erro-login-senha').textContent = 'Senha incorreta.';
    document.getElementById('erro-login-senha').style.display = 'block';
    document.getElementById('login-senha').classList.add('erro-borda');
  }
}


//Cadastro

function cadastrarUsuario(e) {
  e.preventDefault();
  resetarErros(); 
  
  const nome = document.getElementById('cad-nome').value;
  const email = document.getElementById('cad-email').value;
  const senha = document.getElementById('cad-senha').value;
  const confirma = document.getElementById('cad-confirma').value;
  const data = document.getElementById('cad-nasc').value;

  let erroEncontrado = false; 

  //verifica se email ja existe
  const existe = listaUsuarios.find(u => u.email === email);
  if (existe) {
    document.getElementById('erro-cad-email').textContent = 'Este e-mail já está cadastrado.';
    document.getElementById('erro-cad-email').style.display = 'block';
    document.getElementById('cad-email').classList.add('erro-borda');
    erroEncontrado = true;
  }

  //verifica idade
  if (!data) {
    document.getElementById('erro-cad-nasc').textContent = 'Por favor, selecione sua data.';
    document.getElementById('erro-cad-nasc').style.display = 'block';
    document.getElementById('cad-nasc').classList.add('erro-borda');
    erroEncontrado = true;
  } else {
    const arrData = data.split('-'); 
    const dataNasc = new Date(arrData[0], arrData[1] - 1, arrData[2]); 
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    if (idade < 18) {
      document.getElementById('erro-cad-nasc').textContent = 'Você deve ter pelo menos 18 anos.';
      document.getElementById('erro-cad-nasc').style.display = 'block';
      document.getElementById('cad-nasc').classList.add('erro-borda');
      erroEncontrado = true;
    }
  }

  //Validar senha com min 6 chars + especial
  const regexSenha = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (senha.length < 6 || !regexSenha.test(senha)) {
    document.getElementById('erro-cad-senha').textContent = 'Mín. 6 caracteres e 1 especial (!@#$).';
    document.getElementById('erro-cad-senha').style.display = 'block';
    document.getElementById('cad-senha').classList.add('erro-borda');
    erroEncontrado = true;
  }

  // 4. confirma se as senhas batem
  if (senha !== confirma) {
    document.getElementById('erro-cad-confirma').textContent = 'As senhas não coincidem.';
    document.getElementById('erro-cad-confirma').style.display = 'block';
    document.getElementById('cad-confirma').classList.add('erro-borda');
    erroEncontrado = true; 
  }

  if (erroEncontrado) {
    return; // para tudo se deu ruim
  }

  // sucesso: salva no array
  const novoUsuario = { 
    nome: nome, 
    email: email, 
    senha: senha, 
    nascimento: data 
  };
  
  listaUsuarios.push(novoUsuario);
  console.log('Novo usuário:', novoUsuario);

  // troca pra tela de sucesso
  const divCadastro = document.getElementById('tela-cadastro');
  const divBemVindo = document.getElementById('tela-bemvindo');
  
  divCadastro.style.display = 'none';
  divBemVindo.style.display = 'block';
  
  // reinicia a animacao css
  divBemVindo.classList.remove('animacao-up');
  void divBemVindo.offsetWidth; 
  divBemVindo.classList.add('animacao-up');

  e.target.reset();
}

//botao da tela de sucesso
function irParaLogin() {
  document.getElementById('tela-bemvindo').style.display = 'none';
  document.getElementById('tela-cadastro').style.display = 'block'; 
  
  virarCard();
  
  setTimeout(() => {
    trocarTela('tela-login');
  }, 500); 
}


// funcao auxiliar pra mudar as divs da frente
function trocarTela(idTela) {
  resetarErros(); 
  document.getElementById('cardLogin').classList.remove('virado');
  
  document.getElementById('tela-login').style.display = 'none';
  document.getElementById('tela-esqueci').style.display = 'none';
  document.getElementById('tela-validar').style.display = 'none';

  const alvo = document.getElementById(idTela);
  if (alvo) {
    alvo.style.display = 'block';
    alvo.classList.remove('animacao-up');
    void alvo.offsetWidth; 
    alvo.classList.add('animacao-up');
  }
}

function enviarCodigo(e) {
  e.preventDefault();
  resetarErros(); 
  const email = document.getElementById('esqueci-email').value;
  
  const achou = listaUsuarios.find(u => u.email === email);

  if (achou) {
    emailParaRecuperar = achou.email; 
    alert('Código enviado para ' + email + '.\n(Use "123456" para testar)');
    trocarTela('tela-validar'); 
  } else {
    document.getElementById('erro-esqueci').textContent = 'Não existe conta com esse e-mail.';
    document.getElementById('erro-esqueci').style.display = 'block';
    document.getElementById('esqueci-email').classList.add('erro-borda');
  }
}

function validarCodigo(e) {
  e.preventDefault();
  resetarErros(); 
  
  const codigo = document.getElementById('codigo-validacao').value;
  const nova = document.getElementById('nova-senha').value;

  if (!codigo || !nova) {
    document.getElementById('erro-validacao-cod').textContent = 'Preencha tudo.';
    document.getElementById('erro-validacao-cod').style.display = 'block';
    return;
  }

  //validar senha
  const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (nova.length < 6 || !regex.test(nova)) {
      document.getElementById('erro-validacao-cod').textContent = 'Senha fraca (min 6 chars + especial).';
      document.getElementById('erro-validacao-cod').style.display = 'block';
      return;
  }

  if (codigo === "123456") {
    
    const user = listaUsuarios.find(u => u.email === emailParaRecuperar);

    if (user) {
      user.senha = nova;
      alert('Senha trocada com sucesso! Faça login.');
    } else {
      alert('Erro bizarro, usuario sumiu.');
    }

    trocarTela('tela-login'); 

    emailParaRecuperar = ""; 
    document.getElementById('esqueci-email').value = '';
    document.getElementById('codigo-validacao').value = '';
    document.getElementById('nova-senha').value = '';

  } else {
    document.getElementById('erro-validacao-cod').textContent = 'Código inválido.';
    document.getElementById('erro-validacao-cod').style.display = 'block';
    document.getElementById('codigo-validacao').classList.add('erro-borda');
  }
}