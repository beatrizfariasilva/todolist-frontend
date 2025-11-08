
const BASE_URL = "https://api-todolist-846s.onrender.com";

const form = document.getElementById("form-tarefa");
const input = document.getElementById("tarefa");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador");
const filtros = document.querySelectorAll(".filter");

let tarefas = [];
let filtroAtual = "todas";

// Carrega todas as tarefas do backend
async function carregarTarefas() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Erro ao buscar tarefas");
    tarefas = await res.json();
    renderizarTarefas();
  } catch (err) {
    console.error(err);
  }
}

// Cria uma nova tarefa
async function adicionarTarefa(texto) {
  if (!texto.trim()) return;
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: texto, concluida: false })
    });
    if (!res.ok) throw new Error("Erro ao adicionar tarefa");
    const nova = await res.json();
    tarefas.push(nova);
    renderizarTarefas();
    input.value = "";
  } catch (err) {
    console.error(err);
  }
}

// Marca tarefa como concluída ou não
async function alternarConclusao(id, concluida) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluida })
    });
    if (!res.ok) throw new Error("Erro ao atualizar tarefa");
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) tarefa.concluida = concluida;
    renderizarTarefas();
  } catch (err) {
    console.error(err);
  }
}

// Deleta uma tarefa
async function deletarTarefa(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir tarefa");
    tarefas = tarefas.filter(t => t.id !== id);
    renderizarTarefas();
  } catch (err) {
    console.error(err);
  }
}

// Renderiza as tarefas na tela
function renderizarTarefas() {
  lista.innerHTML = "";

  let tarefasFiltradas = tarefas;
  if (filtroAtual === "ativas") {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  } else if (filtroAtual === "concluidas") {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  }

  tarefasFiltradas.forEach(tarefa => {
    const li = document.createElement("li");
    if (tarefa.concluida) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = tarefa.titulo;
    span.addEventListener("click", () => alternarConclusao(tarefa.id, !tarefa.concluida));

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.style.background = "transparent";
    btnExcluir.style.border = "none";
    btnExcluir.style.cursor = "pointer";
    btnExcluir.addEventListener("click", () => deletarTarefa(tarefa.id));

    li.appendChild(span);
    li.appendChild(btnExcluir);
    lista.appendChild(li);
  });

  contador.textContent = `${tarefasFiltradas.length} ${
    tarefasFiltradas.length === 1 ? "tarefa" : "tarefas"
  }`;
}

// Adicionar tarefa
form.addEventListener("submit", e => {
  e.preventDefault();
  adicionarTarefa(input.value);
});

filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filtroAtual = btn.dataset.filter;
    renderizarTarefas();
  });
});

carregarTarefas();
