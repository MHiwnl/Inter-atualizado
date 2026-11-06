/* ---------- LAYOUT ---------- */
const NAV=[['home','Início'],['servicos','Serviços'],['como-funciona','Como Funciona'],['profissionais','Para Profissionais'],['sobre','Quem Somos'],['planos','Planos']];
function themeBtn(){
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  return '<button class="icon-btn" onclick="toggleTheme()" title="Alternar tema">'+ic(dark?'sun':'moon')+'</button>';
}
function bellBtn(){
  const unreadCount=me()?myNotifs().filter(n=>!n.read).length:0;
  return '<a class="icon-btn" href="#/painel/notificacoes" title="Notifica\u00e7\u00f5es" aria-label="Notifica\u00e7\u00f5es, '+unreadCount+' n\u00e3o lidas" style="position:relative">'+ic('bell')+(unreadCount?'<span style="position:absolute;top:-4px;right:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:var(--danger);color:#fff;font-size:10px;font-weight:800;display:grid;place-items:center">'+(unreadCount>9?'9+':unreadCount)+'</span>':'')+'</a>';
}
/* Botões globais do painel: fazem parte do dash, em todas as telas dele. */
function dashTools(){return '<div class="dash-tools">'+themeBtn()+bellBtn()+'</div>';}
function header(){
  /* O painel não usa a barra do site. */
  if(route.page==='painel')return '';
  const u=me();
  const links=NAV.map(([p,l])=>'<a href="#/'+p+'" class="'+(route.page===p?'active':'')+'">'+l+'</a>').join('');
  return '<header class="site"><div class="wrap"><nav class="nav">'+
    '<a href="#/home" class="logo"><span class="lt">Task<b>GO</b></span></a>'+
    '<div class="nav-links">'+links+'</div>'+
    '<div class="nav-right">'+
      themeBtn()+
      (u
        ? bellBtn()+
          '<a class="btn btn-ghost btn-sm" href="#/painel">'+avatar(u,22)+' Painel</a>'
        : '<a class="btn btn-ghost btn-sm" href="#/entrar">'+ic('user')+' Entrar</a>'+
          '<a class="btn btn-primary btn-sm" href="#/servicos">Explorar serviços '+ic('arrow')+'</a>')+
      '<button class="icon-btn burger" onclick="toggleMenu()">'+ic('menu')+'</button>'+
    '</div></nav></div></header>'+
    '<div class="mobile-nav" id="mnav">'+NAV.map(([p,l])=>'<a href="#/'+p+'" onclick="toggleMenu()">'+l+'</a>').join('')+
      '<a href="#/servicos" onclick="toggleMenu()">Explorar serviços</a>'+
      (u?'<a href="#/painel" onclick="toggleMenu()">Meu painel</a>':'<a href="#/entrar" onclick="toggleMenu()">Entrar / Criar conta</a>')+
      '<a href="#/contato" onclick="toggleMenu()">Contato</a></div>';
}
function toggleMenu(){const m=$('#mnav');if(m)m.classList.toggle('open');}

function footer(){
  return '<footer class="site"><div class="wrap">'+
  '<div class="foot-grid">'+
    '<div class="foot-brand"><a href="#/home" class="logo"><span class="lt">Task<b>GO</b></span></a>'+
      '<p class="muted" style="margin-top:14px;font-size:.9rem;max-width:330px">Somos um MVP em desenvolvimento para aproximar clientes e profissionais locais. A plataforma ainda não está aberta para contratação.</p>'+
      '<div class="socials" style="margin-top:20px">'+
        '<a href="#/contato">'+ic('ig')+'</a><a href="#/contato">'+ic('fb')+'</a><a href="#/contato">'+ic('li')+'</a><a href="#/contato">'+ic('wa')+'</a></div></div>'+
    '<div><h4>Serviços</h4><div class="foot-links">'+SERVICES.slice(0,6).map(s=>'<a href="#/servicos/'+s.id+'">'+s.n+'</a>').join('')+'</div></div>'+
    '<div><h4>Empresa</h4><div class="foot-links">'+
      '<a href="#/sobre">Quem somos</a><a href="#/como-funciona">Como funciona</a><a href="#/profissionais">Seja um profissional</a><a href="#/planos">Planos</a><a href="#/seguranca">Segurança</a><a href="#/contato">Contato</a></div></div>'+
    '<div><h4>Suporte</h4><div class="foot-links">'+
      '<a href="#/ajuda">Central de ajuda</a><a href="#/ajuda">Perguntas frequentes</a><a href="#/legal/termos">Termos de uso</a><a href="#/legal/privacidade">Privacidade</a><a href="#/legal/cancelamento">Cancelamento</a></div></div>'+
  '</div>'+
  '<div class="foot-bottom"><span>© '+new Date().getFullYear()+' TaskGO Tecnologia Ltda · CNPJ 00.000.000/0001-00 · Recife/PE</span>'+
  '<span style="display:flex;gap:16px;align-items:center">'+ic('shield')+' Pagamento protegido · PIX, cartão e boleto</span></div>'+
  '</div></footer>';
}

