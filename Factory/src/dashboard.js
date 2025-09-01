import { jogos as jogosMock } from "./mocks/jogos.js";
const $id = id => document.getElementById(id);
function fecharTodosModais() {
  const modais = document.querySelectorAll('.modal, .modal-editar');
  modais.forEach(m => m.style.display = 'none');
}

let jogos = [...jogosMock];
async function carregarJogos(filtros = {}) {
  try {
    let lista = [...jogos];
    if (filtros.buscaNome) {
      lista = lista.filter(j =>
        j.nome.toLowerCase().includes(filtros.buscaNome.toLowerCase())
      );
    }
    if (filtros.genero) {
      lista = lista.filter(j => j.genero === filtros.genero);
    }
    if (filtros.classificacao) {
      lista = lista.filter(j => j.classificacao === filtros.classificacao);
    }
    if (filtros.modoJogo) {
      lista = lista.filter(j => j.modo_jogo === filtros.modoJogo);
    }
    if (filtros.status) {
      lista = lista.filter(j => j.status === filtros.status);
    }

    const gamesGrid = $id('gamesGrid');
    gamesGrid.innerHTML = '';

    if (!Array.isArray(lista) || lista.length === 0) {
      gamesGrid.innerHTML = `<div class="aviso">Nenhum jogo encontrado</div>`;
      return;
    }
    const modoDelete = document.body.classList.contains('deletar-active');
    const modoEditar = document.body.classList.contains('editar-active');

    lista.forEach(jogo => {
      let imgSrc = jogo.imagem_capa ? jogo.imagem_capa.replace(/\\/g, '/') : '';
      if (imgSrc && !imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
        imgSrc = '/Factory/public/' + imgSrc;
      }
      if (!imgSrc) imgSrc = '/Factory/public/images/default.jpg';

      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `
        <img src="${imgSrc}" alt="${jogo.nome}" class="game-image">
        <div class="game-info">
          <h3 class="game-title">${jogo.nome}</h3>
        </div>
      `;

      if (modoDelete) {
        const btnDeletar = document.createElement('button');
        btnDeletar.className = 'deletar-btn';
        btnDeletar.type = 'button';
        btnDeletar.innerHTML = '🗑️ Deletar';
        btnDeletar.onclick = e => {
          e.stopPropagation();
          deletarJogo(jogo.id);
        };
        card.querySelector('.game-info').appendChild(btnDeletar);
      }

      if (modoEditar) {
        const btnEditar = document.createElement('button');
        btnEditar.className = 'editar-btn';
        btnEditar.type = 'button';
        btnEditar.innerHTML = '✏️ Editar';
        btnEditar.onclick = e => {
          e.stopPropagation();
          abrirModalEditarJogo(jogo);
        };
        card.querySelector('.game-info').appendChild(btnEditar);
      }

      gamesGrid.appendChild(card);
    });
  } catch (erro) {
    const gamesGrid = $id('gamesGrid');
    if (gamesGrid) {
      gamesGrid.innerHTML = `
        <div class="aviso erro">
          Erro ao carregar jogos mockados.<br>
          <small>${erro.message}</small>
        </div>
      `;
    }
  }
}
window.carregarJogos = carregarJogos;

function aplicarFiltros() {
  const filtroForm = $id('filtroForm');
  const filtros = {};
  if (filtroForm.buscaNome && filtroForm.buscaNome.value.trim()) filtros.buscaNome = filtroForm.buscaNome.value.trim();
  if (filtroForm.genero && filtroForm.genero.value) filtros.genero = filtroForm.genero.value;
  if (filtroForm.classificacao && filtroForm.classificacao.value) filtros.classificacao = filtroForm.classificacao.value;
  if (filtroForm.modoJogo && filtroForm.modoJogo.value) filtros.modoJogo = filtroForm.modoJogo.value;
  if (filtroForm.status && filtroForm.status.value) filtros.status = filtroForm.status.value;

  carregarJogos(filtros);
}

