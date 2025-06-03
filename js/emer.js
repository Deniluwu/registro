// Inicializar usuarios en localStorage (si no existen, se le añade un usuario por defecto)
function initializeUsers() {
  if (!localStorage.getItem("users")) {
    let defaultUsers = { admin: "admin123" };
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
}
initializeUsers();

// Array para guardar los pacientes
let pacientes = [];

/* ---------------------------
   INICIO DE SESIÓN (Modal)
--------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Mostrar modal de inicio de sesión con backdrop estático
  const loginModalEl = document.getElementById("loginModal");
  const loginModal = new bootstrap.Modal(loginModalEl, { backdrop: "static" });
  loginModal.show();

  // Login: verificar usuario y contraseña desde localStorage
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const usuario = document.getElementById("username").value.trim();
    const clave = document.getElementById("password").value.trim();
    let users = JSON.parse(localStorage.getItem("users"));

    if (users[usuario] && users[usuario] === clave) {
      loginModal.hide();
      document.getElementById("mainContent").style.display = "block";
    } else {
      document.getElementById("loginAlert").classList.remove("d-none");
    }
  });

  // Enlace para mostrar el modal de registro
  document.getElementById("linkRegistro").addEventListener("click", function (e) {
    e.preventDefault();
    loginModal.hide();
    const registroModalEl = document.getElementById("registroModal");
    const registroModal = new bootstrap.Modal(registroModalEl, { backdrop: "static" });
    registroModal.show();
  });

  // Enlace para el "Olvido la contraseña"
  document.getElementById("linkForgot").addEventListener("click", function (e) {
    e.preventDefault();
    loginModal.hide();
    const forgotModalEl = document.getElementById("forgotModal");
    const forgotModal = new bootstrap.Modal(forgotModalEl, { backdrop: "static" });
    forgotModal.show();
  });
});

/* ---------------------------
   REGISTRO DE USUARIOS
--------------------------- */
document.getElementById("registroForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const usuario = document.getElementById("reg_username").value.trim();
  const password = document.getElementById("reg_password").value.trim();
  const confirmPassword = document.getElementById("reg_confirm_password").value.trim();
  const registroAlert = document.getElementById("registroAlert");

  // Expresión regular: mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (password !== confirmPassword) {
    registroAlert.textContent = "Las contraseñas no coinciden.";
    registroAlert.classList.remove("d-none");
    return;
  }
  if (!passwordRegex.test(password)) {
    registroAlert.textContent =
      "La contraseña debe tener mínimo 8 caracteres, e incluir mayúsculas, minúsculas, números y signos.";
    registroAlert.classList.remove("d-none");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users"));
  if (users[usuario]) {
    registroAlert.textContent = "El usuario ya existe. Por favor, elige otro.";
    registroAlert.classList.remove("d-none");
    return;
  }

  // Almacenar usuario en localStorage
  users[usuario] = password;
  localStorage.setItem("users", JSON.stringify(users));

  registroAlert.classList.add("d-none");
  const registroModalEl = document.getElementById("registroModal");
  const registroModal = bootstrap.Modal.getInstance(registroModalEl);
  registroModal.hide();

  // Mostrar de vuelta el login
  const loginModalEl = document.getElementById("loginModal");
  const loginModal = new bootstrap.Modal(loginModalEl, { backdrop: "static" });
  loginModal.show();
});

/* ---------------------------
   RECUPERAR CONTRASEÑA (Olvido)
--------------------------- */
document.getElementById("forgotForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const forgotUsername = document.getElementById("forgot_username").value.trim();
  const newPassword = document.getElementById("new_password").value.trim();
  const confirmNewPassword = document.getElementById("confirm_new_password").value.trim();
  const forgotAlert = document.getElementById("forgotAlert");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  let users = JSON.parse(localStorage.getItem("users"));
  if (!users[forgotUsername]) {
    forgotAlert.textContent = "El usuario no existe.";
    forgotAlert.classList.remove("d-none");
    return;
  }
  if (newPassword !== confirmNewPassword) {
    forgotAlert.textContent = "Las contraseñas no coinciden.";
    forgotAlert.classList.remove("d-none");
    return;
  }
  if (!passwordRegex.test(newPassword)) {
    forgotAlert.textContent =
      "La contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y signos.";
    forgotAlert.classList.remove("d-none");
    return;
  }

  // Actualizar contraseña
  users[forgotUsername] = newPassword;
  localStorage.setItem("users", JSON.stringify(users));

  forgotAlert.classList.add("d-none");
  const forgotModalEl = document.getElementById("forgotModal");
  const forgotModal = bootstrap.Modal.getInstance(forgotModalEl);
  forgotModal.hide();

  const loginModalEl = document.getElementById("loginModal");
  const loginModal = new bootstrap.Modal(loginModalEl, { backdrop: "static" });
  loginModal.show();
});

