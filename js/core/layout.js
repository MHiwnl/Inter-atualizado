/* ---------- LAYOUT ---------- */
const NAV=[['home','Início'],['servicos','Serviços'],['como-funciona','Como Funciona'],['profissionais','Para Profissionais'],['sobre','Quem Somos'],['planos','Planos']];
function themeBtn(){
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  const rotulo=dark?'Usar tema claro':'Usar tema escuro';
  return '<button class="icon-btn" data-fk="tema" onclick="toggleTheme()" title="'+rotulo+'" aria-label="'+rotulo+'">'+ic(dark?'sun':'moon')+'</button>';
}
function bellBtn(){
  const unreadCount=me()?myNotifs().filter(n=>!n.read).length:0;
  return '<a class="icon-btn" href="#/painel/notificacoes" title="Notifica\u00e7\u00f5es" aria-label="Notifica\u00e7\u00f5es, '+unreadCount+' n\u00e3o lidas" style="position:relative">'+ic('bell')+(unreadCount?'<span style="position:absolute;top:-4px;right:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:var(--brand);color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center">'+(unreadCount>9?'9+':unreadCount)+'</span>':'')+'</a>';
}
/* Botões globais do painel: fazem parte do dash, em todas as telas dele. */
function dashTools(){return '<div class="dash-tools">'+themeBtn()+bellBtn()+'</div>';}
/* Selo de estado do recurso: diz se algo já funciona, funciona em parte ou está planejado. */
const STATUS_TAGS={ok:['Funciona','estado-ok'],parcial:['Parcial','estado-parcial'],espera:['Aguarda pedidos','estado-espera'],plan:['Planejado','estado-plan']};
function statusTag(k,rotulo){const s=STATUS_TAGS[k]||STATUS_TAGS.plan;return '<span class="estado '+s[1]+'">'+(rotulo||s[0])+'</span>';}
/* Título em duas vozes: itálico leve e negrito. */
function duo(leve,forte,nivel,cls){const n=nivel||2;return '<h'+n+' class="duo'+(cls?' '+cls:'')+'"><span>'+leve+'</span> <strong>'+forte+'</strong></h'+n+'>';}
/* Ação pública: texto com seta em círculo. */
function linkSeta(href,texto,forte){return '<a class="seta'+(forte?' seta-forte':'')+'" href="'+href+'"><span>'+texto+'</span><i>'+ic('arrow')+'</i></a>';}
/* Seção da página: o rótulo vira o nome da região para leitores de tela. */
function folha(rotulo,html,cls){return '<section class="folha'+(cls?' '+cls:'')+'" aria-label="'+rotulo+'"><div class="wrap folha-in"><div class="folha-corpo">'+html+'</div></div></section>';}
function header(){
  /* O painel não usa a barra do site. */
  if(route.page==='painel')return '';
  const u=me();
  const links=NAV.map(([p,l])=>'<a href="#/'+p+'" class="'+(route.page===p?'active':'')+'"'+(route.page===p?' aria-current="page"':'')+'>'+l+'</a>').join('');
  return '<header class="site"><div class="wrap"><nav class="nav" aria-label="Principal">'+
    '<a href="#/home" class="logo"><span class="lt">Task<b>GO</b></span></a>'+
    '<div class="nav-links">'+links+'</div>'+
    '<div class="nav-right">'+
      themeBtn()+
      (u
        ? bellBtn()+
          '<a class="btn btn-ghost btn-sm" href="#/painel">'+avatar(u,22)+' Painel</a>'
        : '<a class="btn btn-ghost btn-sm" href="#/entrar">'+ic('user')+' Entrar</a>'+
          '<a class="btn btn-ghost btn-sm nav-participar" href="#/entrar?tipo=profissional">Criar conta</a>')+
      '<button class="icon-btn burger" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="mnav" onclick="toggleMenu()">'+ic('menu')+'</button>'+
    '</div></nav></div></header>'+
    '<nav class="mobile-nav" id="mnav" aria-label="Menu">'+NAV.map(([p,l])=>'<a href="#/'+p+'" onclick="toggleMenu()">'+l+'</a>').join('')+
            (u?'<a href="#/painel" onclick="toggleMenu()">Meu painel</a>':'<a href="#/entrar" onclick="toggleMenu()">Entrar / Criar conta</a>')+
      '<a href="#/contato" onclick="toggleMenu()">Contato</a></nav>';
}
function toggleMenu(){
  const m=$('#mnav'),b=$('#burger');if(!m)return;
  const aberto=m.classList.toggle('open');
  if(b){b.setAttribute('aria-expanded',String(aberto));b.setAttribute('aria-label',aberto?'Fechar menu':'Abrir menu');}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#mnav')?.classList.contains('open')){toggleMenu();$('#burger')?.focus();}});

function footer(){
  return '<footer class="site azul"><div class="wrap">'+
  '<div class="foot-grid">'+
    '<div class="foot-brand"><a href="#/home" class="logo"><span class="lt">Task<b>GO</b></span></a>'+
      '<p>Somos um projeto em desenvolvimento para aproximar clientes e profissionais locais. A plataforma ainda não está aberta para contratação.</p></div>'+
    '<div><h2>serviços</h2><div class="foot-links">'+SERVICES.slice(0,6).map(s=>'<a href="#/servicos/'+s.id+'">'+s.n+'</a>').join('')+'</div></div>'+
    '<div><h2>projeto</h2><div class="foot-links">'+
      '<a href="#/sobre">Quem somos</a><a href="#/como-funciona">Como funciona</a><a href="#/profissionais">Para profissionais</a><a href="#/planos">Planos</a><a href="#/seguranca">Segurança</a><a href="#/contato">Contato</a></div></div>'+
    '<div><h2>suporte</h2><div class="foot-links">'+
      '<a href="#/ajuda">Perguntas frequentes</a><a href="#/legal/termos">Termos de uso</a><a href="#/legal/privacidade">Privacidade</a><a href="#/legal/cancelamento">Cancelamento</a></div></div>'+
  '</div>'+
  '<div class="foot-bottom"><span>© '+new Date().getFullYear()+' TaskGO · Projeto de estudantes da UNIBRA · Recife/PE</span><span>Pagamentos ainda não disponíveis</span></div>'+
  '</div></footer>';
}

