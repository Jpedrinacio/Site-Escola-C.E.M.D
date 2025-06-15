function MostrarSenha() {
    const inputPass = document.getElementById('password');
    const btnShowPass = document.getElementById('btn-senha');

    if (inputPass.type === 'password') {
        inputPass.setAttribute('type', 'text');
        btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputPass.setAttribute('type', 'password');
        btnShowPass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
}

const alunoBtn = document.querySelector('.aluno');
const professorBtn = document.querySelector('.professor');
const loginLabel = document.getElementById('login-label');
const loginInput = document.getElementById('login-input');
const loginTip = document.querySelector('.login-tip'); 
const passwordField = document.getElementById('password'); 
const passwordTip = document.querySelector('.password-tip'); 
const btnLogin = document.querySelector('.btn-login');
const alertContainer = document.getElementById('alert-container'); 

alunoBtn.classList.add("selecionado");
loginInput.setAttribute("maxlength", "8");
loginInput.setAttribute("minlength", "8");
loginTip.textContent = "O CGM deve conter 8 dígitos.";

loginInput.addEventListener('input', () => {
    loginInput.value = loginInput.value.replace(/\D/g, '');
});

alunoBtn.addEventListener('click', () => {
    alunoBtn.classList.add("selecionado");
    professorBtn.classList.remove("selecionado");

    loginLabel.textContent = "CGM";
    loginInput.placeholder = "Digite seu CGM";
    loginInput.setAttribute("maxlength", "8");
    loginInput.setAttribute("minlength", "8");
    loginInput.value = "";
    loginTip.textContent = "O CGM deve conter 8 dígitos."; 
});

professorBtn.addEventListener('click', () => {
    professorBtn.classList.add("selecionado");
    alunoBtn.classList.remove("selecionado");

    loginLabel.textContent = "CPF";
    loginInput.placeholder = "Digite seu CPF";
    loginInput.setAttribute("maxlength", "11");
    loginInput.setAttribute("minlength", "11");
    loginInput.value = "";
    loginTip.textContent = "O CPF deve conter 11 dígitos.";
});

btnLogin.addEventListener('click', (event) => {
    event.preventDefault(); 

    alertContainer.innerHTML = ''; 

    const cgmCpf = loginInput.value.trim();
    const senha = passwordField.value.trim();
    const tipo = alunoBtn.classList.contains('selecionado') ? 'aluno' : 'professor';
    const minLengthCgmCpf = tipo === 'aluno' ? 8 : 11;
    const minLengthPassword = 8;

    let hasError = false;


    if (cgmCpf.length !== minLengthCgmCpf) {
        mostrarAlerta(`O ${tipo === 'aluno' ? 'CGM' : 'CPF'} deve conter ${minLengthCgmCpf} dígitos.`, "erro");
        hasError = true;
    }

    if (senha.length < minLengthPassword) {
        mostrarAlerta(`A senha deve ter no mínimo ${minLengthPassword} dígitos.`, "erro");
        hasError = true;
    }

    if (hasError) {
        return; 
    }

    mostrarAlerta("Login realizado com sucesso!", "sucesso");

    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/SiteEscola/Inicio.html";
    }, 2000);
});

function mostrarAlerta(mensagem, tipo) {
    const alerta = document.createElement("div");
    alerta.classList.add("alerta", tipo);
    alerta.innerHTML = `
        <span class="msg">${mensagem}</span>
        <i class="bi bi-x" onclick="fecharAlerta(this)"></i>
    `;

    alertContainer.appendChild(alerta);

    setTimeout(() => {
        alerta.classList.add("remover");
        setTimeout(() => alerta.remove(), 500);
    }, 5000);
}

function fecharAlerta(icon) {
    const alerta = icon.parentElement;
    alerta.classList.add("remover");
    setTimeout(() => alerta.remove(), 500);
}