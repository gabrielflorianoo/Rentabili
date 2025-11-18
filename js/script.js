// flip do card
function flipCard() {
  document.getElementById('innovativeCard').classList.toggle('flipped');
}

// canvas animado - (código original mantido)
(function() {
  const canvas = document.getElementById('animatedLines');
  const ctx = canvas.getContext('2d');
  let DPR = window.devicePixelRatio || 1;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); 
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM_LINES = 60;
  const lines = [];

  function resetLine(line) {
    line.x = Math.random() * (window.innerWidth * 1.5) - window.innerWidth * 0.25;
    line.y = window.innerHeight + Math.random() * 200 + 20;
    line.length = 80 + Math.random() * 220;
    line.speed = 0.6 + Math.random() * 2.4;
    line.thickness = 1 + Math.random() * 2;
    line.opacity = 0.15 + Math.random() * 0.35;
    const base = -Math.PI / 4;
    line.angle = base + (Math.random() - 0.5) * 0.25;
    const g = 150 + Math.floor(Math.random() * 105); 
    line.color = `rgba(0, ${g}, 0, ${line.opacity})`;
  }

  for (let i = 0; i < NUM_LINES; i++) {
    const l = {};
    resetLine(l);
    l.y += Math.random() * 800;
    lines.push(l);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.thickness;
      ctx.lineCap = 'round';
      const x1 = line.x;
      const y1 = line.y;
      const x2 = x1 + Math.cos(line.angle) * line.length;
      const y2 = y1 + Math.sin(line.angle) * line.length;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      line.y -= line.speed;
      line.x -= line.speed * 0.9;
      if (y2 < -50 || x2 < -200) {
        resetLine(line);
        line.y = window.innerHeight + Math.random() * 300;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// ---------------------------------------------------
// --- BANCO DE DADOS SIMULADO ---
// ---------------------------------------------------
let userDatabase = [];
let emailToReset = ""; 

// ---------------------------------------------------
// --- FUNÇÃO DE LIMPAR ERROS ---
// ---------------------------------------------------
function clearAllErrors() {
  const errorSpans = document.querySelectorAll('.error-message');
  errorSpans.forEach(span => {
    span.textContent = '';
    span.style.display = 'none';
  });

  const inputs = document.querySelectorAll('.floating-input');
  inputs.forEach(input => {
    input.classList.remove('input-error');
  });
}

// ---------------------------------------------------
// FUNÇÃO DE LOGIN
// ---------------------------------------------------
function handleLogin(e) {
  e.preventDefault();
  clearAllErrors(); 
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = userDatabase.find(user => user.email === email);

  if (!user) {
    document.getElementById('login-error').textContent = 'Não existe conta com esse e-mail.';
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-email').classList.add('input-error');
    return;
  }

  if (user.password === password) {
    alert('Login realizado com sucesso! Bem-vindo(a), ' + user.name + '!');
    e.target.reset(); 
  } else {
    document.getElementById('password-error').textContent = 'Senha incorreta.';
    document.getElementById('password-error').style.display = 'block';
    document.getElementById('login-password').classList.add('input-error');
  }
}

// ---------------------------------------------------
// FUNÇÃO DE REGISTRO - MODIFICADA
// ---------------------------------------------------
function handleRegister(e) {
  e.preventDefault();
  clearAllErrors(); 
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const dobString = document.getElementById('register-dob').value;

  // --- VALIDAÇÕES ---
  let hasError = false; // Flag para rastrear erros

  // Validação de E-mail
  const emailExists = userDatabase.find(user => user.email === email);
  if (emailExists) {
    document.getElementById('register-email-error').textContent = 'Este e-mail já está cadastrado.';
    document.getElementById('register-email-error').style.display = 'block';
    document.getElementById('register-email').classList.add('input-error');
    hasError = true;
  }

  // Validação de Data de Nascimento
  if (!dobString) {
    document.getElementById('register-dob-error').textContent = 'Por favor, selecione sua data.';
    document.getElementById('register-dob-error').style.display = 'block';
    document.getElementById('register-dob').classList.add('input-error');
    hasError = true;
  } else {
    const parts = dobString.split('-'); 
    const dob = new Date(parts[0], parts[1] - 1, parts[2]); 
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      document.getElementById('register-dob-error').textContent = 'Você deve ter pelo menos 18 anos.';
      document.getElementById('register-dob-error').style.display = 'block';
      document.getElementById('register-dob').classList.add('input-error');
      hasError = true;
    }
  }

  // --- NOVA VALIDAÇÃO DE SENHA ---
  // Regex: Mínimo 6 caracteres E pelo menos 1 caractere especial
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (password.length < 6 || !specialCharRegex.test(password)) {
    document.getElementById('register-password-error').textContent = 'Mín. 6 caracteres e 1 especial (!@#$).';
    document.getElementById('register-password-error').style.display = 'block';
    document.getElementById('register-password').classList.add('input-error');
    hasError = true;
  }

  // Validação de Confirmação de Senha
  if (password !== confirmPassword) {
    document.getElementById('register-confirm-error').textContent = 'As senhas não coincidem.';
    document.getElementById('register-confirm-error').style.display = 'block';
    document.getElementById('register-confirm-password').classList.add('input-error');
    hasError = true; 
  }

  // Se houver qualquer erro, para a execução
  if (hasError) {
    return;
  }

  // --- SUCESSO ---
  const newUser = { name: name, email: email, password: password, dob: dobString };
  userDatabase.push(newUser);
  console.log('Usuário cadastrado:', newUser);
  console.log('Banco de dados atual:', userDatabase);

  const registerView = document.getElementById('register-view');
  const welcomeView = document.getElementById('welcome-view');
  
  registerView.style.display = 'none';
  welcomeView.style.display = 'block';
  welcomeView.classList.remove('fade-in-up');
  void welcomeView.offsetWidth; 
  welcomeView.classList.add('fade-in-up');

  e.target.reset();
}

// ---------------------------------------------------
// FUNÇÃO para o botão "Fazer Login Agora"
// ---------------------------------------------------
function goToLogin() {
  document.getElementById('welcome-view').style.display = 'none';
  document.getElementById('register-view').style.display = 'block'; 
  flipCard();
  
  setTimeout(() => {
    showView('login-view');
  }, 500); 
}

// ---------------------------------------------------
// FUNÇÕES PARA O FLUXO DE "ESQUECEU A SENHA"
// ---------------------------------------------------

function showView(viewId) {
  clearAllErrors(); 
  document.getElementById('innovativeCard').classList.remove('flipped');
  
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('forgot-view').style.display = 'none';
  document.getElementById('validate-view').style.display = 'none';

  const viewToShow = document.getElementById(viewId);
  if (viewToShow) {
    viewToShow.style.display = 'block';
    viewToShow.classList.remove('fade-in-up');
    void viewToShow.offsetWidth; 
    viewToShow.classList.add('fade-in-up');
  }
}

function handleForgotPassword(e) {
  e.preventDefault();
  clearAllErrors(); 
  const email = document.getElementById('forgot-email').value;
  
  const user = userDatabase.find(user => user.email === email);

  if (user) {
    emailToReset = user.email; 
    alert('Um código de verificação foi enviado para ' + email + '.\n(Use o código "123456" para testar.)');
    showView('validate-view'); 
  } else {
    document.getElementById('forgot-error').textContent = 'Não existe conta com esse e-mail.';
    document.getElementById('forgot-error').style.display = 'block';
    document.getElementById('forgot-email').classList.add('input-error');
  }
}

function handleValidateCode(e) {
  e.preventDefault();
  clearAllErrors(); 
  
  const code = document.getElementById('validate-code').value;
  const newPassword = document.getElementById('validate-password').value;

  if (!code || !newPassword) {
    document.getElementById('validate-code-error').textContent = 'Preencha todos os campos.';
    document.getElementById('validate-code-error').style.display = 'block';
    return;
  }

  // --- NOVA VALIDAÇÃO DE SENHA (TAMBÉM NA REDEFINIÇÃO) ---
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (newPassword.length < 6 || !specialCharRegex.test(newPassword)) {
      document.getElementById('validate-code-error').textContent = 'A nova senha deve ter mín. 6 caracteres e 1 especial (!@#$).';
      document.getElementById('validate-code-error').style.display = 'block';
      document.getElementById('validate-password').classList.add('input-error');
      return;
  }

  if (code === "123456") {
    
    const userToUpdate = userDatabase.find(user => user.email === emailToReset);

    if (userToUpdate) {
      userToUpdate.password = newPassword;
      alert('Senha redefinida com sucesso! Você já pode fazer o login.');
      console.log('Banco de dados (senha resetada):', userDatabase);
    } else {
      alert('Erro ao encontrar usuário. Tente novamente.');
    }

    showView('login-view'); 

    emailToReset = ""; 
    document.getElementById('forgot-email').value = '';
    document.getElementById('validate-code').value = '';
    document.getElementById('validate-password').value = '';

  } else {
    document.getElementById('validate-code-error').textContent = 'Código de verificação inválido.';
    document.getElementById('validate-code-error').style.display = 'block';
    document.getElementById('validate-code').classList.add('input-error');
  }
}