import './style.css'
import "./dashboard.js"

document.querySelector('#app').innerHTML = `
  <nav class="header-nav">
    <button class="nav-btn">Config ⚙️</button>
    <button class="nav-btn">Jogos 🎮</button>
    <button class="nav-btn">Mods 📦</button>
    <button class="nav-btn">Mídia 📺</button>
    <button class="nav-btn">Comunidade 👥</button>
    <button class="nav-btn">Ajuda ❓</button>
    <div class="search-container">
      <input type="text" class="search-input" placeholder="Pesquisa">
      <button class="nav-btn" onclick="jaCadastrado()">Logar</button>
      <button class="nav-btn" onclick="cadastro()">Cadastro</button>
    </div>
    <button class="nav-btn menu-btn">Adicionar Jogo +</button>
  </nav>

  <!-- Main Header -->
  <header class="main-header">
    <h1>Factory</h1>
    <p>Nós hospedamos 610.982 mods para 3.109 jogos de 140.862 autores...</p>
    <button class="ranking-btn">Ranking</button>
  </header>

  <!-- Filtros -->
  <div class="form-section">
    <h2>Filtros</h2>
    <form id="filtroForm">
      <!-- Gênero -->
      <div class="form-group select-group">
        <label for="filtroNome">Procurar por nome:</label>
        <input id="filtroNome" name="buscaNome" type="text" placeholder="Digite para buscar...">
        <label for="filtroGenero">Gênero:</label>
        <select id="filtroGenero" name="genero">
          <option value="">-- Todos --</option>
          <option value="Ação">Ação</option>
          <option value="Aventura">Aventura</option>
          <option value="RPG">RPG</option>
          <option value="Estratégia">Estratégia</option>
          <option value="Puzzle">Puzzle</option>
          <option value="Simulação">Simulação</option>
          <option value="Corrida">Corrida</option>
          <option value="Esporte">Esporte</option>
          <option value="Terror">Terror</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      <!-- Classificação -->
      <div class="form-group select-group">
        <label for="filtroClassificacao">Classificação:</label>
        <select id="filtroClassificacao" name="classificacao">
          <option value="">-- Todas --</option>
          <option value="Livre">Livre</option>
          <option value="10+">10+</option>
          <option value="12+">12+</option>
          <option value="14+">14+</option>
          <option value="16+">16+</option>
          <option value="18+">18+</option>
        </select>
      </div>
      <!-- Modo de Jogo -->
      <div class="form-group select-group">
        <label for="filtroModoJogo">Modo de Jogo:</label>
        <select id="filtroModoJogo" name="modo_jogo">
          <option value="">-- Todos --</option>
          <option value="Singleplayer">Singleplayer</option>
          <option value="Multiplayer">Multiplayer</option>
          <option value="Co-op">Co-op</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>
      <!-- Status -->
      <div class="form-group select-group">
        <label for="filtroStatus">Status:</label>
        <select id="filtroStatus" name="status">
          <option value="">-- Todos --</option>
          <option value="Em desenvolvimento">Em desenvolvimento</option>
          <option value="Lançado">Lançado</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Atualização futura">Atualização futura</option>
        </select>
      </div>
    </form>
  </div>

  <!-- Games Grid -->
  <div class="games-grid" id="gamesGrid"></div>

  <!-- Footer Section -->
  <footer class="footer-section">
    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
      <div class="footer-title">Todos os jogos</div>
      <button class="nav-btn" id="btnEditarJogos">✏️ Editar Jogos</button>
      <button class="nav-btn" id="cancelarModoEditarBtn" style="display:none;">Cancelar Editar</button>
      <button class="nav-btn danger-btn" id="ativarModoDeletarBtn" title="Modo Deletar">
        🗑️ Deletar Jogos
      </button>
      <button class="nav-btn" id="cancelarModoDeletarBtn" style="display:none;" title="Cancelar Deleção">
        Cancelar
      </button>
    </div>
  </footer>

  <!-- Modal de Cadastro -->
  <div class="modal" id="modalCadastrarJogo">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="form-section">
        <h2>Cadastrar Jogo</h2>
        <form id="inserirJogoForm" enctype="multipart/form-data">
          <div class="form-group">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>
          </div>
          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <textarea id="descricao" name="descricao"></textarea>
          </div>
          <div class="form-group">
            <label for="desenvolvedor">Desenvolvedor:</label>
            <input type="text" id="desenvolvedor" name="desenvolvedor">
          </div>
          <div class="form-group">
            <label for="data_lancamento">Data de Lançamento:</label>
            <input type="date" id="data_lancamento" name="data_lancamento">
          </div>
          <div class="form-group select-group">
            <label for="genero">Gênero:</label>
            <select id="genero" name="genero" required>
              <option value="">Selecione...</option>
              <option>Ação</option>
              <option>Aventura</option>
              <option>RPG</option>
              <option>Estratégia</option>
              <option>Puzzle</option>
              <option>Simulação</option>
              <option>Corrida</option>
              <option>Esporte</option>
              <option>Terror</option>
              <option>Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="imagem_capa">Imagem de Capa:</label>
            <input type="file" id="imagem_capa" name="imagem_capa" accept="image/*">
          </div>
          <div class="form-group">
            <label for="site_oficial">Site Oficial:</label>
            <input type="url" id="site_oficial" name="site_oficial">
          </div>
          <div class="form-group select-group">
            <label for="classificacao">Classificação:</label>
            <select id="classificacao" name="classificacao" required>
              <option value="">Selecione...</option>
              <option>Livre</option>
              <option>10+</option>
              <option>12+</option>
              <option>14+</option>
              <option>16+</option>
              <option>18+</option>
            </select>
          </div>
          <div class="form-group select-group">
            <label for="modo_jogo">Modo de Jogo:</label>
            <select id="modo_jogo" name="modo_jogo" required>
              <option value="">Selecione...</option>
              <option>Singleplayer</option>
              <option>Multiplayer</option>
              <option>Co-op</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
          </div>
          <div class="form-group select-group">
            <label for="status">Status:</label>
            <select id="status" name="status" required>
              <option value="">Selecione...</option>
              <option>Em desenvolvimento</option>
              <option>Lançado</option>
              <option>Cancelado</option>
              <option>Atualização futura</option>
            </select>
          </div>
          <button type="button" class="btn-primary" onclick="inserirJogo()">Inserir Jogo</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal de Edição -->
  <div class="modal" id="modalEditarJogo" style="display:none;">
    <div class="modal-content">
      <span id="fecharModalEditar" class="close-modal">&times;</span>
      <div class="form-section">
        <h2>Editar Jogo</h2>
        <form id="editarJogoForm" enctype="multipart/form-data">
          <!-- Campo oculto para id -->
          <input type="hidden" id="edit_id" name="id">
          <div class="form-group">
            <label for="edit_nome">Nome:</label>
            <input type="text" id="edit_nome" name="nome" required>
          </div>
          <div class="form-group">
            <label for="edit_descricao">Descrição:</label>
            <textarea id="edit_descricao" name="descricao"></textarea>
          </div>
          <div class="form-group">
            <label for="edit_desenvolvedor">Desenvolvedor:</label>
            <input type="text" id="edit_desenvolvedor" name="desenvolvedor">
          </div>
          <div class="form-group">
            <label for="edit_data_lancamento">Data de Lançamento:</label>
            <input type="date" id="edit_data_lancamento" name="data_lancamento">
          </div>
          <div class="form-group select-group">
            <label for="edit_genero">Gênero:</label>
            <select id="edit_genero" name="genero" required>
              <option value="">Selecione...</option>
              <option>Ação</option>
              <option>Aventura</option>
              <option>RPG</option>
              <option>Estratégia</option>
              <option>Puzzle</option>
              <option>Simulação</option>
              <option>Corrida</option>
              <option>Esporte</option>
              <option>Terror</option>
              <option>Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="edit_imagem_capa">Imagem de Capa:</label>
            <input type="file" id="edit_imagem_capa" name="imagem_capa" accept="image/*">
            <input type="hidden" id="edit_imagem_capa_atual" name="imagem_capa_atual">
            <img id="preview_imagem_atual" src="" alt="Capa atual" style="width:90px; margin-top:10px;">
          </div>
          <div class="form-group">
            <label for="edit_site_oficial">Site Oficial:</label>
            <input type="url" id="edit_site_oficial" name="site_oficial">
          </div>
          <div class="form-group select-group">
            <label for="edit_classificacao">Classificação:</label>
            <select id="edit_classificacao" name="classificacao" required>
              <option value="">Selecione...</option>
              <option>Livre</option>
              <option>10+</option>
              <option>12+</option>
              <option>14+</option>
              <option>16+</option>
              <option>18+</option>
            </select>
          </div>
          <div class="form-group select-group">
            <label for="edit_modo_jogo">Modo de Jogo:</label>
            <select id="edit_modo_jogo" name="modo_jogo" required>
              <option value="">Selecione...</option>
              <option>Singleplayer</option>
              <option>Multiplayer</option>
              <option>Co-op</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
          </div>
          <div class="form-group select-group">
            <label for="edit_status">Status:</label>
            <select id="edit_status" name="status" required>
              <option value="">Selecione...</option>
              <option>Em desenvolvimento</option>
              <option>Lançado</option>
              <option>Cancelado</option>
              <option>Atualização futura</option>
            </select>
          </div>
          <button type="button" class="btn-primary" onclick="editarJogo()">Salvar Alterações</button>
        </form>
      </div>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
