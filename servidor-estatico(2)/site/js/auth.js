// Autenticação simples no navegador (apenas para fins didáticos:
// em um sistema real a validação precisa acontecer em um servidor/back-end).

const Auth = (() => {
  const CHAVE = "cafe_usuario";
  const USUARIOS = [
    { usuario: "admin", senha: "1234" },
    { usuario: "atendente", senha: "cafe" },
  ];
  let memoria = null; // fallback se o sessionStorage estiver bloqueado

  function usuarioAtual() {
    try { return sessionStorage.getItem(CHAVE) || memoria; }
    catch { return memoria; }
  }

  function entrar(usuario, senha) {
    const u = USUARIOS.find(x => x.usuario === usuario.trim().toLowerCase() && x.senha === senha);
    if (!u) return false;
    memoria = u.usuario;
    try { sessionStorage.setItem(CHAVE, u.usuario); } catch {}
    return true;
  }

  function sair() {
    memoria = null;
    try { sessionStorage.removeItem(CHAVE); } catch {}
    location.replace("login.html");
  }

  // Chame nas páginas protegidas
  function exigirLogin() {
    const u = usuarioAtual();
    if (!u) { location.replace("login.html"); return null; }
    return u;
  }

  return { usuarioAtual, entrar, sair, exigirLogin };
})();
