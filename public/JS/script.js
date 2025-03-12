document.addEventListener("DOMContentLoaded", async () => {
    await carregarRegistros();
  });

  async function carregarRegistros() {
    const response = await fetch('/api/registros');
    const registros = await response.json();
    const tbody = document.getElementById('registrosTable');
    tbody.innerHTML = "";
  
    registros.forEach(registro => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${registro.ID}</td>
        <td><input type="text" value="${registro.Nome}" id="nome-${registro.ID}"></td>
        <td><input type="number" value="${registro.Perfil}" id="perfil-${registro.ID}"></td>
        <td>
          <button onclick="editarRegistro(${registro.ID})">Editar</button>
          <button onclick="excluirRegistro(${registro.ID})">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("addForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const Nome = document.getElementById("Nome").value;
    const Perfil = document.getElementById("Perfil").value;
  
    const response = await fetch("/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Nome, Perfil })
    });
  
    if (response.ok) {
      alert("Registro adicionado com sucesso!");
      carregarRegistros();
      document.getElementById("addForm").reset();
    } else {
      alert("Erro ao adicionar registro.");
    }
  });

  async function editarRegistro(id) {
    const Nome = document.getElementById(`nome-${id}`).value;
    const Perfil = document.getElementById(`perfil-${id}`).value;
  
    const response = await fetch(`/api/registros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Nome, Perfil })
    });
  
    if (response.ok) {
      alert("Registro atualizado com sucesso!");
      carregarRegistros();
    } else {
      alert("Erro ao atualizar registro.");
    }
  }

  async function excluirRegistro(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
  
    const response = await fetch(`/api/registros/${id}`, {
      method: "DELETE"
    });
  
    if (response.ok) {
      alert("Registro excluído com sucesso!");
      carregarRegistros();
    } else {
      alert("Erro ao excluir registro.");
    }
  }