/* ---------------------------
   REGISTRO DE PACIENTES
--------------------------- */
document
  .getElementById("formularioPaciente")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const genero = document.getElementById("genero").value;
    const documento = document.getElementById("documento").value.trim();
    const sintomas = document.getElementById("sintomas").value.trim();
    const gravedad = document.getElementById("gravedad").value;
    const tratamiento = document.getElementById("tratamiento").value.trim();
    const medicamentos = document.getElementById("medicamentos").value.trim();
    const examenes = document.getElementById("examenes").value;

    if (
      !nombre ||
      isNaN(edad) ||
      edad <= 0 ||
      documento.length < 5 ||
      !sintomas ||
      !tratamiento ||
      !medicamentos ||
      examenes === ""
    ) {
      alert(
        "Por favor, completa todos los campos correctamente. La edad debe ser un número mayor a 0 y el documento al menos 5 caracteres."
      );
      return;
    }

    const paciente = {
      nombre,
      edad,
      genero,
      documento,
      sintomas,
      gravedad,
      tratamiento,
      medicamentos,
      examenes,
    };

    pacientes.push(paciente);
    const prioridad = { critico: 1, urgente: 2, moderado: 3, leve: 4 };
    pacientes.sort((a, b) => prioridad[a.gravedad] - prioridad[b.gravedad]);

    if (gravedad === "critico") {
      const criticalAlert = document.getElementById("criticalAlert");
      criticalAlert.classList.remove("d-none");
      setTimeout(() => {
        criticalAlert.classList.add("d-none");
      }, 3000);
    }

    renderTable();
    this.reset();
  });

/* ---------------------------
   RENDERIZAR TABLA Y CONTADORES
--------------------------- */
function renderTable() {
  const tabla = document.getElementById("tablaPacientes");
  tabla.innerHTML = "";

  pacientes.forEach((paciente, index) => {
    let fila = document.createElement("tr");
    let clase = "";
    switch (paciente.gravedad) {
      case "leve":
        clase = "triaje-leve";
        break;
      case "moderado":
        clase = "triaje-moderado";
        break;
      case "urgente":
        clase = "triaje-urgente";
        break;
      case "critico":
        clase = "triaje-critico";
        break;
    }
    fila.className = clase;
    fila.innerHTML = `
      <td>${paciente.nombre}</td>
      <td>${paciente.edad}</td>
      <td>${paciente.genero}</td>
      <td>${paciente.documento}</td>
      <td>${paciente.sintomas}</td>
      <td>${paciente.gravedad.toUpperCase()}</td>
      <td>${paciente.tratamiento}</td>
      <td>${paciente.medicamentos}</td>
      <td>${paciente.examenes}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${index})">
          Eliminar
        </button>
      </td>
    `;
    tabla.appendChild(fila);
  });
  updateCounters();
}

function updateCounters() {
  const countLeve = pacientes.filter((p) => p.gravedad === "leve").length;
  const countModerado = pacientes.filter((p) => p.gravedad === "moderado").length;
  const countUrgente = pacientes.filter((p) => p.gravedad === "urgente").length;
  const countCritico = pacientes.filter((p) => p.gravedad === "critico").length;

  document.getElementById("countLeve").textContent = `Leve: ${countLeve}`;
  document.getElementById("countModerado").textContent = `Moderado: ${countModerado}`;
  document.getElementById("countUrgente").textContent = `Urgente: ${countUrgente}`;
  document.getElementById("countCritico").textContent = `Crítico: ${countCritico}`;
}

function eliminarPaciente(index) {
  pacientes.splice(index, 1);
  renderTable();
}
