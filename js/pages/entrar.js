/* =========================================================
   AUTENTICAÇÃO
   ========================================================= */
let A={mode:'login',role:'cliente'};
function pageEntrar(){
  if(route.q.tipo&&!A._init){A.role=route.q.tipo;A.mode='signup';A._init=1;}
  if(me()){go('/painel');return '';}
  const isLogin=A.mode==='login';
  return '<div class="auth-wrap">'+
  '<div class="auth-side">'+
  '<p class="lp-auth-slogan">Crie sua conta e ajude a definir como a TaskGO vai funcionar.</p>'+
  '<ul class="estado-lista">'+[
    ['espera','Pedido, aceite, conversa e acompanhamento no mesmo lugar'],
    ['espera','Código de chegada para confirmar o início do serviço'],
    ['parcial','Referência de preço por categoria, sem IA'],
    ['plan','Pagamento e saque pela plataforma']
  ].map(t=>'<li>'+statusTag(t[0])+'<span>'+t[1]+'</span></li>').join('')+'</ul>'+
  '</div>'+
  '<div class="auth-main"><div class="auth-card">'+
  '<h1 class="lp-auth-title">'+(isLogin?'Bem-vindo de volta':'Criar sua conta')+'</h1>'+
  '<p class="muted lp-auth-sub">'+(isLogin?'Acesse seu painel TaskGO.':'Leva menos de 1 minuto e é grátis.')+'</p>'+
  '<div class="tabs"><button data-fk="aba-entrar" aria-pressed="'+isLogin+'" class="'+(isLogin?'active':'')+'" onclick="A.mode=\'login\';render()">Entrar</button>'+
  '<button data-fk="aba-criar" aria-pressed="'+!isLogin+'" class="'+(!isLogin?'active':'')+'" onclick="A.mode=\'signup\';render()">Criar conta</button></div>'+
  (!isLogin?'<p class="aviso-linha" role="note">A TaskGO ainda está em desenvolvimento. Sua conta serve para conhecer e testar a plataforma: ainda não há pedidos reais nem pagamentos.</p>':'')+
  '<form onsubmit="doAuth(event)">'+
  (!isLogin?'<div class="role-pick" role="group" aria-label="Como você quer usar a TaskGO">'+
    '<button type="button" data-fk="papel-cliente" aria-pressed="'+(A.role==='cliente')+'" class="role-opt '+(A.role==='cliente'?'sel':'')+'" onclick="A.role=\'cliente\';render()">'+ic('user')+'<b>Quero contratar</b><span>Sou cliente</span></button>'+
    '<button type="button" data-fk="papel-profissional" aria-pressed="'+(A.role==='profissional')+'" class="role-opt '+(A.role==='profissional'?'sel':'')+'" onclick="A.role=\'profissional\';render()">'+ic('wrench')+'<b>Quero trabalhar</b><span>Sou profissional</span></button>'+
  '</div>'+
  '<div class="field"><label for="auth-name">Nome completo</label><input class="input" id="auth-name" name="name" autocomplete="name" required placeholder="Como no seu documento"></div>'+
  '<div class="field"><label for="auth-cpf">CPF</label><input class="input" id="auth-cpf" name="cpf" inputmode="numeric" required placeholder="000.000.000-00" oninput="this.value=maskCPF(this.value)" aria-describedby="auth-cpf-dica"><small class="hint" id="auth-cpf-dica">Hoje o CPF só fica guardado no seu cadastro. Ele ainda não é conferido nem usado em nenhuma verificação.</small></div>'+
  '<div class="field"><label for="auth-phone">Telefone / WhatsApp</label><input class="input" id="auth-phone" name="phone" type="tel" autocomplete="tel" required placeholder="(81) 90000-0000" oninput="this.value=maskPhone(this.value)"></div>'+
  (A.role==='profissional'?'<div class="field"><label for="auth-service">Categoria principal</label><select class="select" id="auth-service" name="service">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>':'')
  :'')+
  '<div class="field"><label for="auth-email">E-mail</label><input class="input" id="auth-email" type="email" name="email" autocomplete="email" required placeholder="voce@email.com"></div>'+
  '<div class="field"><label for="auth-pass">Senha</label><div class="password-field"><input class="input" id="auth-pass" type="password" name="pass" required minlength="6" placeholder="Mínimo 6 caracteres"><button class="password-toggle" type="button" aria-label="Mostrar senha" aria-pressed="false" onclick="alternarVisibilidadeSenha(this)">'+ic('eye')+'</button></div></div>'+
  (isLogin?'<div class="lp-auth-row"><label class="muted lp-auth-check"><input type="checkbox" checked> Lembrar de mim</label><a href="#/recuperar" class="lp-auth-link">Esqueci a senha</a></div>'
  :'<label class="muted lp-auth-check lp-auth-terms"><input type="checkbox" required> Li e aceito os <a href="#/legal/termos" class="lp-auth-link">Termos de Uso</a> e a <a href="#/legal/privacidade" class="lp-auth-link">Política de Privacidade</a>.</label>')+
  '<button class="btn btn-grad btn-block btn-lg">'+(isLogin?'Entrar':'Criar conta')+'</button></form>'+
  '</div></div></div>';
}
function alternarVisibilidadeSenha(botao){
  const campo=botao.closest('.password-field')?.querySelector('input[name="pass"]');
  if(!campo)return;
  const mostrar=campo.type==='password';
  campo.type=mostrar?'text':'password';
  botao.setAttribute('aria-pressed',String(mostrar));
  botao.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha');
  botao.innerHTML=ic(mostrar?'eyeOff':'eye');
}
async function obterCabecalhosCsrf(){
  const response=await fetch(API_BASE_URL+'/api/auth/csrf',{credentials:'include'});
  if(!response.ok)throw new Error('Não foi possível iniciar uma solicitação segura.');
  const cookie=document.cookie.split('; ').find(item=>item.startsWith('XSRF-TOKEN='));
  if(!cookie)throw new Error('Não foi possível iniciar uma solicitação segura.');
  return {'Content-Type':'application/json','X-XSRF-TOKEN':decodeURIComponent(cookie.slice('XSRF-TOKEN='.length))};
}
function pageRecuperar(){
  const token=route.q.token||'';
  return '<div class="auth-wrap"><div class="auth-side"><p class="lp-auth-slogan">Recupere o acesso à sua conta</p><p class="muted">Os links são individuais, temporários e podem ser usados uma única vez.</p></div><div class="auth-main"><div class="auth-card"><h1 class="lp-auth-title">'+(token?'Criar nova senha':'Esqueceu sua senha?')+'</h1><p class="muted lp-auth-sub">'+(token?'Escolha uma nova senha para sua conta.':'Informe o e-mail cadastrado. Se a conta existir e o envio estiver configurado, enviaremos instruções.')+'</p>'+
  (token?'<form onsubmit="redefinirSenha(event)"><div class="field"><label for="nova-senha">Nova senha</label><input class="input" id="nova-senha" name="novaSenha" type="password" required minlength="8" maxlength="128" autocomplete="new-password"></div><div class="field"><label for="confirmar-senha">Confirme a nova senha</label><input class="input" id="confirmar-senha" name="confirmarSenha" type="password" required minlength="8" maxlength="128" autocomplete="new-password"></div><button class="btn btn-grad btn-block" type="submit">Redefinir senha</button></form>'
  :'<form onsubmit="solicitarRecuperacao(event)"><div class="field"><label for="email-recuperacao">E-mail</label><input class="input" id="email-recuperacao" name="email" type="email" maxlength="254" required autocomplete="email" placeholder="voce@email.com"></div><button class="btn btn-grad btn-block" type="submit">Enviar instruções</button></form>')+
  '<p id="recovery-status" role="status" aria-live="polite" class="muted lp-auth-status"></p><a href="#/entrar" class="btn btn-ghost btn-block">Voltar para entrar</a></div></div></div>';
}
async function solicitarRecuperacao(event){
  event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type="submit"]'),status=$('#recovery-status');button.disabled=true;button.setAttribute('aria-busy','true');
  try{const headers=await obterCabecalhosCsrf();const response=await fetch(API_BASE_URL+'/api/auth/recuperacao',{method:'POST',credentials:'include',headers,body:JSON.stringify({email:new FormData(form).get('email')})});
    if(response.status===429)throw new Error('Muitas solicitações. Aguarde alguns minutos e tente novamente.');if(!response.ok)throw new Error('Confira o e-mail informado e tente novamente.');
    const data=await response.json();status.textContent=data.message;
  }catch(error){status.textContent=error.message||'Não foi possível enviar a solicitação. Tente novamente.';status.setAttribute('role','alert');}
  finally{button.disabled=false;button.removeAttribute('aria-busy');}
}
async function redefinirSenha(event){
  event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type="submit"]'),status=$('#recovery-status');button.disabled=true;button.setAttribute('aria-busy','true');
  try{const data=Object.fromEntries(new FormData(form));if(data.novaSenha!==data.confirmarSenha)throw new Error('As senhas não coincidem.');const headers=await obterCabecalhosCsrf();
    const response=await fetch(API_BASE_URL+'/api/auth/recuperacao/redefinir',{method:'POST',credentials:'include',headers,body:JSON.stringify({...data,token:route.q.token})});
    if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.detail||body.message||'Link inválido ou expirado. Solicite uma nova recuperação.');}
    const usuarioAtual=me();if(usuarioAtual?.id?.startsWith('db_'))S.users=S.users.filter(usuario=>usuario!==usuarioAtual);S.session=null;Store.save();
    status.textContent='Senha redefinida pelo servidor. Entre com sua nova senha.';setTimeout(()=>go('/entrar'),1200);
  }catch(error){status.textContent=error.message||'Não foi possível redefinir a senha.';status.setAttribute('role','alert');}
  finally{button.disabled=false;button.removeAttribute('aria-busy');}
}
function mostrarCadastroConcluido({nome='',aguardar,onConcluir,onErro}={}){
  const reduzir=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const podeTentar=typeof aguardar==='function';
  const primeiroNome=String(nome).trim().split(/\s+/)[0];
  let erroAtual;
  const dlg=document.createElement('dialog');
  dlg.className='tg-success';
  dlg.tabIndex=-1;
  dlg.setAttribute('aria-labelledby','tg-success-title');
  dlg.setAttribute('aria-describedby','tg-success-msg');
  dlg.innerHTML='<svg class="tg-success__mark" viewBox="0 0 64 64" aria-hidden="true">'+
    '<circle class="tg-success__track" cx="32" cy="32" r="30"/>'+
    '<circle class="tg-success__fill" cx="32" cy="32" r="30"/>'+
    '<circle class="tg-success__arc" cx="32" cy="32" r="30"/>'+
    '<path class="tg-success__tick" d="M20 33l8 8 16-18"/>'+
    '<path class="tg-success__bang" d="M32 20v15"/>'+
    '<circle class="tg-success__dot" cx="32" cy="43.5" r="2"/>'+
    '</svg><div class="tg-success__texto" role="status" aria-live="polite">'+
    '<h2 class="tg-success__title" id="tg-success-title"></h2>'+
    '<p class="tg-success__msg" id="tg-success-msg"></p></div>'+
    '<div class="tg-success__actions"><div><div class="tg-success__actions-in">'+
    '<button type="button" class="tg-success__btn tg-success__btn--primary" data-acao="tentar">Tentar novamente</button>'+
    '<button type="button" class="tg-success__btn tg-success__btn--ghost" data-acao="voltar">Voltar ao formulário</button>'+
    '</div></div></div>';
  const texto=$('.tg-success__texto',dlg),titulo=$('.tg-success__title',dlg),msg=$('.tg-success__msg',dlg);
  const acoes=$('.tg-success__actions',dlg),btnTentar=$('[data-acao="tentar"]',dlg),btnVoltar=$('[data-acao="voltar"]',dlg);
  if(!podeTentar){btnTentar.hidden=true;btnVoltar.classList.replace('tg-success__btn--ghost','tg-success__btn--primary');}
  const definir=(estado,t,m)=>{
    dlg.dataset.estado=estado;
    dlg.setAttribute('aria-busy',String(estado==='carregando'));
    texto.setAttribute('aria-live',estado==='erro'?'assertive':'polite');
    acoes.inert=estado!=='erro';
    [[titulo,t],[msg,m]].forEach(([el,valor])=>{
      el.textContent=valor;
      if(!reduzir&&typeof el.animate==='function')el.animate(
        [{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],
        {duration:220,easing:'ease-out'});
    });
  };
  const textoDoErro=erro=>erro instanceof TypeError
    ?'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
    :(erro&&erro.message)||'Não foi possível concluir o cadastro. Tente novamente.';
  const remover=()=>{if(dlg.open)dlg.close();dlg.remove();};
  async function executar(){
    definir('carregando','Criando sua conta','Estamos finalizando seu cadastro.');
    const [resultado]=await Promise.all([
      Promise.resolve().then(()=>podeTentar?aguardar():aguardar).then(()=>({}),erro=>({erro:erro||new Error()})),
      espera(1600)
    ]);
    if(resultado.erro){
      erroAtual=resultado.erro;
      definir('erro','Não foi possível criar a conta',textoDoErro(resultado.erro));
      requestAnimationFrame(()=> (podeTentar?btnTentar:btnVoltar).focus());
      return;
    }
    definir('pronto','Conta criada',primeiroNome
      ?'Bem-vindo à TaskGO, '+primeiroNome+'. Abrindo seu painel.'
      :'Bem-vindo à TaskGO. Abrindo seu painel.');
    await espera(reduzir?1200:1700);
    dlg.dataset.saindo='';
    await espera(reduzir?0:180);
    remover();
    if(typeof onConcluir==='function')onConcluir();
  }
  btnTentar.addEventListener('click',executar);
  btnVoltar.addEventListener('click',()=>{
    remover();
    requestAnimationFrame(()=>{if(typeof onErro==='function')onErro(erroAtual);});
  });
  dlg.addEventListener('cancel',evento=>{
    evento.preventDefault();
    if(dlg.dataset.estado==='erro')btnVoltar.click();
  });
  document.body.appendChild(dlg);
  dlg.showModal();
  executar();
}
async function doAuth(e){
  e.preventDefault();
  const f=new FormData(e.target),email=(f.get('email')||'').trim().toLowerCase(),pass=f.get('pass');
  if(A.mode==='login'){
    const botao=e.submitter||e.target.querySelector('button[type="submit"]');
    if(botao)botao.disabled=true;
    try{
      const resposta=await fetch(API_BASE_URL+'/api/auth/login',{
        method:'POST',
        credentials:'include',headers:await obterCabecalhosCsrf(),
        body:JSON.stringify({email:email,senha:pass})
      });
      if(!resposta.ok)throw new Error('Credenciais inválidas');

      const usuarioApi=await resposta.json();
      const emailApi=String(usuarioApi.email||email).trim().toLowerCase();
      const role=usuarioApi.tipo==='profissional'?'profissional':'cliente';
      const nome=usuarioApi.nome||emailApi.split('@')[0];
      let usuarioLocal=S.users.find(u=>String(u.email||'').toLowerCase()===emailApi);
      if(!usuarioLocal){
        usuarioLocal={
          id:usuarioApi.id!=null?'db_'+usuarioApi.id:'u_'+uid(),role:role,name:nome,email:emailApi,
          cpf:usuarioApi.cpf||'',phone:usuarioApi.telefone||'',photo:null,city:'',address:'',bio:'',
          balance:0,pending:0,rating:0,since:Date.now(),plan:'free',
          refCode:null,referredBy:null,pixKey:null,
          notif:{push:true,email:true,promo:true,sms:false},twofa:false,paymentMethods:[],
        verified:false,jobs:0,acceptRadius:10
        };
        S.users.push(usuarioLocal);
      }
      Object.assign(usuarioLocal,{
        role:role,name:nome,email:emailApi,
        cpf:usuarioApi.cpf||usuarioLocal.cpf||'',phone:usuarioApi.telefone||usuarioLocal.phone||'',
        proId:usuarioApi.proId||usuarioLocal.proId,service:usuarioApi.tipo==='profissional'?(usuarioApi.service||usuarioLocal.service):null,
        birth:usuarioApi.birth||usuarioLocal.birth||'',
        city:usuarioApi.cidade||usuarioLocal.city,address:usuarioApi.endereco||usuarioLocal.address,bio:usuarioApi.bio||usuarioLocal.bio,
        balance:usuarioApi.balance??usuarioLocal.balance,pending:usuarioApi.pending??usuarioLocal.pending,
        plan:usuarioApi.plan||usuarioLocal.plan,pixKey:usuarioApi.pixKey||usuarioLocal.pixKey,
        notif:usuarioApi.notif||usuarioLocal.notif,twofa:usuarioApi.twofa??usuarioLocal.twofa,
        photo:usuarioApi.photo||usuarioLocal.photo,available:usuarioApi.available??usuarioLocal.available,
        acceptRadius:usuarioApi.acceptRadius??usuarioLocal.acceptRadius,verified:false
      });
      if(usuarioApi.id!=null)usuarioLocal.id='db_'+usuarioApi.id;
      S.users=[usuarioLocal];S.orders=[];S.tx=[];S.chats=[];S.notifs=[];
      window.__taskgoHydrating=true;
      S.session=usuarioLocal.id;Store.save();
      try{await carregarProfissionaisPersistidos();}catch(erro){console.error('Falha ao carregar profissionais cadastrados:',erro);}
      try{await syncPedidos(emailApi);}catch(erro){console.error('Falha ao sincronizar pedidos:',erro);}
      try{await syncDadosConta(emailApi);}catch(erro){console.error('Falha ao sincronizar dados da conta:',erro);}
      window.__taskgoHydrating=false;Store.save();
      toast('Bem-vindo, '+String(nome).split(' ')[0]+'!','ok');
      return go(route.q.next?'/'+route.q.next:'/painel');
    }catch(erro){
      console.error('Erro no login:',erro);
      toast('E-mail ou senha incorretos','err');
    }finally{
      if(botao)botao.disabled=false;
    }
    return;
  }
  const u={id:'u_'+uid(),role:A.role,name:f.get('name'),email:email,cpf:f.get('cpf'),phone:f.get('phone'),
    photo:null,city:'',address:'',bio:'',balance:0,pending:0,rating:0,since:Date.now(),plan:'free',
    refCode:'',referredBy:null,pixKey:'',
    notif:{push:true,email:true,promo:true,sms:false},twofa:false,paymentMethods:[],service:A.role==='profissional'?(f.get('service')||''):null,verified:false,jobs:0,acceptRadius:10};
  if(A.role==='profissional')u.proId=null;
  const enviarCadastro=continuar=>{
    const usuario={
      nome:u.name,
      cpf:u.cpf,
      telefone:u.phone,
      email:u.email,
      senha:pass,
      tipo:A.role,
      service:u.role==='profissional'?u.service:null,
      proId:u.proId,
      cidade:u.city,
      endereco:u.address,
      bio:u.bio
    };
    const criarConta=async()=>{
      const response=await fetch(API_BASE_URL+'/api/auth/registrar',{
        method:'POST',
        credentials:'include',headers:await obterCabecalhosCsrf(),
        body:JSON.stringify(usuario)
      });
      if(!response.ok){
        let dadosErro={};
        try{dadosErro=await response.json();}catch(_){/* resposta sem JSON */}
        if(response.status===409)throw new Error('Este e-mail já está cadastrado.');
        throw new Error(dadosErro.detail||dadosErro.message||'Não foi possível criar a conta no servidor. Tente novamente.');
      }
      const criado=await response.json();
      if(criado.id!=null)u.id='db_'+criado.id;
      if(criado.proId)u.proId=criado.proId;
      return criado;
    };
    return mostrarCadastroConcluido({
      nome:u.name,
      aguardar:criarConta,
      onConcluir:continuar,
      onErro:erro=>{
        const campoEmail=e.target.elements.namedItem('email');
        const campoInvalido=e.target.querySelector(':invalid');
        const campoProblema=/e-?mail|cadastrad/i.test((erro&&erro.message)||'')?campoEmail:(campoInvalido||campoEmail);
        if(campoProblema)campoProblema.focus();
      }
    });
  };
  if(u.role==='profissional')return enviarCadastro(async()=>{
    S.users.push(u);S.session=u.id;Store.save();
    try{await carregarProfissionaisPersistidos();}catch(error){console.error(error);}
    go('/painel/config');
  });
  return enviarCadastro(()=>{
    u.since=Date.now();
    S.users.push(u);
    S.session=u.id;Store.save();
    go('/painel');
  });
}
async function logout(){
  try{const response=await fetch(API_BASE_URL+'/api/auth/logout',{method:'POST',credentials:'include',headers:await obterCabecalhosCsrf()});if(!response.ok&&response.status!==401)throw new Error('HTTP '+response.status);}
  catch(error){toast('Não foi possível encerrar a sessão no servidor. Tente novamente.','err');return;}
  const current=me();if(current?.id?.startsWith('db_'))S.users=S.users.filter(user=>user!==current);
  S.session=null;S.orders=[];S.tx=[];S.chats=[];S.notifs=[];
  try{await carregarProfissionaisPersistidos();}catch(error){console.error(error);}
  Store.save();toast('Você saiu da conta');go('/home');
}

