/* ---------- CONFIGURAÇÕES ---------- */
function dashConfig(){
  const u=me(),isPro=u.role==='profissional';
  return dashHead('Configurações','Gerencie seus dados pessoais, segurança e preferências.')+
  '<div class="grid g2" style="grid-template-columns:.4fr 1.6fr;align-items:start">'+
  '<div class="card"><div style="text-align:center">'+
  '<div style="position:relative;width:110px;margin:0 auto">'+avatar(u,110).replace('class="avatar"','class="avatar" style="margin:0 auto;width:110px;height:110px;font-size:40px"')+
  '<button class="icon-btn" style="position:absolute;bottom:0;right:0;background:var(--brand);border-color:var(--brand)" onclick="document.getElementById(\'fotoIn\').click()">'+ic('camera').replace('class="ic "','class="ic" style="stroke:#fff"')+'</button></div>'+
  '<input type="file" id="fotoIn" accept="image/*" class="hide" onchange="trocarFoto(this)">'+
  '<b style="display:block;margin-top:14px">'+esc(u.name)+'</b>'+
  '<span class="muted" style="font-size:.84rem">'+(isPro?(u.service?svc(u.service).n:'Categoria não informada'):'Cliente')+'</span>'+
  '<div style="margin-top:10px">'+(isPro?'<span class="tag tag-warn">Verificação não disponível</span>':'<span class="tag tag-info">'+ic('shield')+' Conta ativa</span>')+'</div>'+
  '<button class="btn btn-ghost btn-sm btn-block" style="margin-top:14px" onclick="document.getElementById(\'fotoIn\').click()">Trocar foto</button>'+
  (u.photo?'<button class="btn btn-danger btn-sm btn-block" style="margin-top:8px" onclick="saveUser({photo:null});toast(\'Foto removida\');render()">Remover foto</button>':'')+
  '</div></div>'+
  '<div>'+
  '<form class="card" onsubmit="salvarPerfil(event)"><h3 style="font-size:1.05rem;margin-bottom:18px">Dados pessoais</h3>'+
  '<div class="grid g2" style="gap:0 16px">'+
  '<div class="field"><label>Nome completo</label><input class="input" name="name" value="'+esc(u.name)+'" required></div>'+
  '<div class="field"><label>CPF</label><input class="input" name="cpf" value="'+esc(u.cpf)+'" oninput="this.value=maskCPF(this.value)" required></div>'+
  '<div class="field"><label>E-mail</label><input class="input" type="email" name="email" value="'+esc(u.email)+'" required></div>'+
  '<div class="field"><label>Telefone / WhatsApp</label><input class="input" name="phone" value="'+esc(u.phone)+'" oninput="this.value=maskPhone(this.value)" required></div>'+
  '<div class="field"><label>Cidade</label><input class="input" name="city" value="'+esc(u.city)+'"></div>'+
  (isPro?'<div class="field"><label>Categoria principal</label><select class="select" name="service">'+SERVICES.map(s=>'<option value="'+s.id+'" '+(u.service===s.id?'selected':'')+'>'+s.n+'</option>').join('')+'</select></div>':
   '<div class="field"><label>Data de nascimento</label><input class="input" type="date" name="birth" value="'+esc(u.birth||'')+'"></div>')+
  '</div>'+
  '<div class="field"><label>Endereço principal</label><input class="input" name="address" value="'+esc(u.address)+'" placeholder="Rua, número, bairro, cidade"></div>'+
  (isPro?'<div class="field"><label>Sobre você (aparece no seu perfil público)</label><textarea class="textarea" name="bio">'+esc(u.bio)+'</textarea></div>':'')+
  '<button class="btn btn-grad">'+ic('check')+' Salvar alterações</button></form>'+

  '<div class="card" style="margin-top:20px"><h3 style="font-size:1.05rem;margin-bottom:6px">Segurança</h3>'+
  '<p class="muted" style="font-size:.88rem;margin-bottom:8px">Proteja o acesso à sua conta.</p>'+
  '<div class="check-row"><div><b style="font-size:.92rem;display:block">Autenticação em duas etapas</b><small class="muted">Este recurso ainda não está disponível.</small></div><span class="tag tag-warn">Indisponível</span></div>'+
  '<div class="check-row"><div><b style="font-size:.92rem;display:block">Senha</b><small class="muted">Última alteração há 3 meses</small></div>'+
  '<button class="btn btn-ghost btn-sm" onclick="trocarSenha()">Alterar senha</button></div>'+
  '<div class="check-row"><div><b style="font-size:.92rem;display:block">Sessões ativas</b><small class="muted">Gerenciamento de dispositivos indisponível.</small></div></div></div>'+

  '<div class="card" style="margin-top:20px"><h3 style="font-size:1.05rem;margin-bottom:6px">Notificações</h3>'+
  '<p class="muted" style="font-size:.88rem;margin-bottom:8px">Escolha como quer ser avisado.</p>'+
  [['push','Push no aplicativo'],['email','E-mail'],['sms','SMS'],['promo','Promoções e novidades']]
  .map(n=>'<div class="check-row"><span style="font-size:.92rem;font-weight:600">'+n[1]+'</span>'+
  '<div class="switch '+(u.notif[n[0]]?'on':'')+'" onclick="toggleNotif(\''+n[0]+'\')"></div></div>').join('')+'</div>'+

  '<div class="card" style="margin-top:20px;border-color:color-mix(in srgb,var(--danger) 36%,var(--line))">'+
  '<h3 style="font-size:1.05rem;margin-bottom:6px;color:var(--danger)">Zona de risco</h3>'+
  '<p class="muted" style="font-size:.88rem;margin-bottom:14px">Ações irreversíveis. Tenha certeza antes de continuar.</p>'+
  '<div style="display:flex;gap:10px;flex-wrap:wrap">'+
  (DEMO_MODE?'<button class="btn btn-ghost" onclick="Store.reset();location.reload()">Restaurar dados demo</button>':'')+
  '<button class="btn btn-danger" onclick="excluirConta()">'+ic('trash')+' Excluir minha conta</button></div></div>'+
  '</div></div>';
}
async function salvarPerfil(e){
  e.preventDefault();
  const f=new FormData(e.target),patch={};
  ['name','cpf','email','phone','city','address','bio','service','birth'].forEach(k=>{if(f.get(k)!==null)patch[k]=f.get(k);});
  try{await saveUser(patch);toast('Perfil atualizado com sucesso!','ok');render();}catch(error){toast(error.message||'Não foi possível salvar o perfil.','err');}
}
function trocarFoto(input){
  const file=input.files&&input.files[0];if(!file)return;
  const rd=new FileReader();
  rd.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas'),S2=240;c.width=S2;c.height=S2;
      const ctx=c.getContext('2d'),m=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,S2,S2);
      saveUser({photo:c.toDataURL('image/jpeg',.82)});toast('Foto de perfil atualizada!','ok');render();
    };
    img.src=rd.result;
  };
  rd.readAsDataURL(file);
}
async function toggleNotif(k){const u=me(),next={...(u.notif||{}),[k]:!u.notif?.[k]};try{await saveUser({notif:next});render();}catch(error){toast(error.message||'Não foi possível salvar a preferência.','err');}}
function trocarSenha(){
  openModal('<div class="modal-head"><div><h3>Alterar senha</h3><p>Use no mínimo 6 caracteres.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Senha atual</label><input class="input" type="password" id="pwOld"></div>'+
  '<div class="field"><label>Nova senha</label><input class="input" type="password" id="pwNew"></div>'+
  '<div class="field"><label>Confirmar nova senha</label><input class="input" type="password" id="pwNew2"></div>'+
  '<button class="btn btn-grad btn-block" onclick="salvarSenha()">Salvar nova senha</button>');
}
async function salvarSenha(){
  const u=me(),o=$('#pwOld').value,n=$('#pwNew').value,n2=$('#pwNew2').value;
  if(n.length<6)return toast('A nova senha precisa ter 6+ caracteres','err');
  if(n!==n2)return toast('As senhas não coincidem','err');
  try{const resposta=await fetch(API_BASE_URL+'/api/auth/senha',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({senhaAtual:o,novaSenha:n})});if(!resposta.ok)throw new Error(resposta.status===401?'Senha atual incorreta':'Não foi possível alterar a senha.');closeModal();toast('Senha alterada com sucesso','ok');}
  catch(erro){toast(erro.message||'Não foi possível alterar a senha.','err');}
}
function excluirConta(){
  openModal('<div class="modal-head"><div><h3 style="color:var(--danger)">Excluir conta</h3><p>Todos os seus dados, pedidos e saldo serão perdidos.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Digite <b>EXCLUIR</b> para confirmar</label><input class="input" id="delConf" placeholder="EXCLUIR"></div>'+
  '<div class="field"><label>Senha atual</label><input class="input" id="delPassword" type="password" autocomplete="current-password"></div>'+ 
  '<button class="btn btn-danger btn-block" id="btnConfirmarExclusao" onclick="confirmarExclusao()">Excluir permanentemente</button>');
}
async function confirmarExclusao(){
  if(($('#delConf')||{}).value!=='EXCLUIR')return toast('Digite EXCLUIR para confirmar','err');
  const usuario=me();
  if(!usuario)return toast('Não foi possível identificar a conta atual.','err');
  const botao=$('#btnConfirmarExclusao');
  if(botao)botao.disabled=true;
  try{
    const resposta=await fetch(API_BASE_URL+'/api/auth/conta',{
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({senha:$('#delPassword').value})
    });
    if(!resposta.ok){
      let erro={};
      try{erro=await resposta.json();}catch(_){/* resposta sem JSON */}
      throw new Error(erro.detail||erro.message||'Não foi possível excluir a conta.');
    }

    const pedidosExcluidos=new Set((S.orders||[])
      .filter(p=>p.clientId===usuario.id||(usuario.proId&&p.proId===usuario.proId))
      .map(p=>p.id));
    S.users=S.users.filter(u=>u.id!==usuario.id);
    S.orders=(S.orders||[]).filter(p=>!pedidosExcluidos.has(p.id));
    S.chats=(S.chats||[]).filter(c=>!pedidosExcluidos.has(c.orderId));
    S.tx=(S.tx||[]).filter(t=>t.ownerId!==usuario.id);
    S.notifs=(S.notifs||[]).filter(n=>n.userId!==usuario.id);
    if(usuario.proId)S.pros=S.pros.filter(p=>p.id!==usuario.proId);
    S.session=null;Store.save();closeModal();
    toast('Conta excluída.');go('/home');
  }catch(erro){
    if(botao)botao.disabled=false;
    toast(erro instanceof TypeError
      ?'Sem conexão com o servidor. A conta não foi excluída.'
      :(erro.message||'Não foi possível excluir a conta.'),'err');
  }
}

