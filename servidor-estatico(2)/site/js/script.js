// Página protegida: sem login volta para login.html
const usuario = Auth.exigirLogin();

const CHAVE = "cafe_cardapio";
const CATEGORIAS = ["Bebida", "Comida", "Doce"];
const PLURAL = { Bebida: "Bebidas", Comida: "Salgados", Doce: "Doces" };
const PADRAO = [
  { id: 1, nome: "Espresso", preco: 6.5, categoria: "Bebida" },
  { id: 2, nome: "Cappuccino", preco: 9.0, categoria: "Bebida" },
  { id: 3, nome: "Latte", preco: 10.0, categoria: "Bebida" },
  { id: 4, nome: "Pão de queijo", preco: 5.0, categoria: "Comida" },
  { id: 5, nome: "Bolo de cenoura", preco: 8.5, categoria: "Doce" },
];

const $ = id => document.getElementById(id);
const real = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ---------- Persistência (localStorage) ----------
let cardapio = carregar();
const pedido = []; // guarda ids dos itens

function carregar() {
  try {
    const json = localStorage.getItem(CHAVE);
    if (json) return JSON.parse(json);
  } catch {}
  return PADRAO.map(i => ({ ...i }));
}

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(cardapio)); } catch {}
}

function proximoId() {
  return cardapio.reduce((m, i) => Math.max(m, i.id), 0) + 1;
}

function aviso(msg, tipo = "ok") {
  $("aviso").textContent = msg;
  $("aviso").className = msg ? tipo : "";
}

// ---------- CRUD ----------
function criar(nome, preco, categoria) {
  cardapio.push({ id: proximoId(), nome, preco, categoria });
}

function atualizar(id, nome, preco, categoria) {
  const item = cardapio.find(i => i.id === id);
  if (item) Object.assign(item, { nome, preco, categoria });
}

function excluir(id) {
  cardapio = cardapio.filter(i => i.id !== id);
  for (let k = pedido.length - 1; k >= 0; k--) if (pedido[k] === id) pedido.splice(k, 1);
}

function lerPreco(texto) {
  const n = Number(texto.trim().replace(",", "."));
  return Number.isFinite(n) && n >= 0 && texto.trim() !== "" ? Math.round(n * 100) / 100 : null;
}

// ---------- Renderização ----------
function linhaItem(nome, preco, extra) {
  const li = document.createElement("li");
  li.className = "linha-item";
  const n = document.createElement("span");
  n.className = "nome";
  n.textContent = nome;
  const p = document.createElement("span");
  p.className = "pontos";
  const v = document.createElement("span");
  v.className = "preco";
  v.textContent = real(preco);
  li.append(n, p, v);
  if (extra) li.appendChild(extra);
  return li;
}

function renderCardapio() {
  const box = $("cardapio");
  box.innerHTML = "";
  if (!cardapio.length) {
    box.innerHTML = '<p class="vazio">Cardápio vazio. Cadastre itens abaixo.</p>';
    return;
  }
  const categorias = [...new Set([...CATEGORIAS, ...cardapio.map(i => i.categoria)])];
  categorias.forEach(cat => {
    const itens = cardapio.filter(i => i.categoria === cat);
    if (!itens.length) return;
    const h = document.createElement("h3");
    h.textContent = PLURAL[cat] || cat;
    const ul = document.createElement("ul");
    itens.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "btn pequeno";
      btn.textContent = "Adicionar";
      btn.onclick = () => { pedido.push(item.id); renderPedido(); };
      ul.appendChild(linhaItem(item.nome, item.preco, btn));
    });
    box.append(h, ul);
  });
}

function renderPedido() {
  const ul = $("pedido");
  ul.innerHTML = "";
  let total = 0;
  pedido.forEach((id, pos) => {
    const item = cardapio.find(i => i.id === id);
    if (!item) return;
    total += item.preco;
    const rem = document.createElement("button");
    rem.className = "btn-texto btn-remover";
    rem.textContent = "✕";
    rem.title = "Remover da comanda";
    rem.onclick = () => { pedido.splice(pos, 1); renderPedido(); };
    ul.appendChild(linhaItem(item.nome, item.preco, rem));
  });
  if (!ul.children.length) ul.innerHTML = '<li class="vazio">Nenhum item na comanda.</li>';
  $("total").textContent = real(total);
}

function renderTabela() {
  const tbody = $("tabela-itens");
  tbody.innerHTML = "";
  if (!cardapio.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="vazio">Nenhum item cadastrado.</td></tr>';
    return;
  }
  cardapio.forEach(item => {
    const tr = document.createElement("tr");
    [item.id, item.nome, item.categoria, real(item.preco)].forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });

    const acoes = document.createElement("td");
    const ed = document.createElement("button");
    ed.textContent = "Editar";
    ed.className = "btn contorno pequeno";
    ed.onclick = () => iniciarEdicao(item);
    const ex = document.createElement("button");
    ex.textContent = "Excluir";
    ex.className = "btn perigo pequeno";
    ex.onclick = () => {
      if (!confirm(`Excluir "${item.nome}" do cardápio?`)) return;
      excluir(item.id);
      salvar();
      if ($("item-id").value === String(item.id)) limparFormulario();
      renderTudo();
      aviso(`"${item.nome}" excluído.`);
    };
    acoes.append(ed, ex);
    tr.appendChild(acoes);
    tbody.appendChild(tr);
  });
}

function renderTudo() {
  renderCardapio();
  renderPedido();
  renderTabela();
}

// ---------- Formulário ----------
function iniciarEdicao(item) {
  $("item-id").value = item.id;
  $("item-nome").value = item.nome;
  $("item-preco").value = String(item.preco).replace(".", ",");
  $("item-categoria").value = item.categoria;
  $("btn-salvar").textContent = "Salvar alterações";
  $("btn-cancelar").hidden = false;
  $("item-nome").focus();
  aviso("");
}

function limparFormulario() {
  $("form-item").reset();
  $("item-id").value = "";
  $("btn-salvar").textContent = "Cadastrar item";
  $("btn-cancelar").hidden = true;
}

$("form-item").addEventListener("submit", e => {
  e.preventDefault();
  const nome = $("item-nome").value.trim();
  const preco = lerPreco($("item-preco").value);
  const categoria = $("item-categoria").value;

  if (!nome) return aviso("Informe o nome do item.", "erro");
  if (preco === null) return aviso("Preço inválido. Use um número, por exemplo 7,50.", "erro");

  const id = $("item-id").value;
  if (id) {
    atualizar(Number(id), nome, preco, categoria);
    aviso(`"${nome}" atualizado.`);
  } else {
    criar(nome, preco, categoria);
    aviso(`"${nome}" cadastrado.`);
  }
  salvar();
  limparFormulario();
  renderTudo();
});

$("btn-cancelar").onclick = () => { limparFormulario(); aviso(""); };
$("limpar").onclick = () => { pedido.length = 0; renderPedido(); };
$("sair").onclick = () => Auth.sair();

// ---------- Início ----------
if (usuario) {
  $("nome-usuario").textContent = usuario;
  renderTudo();
}
