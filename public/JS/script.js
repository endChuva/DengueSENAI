document.addEventListener("DOMContentLoaded", async () => {
  await carregarUsuarios();
});

async function carregarUsuarios() {
  const response = await fetch('/api/users');
  const usuarios = await response.json();
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = "";

  usuarios.forEach(usuario => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${usuario.ID}</td>
      <td><input type="text" value="${usuario.User}" id="user-${usuario.ID}"></td>
      <td><input type="password" value="${usuario.Senha}" id="senha-${usuario.ID}"></td>
      <td><input type="number" value="${usuario.Perfil}" id="perfil-${usuario.ID}"></td>
      <td>
        <button onclick="editarUsuario(${usuario.ID})">Editar</button>
        <button onclick="excluirUsuario(${usuario.ID})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("addForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const User = document.getElementById("User").value;
  const Senha = document.getElementById("Senha").value;
  const Perfil = document.getElementById("Perfil").value;

  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ User, Senha, Perfil })
  });

  if (response.ok) {
    alert("Usuário adicionado com sucesso!");
    carregarUsuarios();
    document.getElementById("addForm").reset();
  } else {
    alert("Erro ao adicionar usuário.");
  }
});

// Função para editar o usuário
async function editarUsuario(id) {
  const User = document.getElementById(`user-${id}`).value;
  const Senha = document.getElementById(`senha-${id}`).value;
  const Perfil = document.getElementById(`perfil-${id}`).value;

  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ User, Senha, Perfil })
  });

  if (response.ok) {
    alert("Usuário atualizado com sucesso!");
    carregarUsuarios();
  } else {
    alert("Erro ao atualizar usuário.");
  }
}

// Função para excluir o usuário
async function excluirUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    alert("Usuário excluído com sucesso!");
    carregarUsuarios();
  } else {
    alert("Erro ao excluir usuário.");
  }
}
