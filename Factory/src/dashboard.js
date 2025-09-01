// ======================= UTILITÁRIOS ========================

// Helper para obter elemento por ID (DRY)
const $id = id => document.getElementById(id);

// Helper para fechar todos modais conhecidos
function fecharTodosModais() {
  const modais = document.querySelectorAll('.modal, .modal-editar');
  modais.forEach(m => m.style.display = 'none');
}

// ==================== CARREGAR JOGOS =========================

async function carregarJogos(filtros = {}) {
  try {
    const params = new URLSearchParams(filtros).toString();
    const url = `/Factory/api/listar_jogos.php${params ? '?' + params : ''}`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
      const textoErro = await resposta.text();
      console.error('Resposta com erro:', resposta.status, textoErro);
      throw new Error('Erro ao carregar dados da API');
    }

    const jogos = await resposta.json();
    const gamesGrid = $id('gamesGrid');
    gamesGrid.innerHTML = '';

    if (!Array.isArray(jogos) || jogos.length === 0) {
      gamesGrid.innerHTML = `<div class="aviso">Nenhum jogo encontrado</div>`;
      return;
    }

    // Estado dos botões globais de editar/deletar
    const modoDelete = document.body.classList.contains('deletar-active');
    const modoEditar = document.body.classList.contains('editar-active');

    jogos.forEach(jogo => {
      let imgSrc = jogo.imagemCapa ? jogo.imagemCapa.replace(/\\/g, '/') : '';
      imgSrc = imgSrc.replace(/^\/?Factory\/public\//i, '').replace(/^\\?Factory\\public\\/, '');
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

      // Só exibe os botões se o modo correspondente estiver ativado (por classe no body)
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
          Erro ao carregar jogos do banco.<br>
          <small>${erro.message}</small>
        </div>
      `;
    }
  }
}
window.carregarJogos = carregarJogos;

// ===================== FILTROS ===========================

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
    // reativo para selects
    ['genero', 'classificacao', 'modoJogo', 'status'].forEach(campo => {
      if (filtroForm[campo]) {
        filtroForm[campo].addEventListener('change', aplicarFiltros);
      }
    });
    const buscaInput = document.getElementById('filtroNome');
    if (buscaInput) {
      buscaInput.addEventListener('input', aplicarFiltros);
    }
    // reativo para nome, a cada letra
    if (filtroForm.nome) {
      filtroForm.nome.addEventListener('input', aplicarFiltros);
    }
  }
});

// ============ MODAL DE CADASTRO (NOVO JOGO) ===========

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

// ============ INSERIR NOVO JOGO ================

async function inserirJogo() {
  const form = $id('inserirJogoForm');
  if (!form) { alert('Formulário de cadastro não encontrado'); return; }
  const formData = new FormData(form);

  try {
    const response = await fetch('/Factory/api/inserir_jogo.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      alert('Jogo inserido com sucesso!');
      form.reset();
      fecharTodosModais();
      carregarJogos();
    } else {
      alert('Erro ao inserir jogo: ' + (data.erro || 'Tente novamente.'));
    }

  } catch (error) {
    alert('Erro na comunicação com o servidor: ' + error);
  }
}
window.inserirJogo = inserirJogo;

// ============== DELETAR JOGO ===================

async function deletarJogo(id) {
  if (!confirm("Tem certeza de que deseja deletar este jogo?")) return;
  try {
    const resposta = await fetch(`/Factory/api/deletar_jogo.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const data = await resposta.json();
    if (data.success) {
      alert('Jogo deletado com sucesso!');
      carregarJogos();
    } else {
      alert('Erro ao deletar jogo: ' + (data.erro || 'Tente novamente.'));
    }
  } catch (error) {
    alert('Erro na comunicação com o servidor: ' + error);
  }
}
window.deletarJogo = deletarJogo;

// ================ EDITAR JOGO ================

async function editarJogo() {
  const form = $id('editarJogoForm');
  if (!form) { alert('Formulário de edição não encontrado.'); return; }
  const formData = new FormData(form);

  if (!confirm("Tem certeza de que deseja salvar as alterações deste jogo?")) return;

  try {
    const response = await fetch('/Factory/api/editar_jogo.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      alert('Jogo editado com sucesso!');
      fecharTodosModais();
      carregarJogos();
    } else {
      alert('Erro ao editar jogo: ' + (data.erro || 'Erro desconhecido.'));
    }
  } catch (error) {
    alert('Erro na comunicação com o servidor: ' + error);
  }
}
window.editarJogo = editarJogo;

// ============== MODAL DE EDIÇÃO (ABRIR E FECHAR) =============

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

  // ============== MODO DELETAR E EDITAR GRID =============
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
    // ESC cancela modo deletar
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
    // ESC cancela modo editar
    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('editar-active') && e.key === 'Escape') {
        btnCancelarEditar.click();
      }
    });
  }

  // ============== INICIALIZAÇÃO =============
  carregarJogos();
});
