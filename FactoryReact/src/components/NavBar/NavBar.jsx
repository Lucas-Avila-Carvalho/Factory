import './navbar.css'

const NavBar = () => {
  return <><nav className="header-nav">
    <button className="nav-btn">Config ⚙️</button>
    <button className="nav-btn">Jogos 🎮</button>
    <button className="nav-btn">Mods 📦</button>
    <button className="nav-btn">Mídia 📺</button>
    <button className="nav-btn">Comunidade 👥</button>
    <button className="nav-btn">Ajuda ❓</button>
    <div className="search-container">
      <input type="text" className="search-input" placeholder="Pesquisa" />
      <button className="nav-btn" onclick="jaCadastrado()">Logar</button>
      <button className="nav-btn" onclick="cadastro()">Cadastro</button>
    </div>
    <button className="nav-btn menu-btn">Adicionar Jogo +</button>
  </nav>
  </>    
}

export default NavBar