document.addEventListener('DOMContentLoaded', () => {
  const filtroForm = $id('filtroForm');
  if (filtroForm) {
    ['genero', 'classificacao', 'modoJogo', 'status'].forEach(campo => {
      if (filtroForm[campo]) {
        filtroForm[campo].addEventListener('change', aplicarFiltros);
      }
    });
    const buscaInput = document.getElementById('filtroNome');
    if (buscaInput) {
      buscaInput.addEventListener('input', aplicarFiltros);
    }
    if (filtroForm.nome) {
      filtroForm.nome.addEventListener('input', aplicarFiltros);
    }
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const modalCadastro = $id('modalCadastrarJogo') || document.querySelector('.modal');
  const closeBtn = modalCadastro && modalCadastro.querySelector('.close-modal');
  const inserirForm = $id('inserirJogoForm');

  if (menuBtn && modalCadastro && closeBtn) {
    menuBtn.addEventListener('click', () => modalCadastro.style.display = 'flex');
    closeBtn.addEventListener('click', () => modalCadastro.style.display = 'none');
    window.addEventListener('click', function (event) {
      if (event.target === modalCadastro) {
        modalCadastro.style.display = 'none';
      }
    });
  }
  if (inserirForm) {
    inserirForm.onsubmit = e => {
      e.preventDefault();
      inserirJogo();
    }
  }
});

async function inserirJogo() {
  const form = $id('inserirJogoForm');
  if (!form) { alert('Formulário de cadastro não encontrado'); return; }
  const formData = new FormData(form);

  const novo = Object.fromEntries(formData.entries());
  novo.id = jogos.length ? Math.max(...jogos.map(j => j.id)) + 1 : 1;

  jogos.push(novo);

  alert('Jogo inserido com sucesso (mock)!');
  form.reset();
  fecharTodosModais();
  carregarJogos();
}
window.inserirJogo = inserirJogo;

async function deletarJogo(id) {
  if (!confirm("Tem certeza de que deseja deletar este jogo?")) return;

  jogos = jogos.filter(j => j.id !== id);

  alert('Jogo deletado com sucesso (mock)!');
  carregarJogos();
}
window.deletarJogo = deletarJogo;


async function editarJogo() {
  const form = $id('editarJogoForm');
  if (!form) { alert('Formulário de edição não encontrado.'); return; }
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData.entries());

  if (!confirm("Tem certeza de que deseja salvar as alterações deste jogo?")) return;

  jogos = jogos.map(j => j.id == dados.id ? { ...j, ...dados } : j);

  alert('Jogo editado com sucesso (mock)!');
  fecharTodosModais();
  carregarJogos();
}
window.editarJogo = editarJogo;


function abrirModalEditarJogo(jogo) {
  const modal = $id('modalEditarJogo');
  if (!modal) { alert('Modal de edição não encontrado!'); return; }
  modal.style.display = 'flex';

  if ($id('edit_id')) $id('edit_id').value = jogo.id || "";
  ['nome', 'descricao', 'desenvolvedor', 'data_lancamento', 'genero',
    'imagem_capa', 'site_oficial', 'classificacao', 'modo_jogo', 'status'
  ].forEach(campo => {
    const input = $id(`edit_${campo}`);
    if (input) input.value = jogo[campo] || "";
  });
}
window.abrirModalEditarJogo = abrirModalEditarJogo;

document.addEventListener('DOMContentLoaded', () => {
  const fecharBtn = document.getElementById('fecharModalEditar');
  const modalEditar = document.getElementById('modalEditarJogo');
  if (fecharBtn && modalEditar) {
    fecharBtn.addEventListener('click', function () {
      modalEditar.style.display = 'none';
    });
    window.addEventListener('click', function (event) {
      if (event.target === modalEditar) {
        modalEditar.style.display = 'none';
      }
    });
  }

  const btnAtivarDeletar = document.getElementById('ativarModoDeletarBtn');
  const btnCancelarDeletar = document.getElementById('cancelarModoDeletarBtn');
  if (btnAtivarDeletar && btnCancelarDeletar) {
    btnAtivarDeletar.addEventListener('click', function () {
      document.body.classList.add('deletar-active');
      btnAtivarDeletar.style.display = 'none';
      btnCancelarDeletar.style.display = '';
      carregarJogos();
    });
    btnCancelarDeletar.addEventListener('click', function () {
      document.body.classList.remove('deletar-active');
      btnAtivarDeletar.style.display = '';
      btnCancelarDeletar.style.display = 'none';
      carregarJogos();
    });
    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('deletar-active') && e.key === 'Escape') {
        btnCancelarDeletar.click();
      }
    });
  }

  const btnEditarJogos = document.getElementById('btnEditarJogos');
  const btnCancelarEditar = document.getElementById('cancelarModoEditarBtn');
  if (btnEditarJogos && btnCancelarEditar) {
    btnEditarJogos.addEventListener('click', function () {
      document.body.classList.add('editar-active');
      btnEditarJogos.style.display = 'none';
      btnCancelarEditar.style.display = '';
      carregarJogos();
    });
    btnCancelarEditar.addEventListener('click', function () {
      document.body.classList.remove('editar-active');
      btnEditarJogos.style.display = '';
      btnCancelarEditar.style.display = 'none';
      carregarJogos();
    });
    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('editar-active') && e.key === 'Escape') {
        btnCancelarEditar.click();
      }
    });
  }

  carregarJogos();
});
