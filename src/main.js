import "./index.css";
import { materiais as materiaisIniciais } from "./data.js";

const conteudo = document.querySelector("#conteudo");
const materiais = [...materiaisIniciais];

function modelo(seletor) {
  return document.querySelector(seletor).content.cloneNode(true);
}

function preencherCampo(raiz, campo, valor) {
  if (!valor) return;
  raiz.querySelector(`[data-field="${campo}"]`).textContent = valor;
}

function preencherCapa(raiz, material) {
  if (!material.imagem_capa) return;

  const img = raiz.querySelector('[data-field="imagem"]');
  img.src = material.imagem_capa;
  img.alt = material.titulo || "";
  img.hidden = false;
  raiz.querySelector('[data-field="placeholder"]').hidden = true;
}

function preencherMaterial(raiz, material) {
  preencherCapa(raiz, material);
  preencherCampo(raiz, "tipo", material.tipo);
  preencherCampo(raiz, "titulo", material.titulo);
  preencherCampo(raiz, "autor", material.autor);
  preencherCampo(raiz, "categoria", material.categoria);
  preencherCampo(raiz, "descricao", material.descricao);
}

//Página inicial

function criarCard(material) {
  const card = modelo("#tpl-card-material");
  preencherMaterial(card, material);
  card.querySelector('[data-field="link"]').href =
    `/material/${material.id_material}`;
  return card;
}

function mostrarMateriais(lista) {
  const areaLista = conteudo.querySelector("#listaMateriais");
  areaLista.innerHTML = "";

  if (lista.length === 0) {
    areaLista.appendChild(modelo("#tpl-sem-resultados"));
    return;
  }

  const grid = document.createElement("section");
  grid.className = "grade-biblioteca";
  grid.setAttribute("aria-label", "Lista de materiais");
  lista.forEach((material) => grid.appendChild(criarCard(material)));
  areaLista.appendChild(grid);
}

function filtrarMateriais() {
  const busca = conteudo
    .querySelector("#campoBusca")
    .value.toLowerCase()
    .trim();

  const resultado = materiais.filter((m) =>
    [m.titulo, m.autor, m.categoria].some((campo) =>
      campo?.toLowerCase().includes(busca),
    ),
  );

  mostrarMateriais(resultado);
}

function mostrarHome() {
  conteudo.replaceChildren(modelo("#tpl-inicio"));

  conteudo.querySelector('[data-field="total"]').textContent = materiais.length;
  mostrarMateriais(materiais);

  conteudo
    .querySelector("#campoBusca")
    .addEventListener("input", filtrarMateriais);
  conteudo.querySelector("#formBusca").addEventListener("submit", (evento) => {
    evento.preventDefault();
    filtrarMateriais();
  });

  if (window.location.hash === "#materiais") {
    conteudo.querySelector("#materiais").scrollIntoView({ behavior: "smooth" });
  }
}

//Detalhes de um material

function mostrarErro(mensagem) {
  const pagina = modelo("#tpl-erro");
  pagina.querySelector('[data-field="mensagem"]').textContent = mensagem;
  conteudo.replaceChildren(pagina);
}

function mostrarDetalhes(id) {
  const material = materiais.find((m) => String(m.id_material) === String(id));

  if (!material) {
    mostrarErro("Material não encontrado");
    return;
  }

  const pagina = modelo("#tpl-detalhes");
  preencherMaterial(pagina, material);
  pagina.querySelector('[data-field="link"]').href =
    material.link_conteudo || "#";

  conteudo.replaceChildren(pagina);
}

function iniciarSite() {
  const caminho = window.location.pathname;

  if (caminho.startsWith("/material/"))
    return mostrarDetalhes(caminho.split("/").pop());

  mostrarHome();
}

iniciarSite();
