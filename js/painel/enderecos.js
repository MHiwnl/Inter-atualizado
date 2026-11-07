/* ---------- ENDEREÇOS SALVOS ----------
   Ficam na conta (dados extras do perfil, no servidor). O principal também
   preenche o campo "endereço" do perfil, usado pelo resto do sistema. */
const UFS=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
function listaEnderecos(u){
  u=u||me();if(!u)return[];
  if(Array.isArray(u.addresses)&&u.addresses.length)return u.addresses;
  /* Contas antigas: o endereço único do perfil aparece como o principal. */
  return u.address?[{id:'antigo',apelido:'Endereço principal',texto:u.address,principal:true}]:[];
}
function enderecoPrincipal(u){const l=listaEnderecos(u);return l.find(e=>e.principal)||l[0]||null;}
function linhaEndereco(e){
  if(!e)return '';
  if(e.texto)return e.texto;
  return [e.rua+(e.numero?', '+e.numero:''),e.complemento,e.bairro,(e.cidade||'')+(e.uf?'/'+e.uf:'')].filter(Boolean).join(' · ')+(e.cep?' · CEP '+e.cep:'');
}
function maskCEP(v){v=String(v).replace(/\D/g,'').slice(0,8);return v.replace(/(\d{5})(\d)/,'$1-$2');}
/* Seção do perfil */
function secaoEnderecos(){
  const lista=listaEnderecos();
  return '<div class="card" style="margin-top:20px"><div class="enderecos-topo"><div><h2 class="sub" style="font-size:1.05rem">Endereços</h2>'+
    '<p class="muted" style="font-size:.88rem;margin-top:4px">Salve onde você costuma precisar de atendimento. Ao contratar, é só escolher.</p></div>'+
    '<button type="button" class="btn btn-ghost btn-sm" onclick="abrirEditorEndereco()">'+ic('plus')+' Adicionar endereço</button></div>'+
    (lista.length?'<ul class="enderecos">'+lista.map(e=>'<li class="endereco'+(e.principal?' principal':'')+'">'+ic(e.apelido&&/casa/i.test(e.apelido)?'home':'mapPin')+
      '<div class="grow"><b>'+esc(e.apelido||'Endereço')+(e.principal?' <span class="tag tag-info">Principal</span>':'')+'</b><span>'+esc(linhaEndereco(e))+'</span></div>'+
      '<div class="endereco-acoes">'+(!e.principal?'<button type="button" class="btn btn-ghost btn-sm" onclick="definirEnderecoPrincipal(\''+e.id+'\')">Tornar principal</button>':'')+
      '<button type="button" class="icon-btn" aria-label="Editar '+esc(e.apelido||'endereço')+'" onclick="abrirEditorEndereco(\''+e.id+'\')">'+ic('edit')+'</button>'+
      '<button type="button" class="icon-btn" aria-label="Excluir '+esc(e.apelido||'endereço')+'" onclick="excluirEndereco(\''+e.id+'\')">'+ic('trash')+'</button></div></li>').join('')+'</ul>'
      :'<div class="emptystate" style="padding:24px 0">'+ic('mapPin')+'<b>Nenhum endereço salvo</b><p style="margin-top:6px">Adicione sua casa ou trabalho para contratar mais rápido.</p></div>')+
  '</div>';
}
function abrirEditorEndereco(id){
  const atual=listaEnderecos().find(e=>e.id===id)||{};
  const antigo=atual.id==='antigo';
  const campo=(nome,rotulo,valor,extra)=>'<div class="field"><label for="end-'+nome+'">'+rotulo+'</label><input class="input" id="end-'+nome+'" name="'+nome+'" value="'+esc(valor||'')+'" '+(extra||'')+'></div>';
  openModal('<div class="modal-head"><div><h3>'+(id?'Editar endereço':'Novo endereço')+'</h3><p>'+(antigo?'Separe o endereço antigo em campos para usar ao contratar.':'Os campos com * são obrigatórios.')+'</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
    '<form onsubmit="salvarEndereco(event,\''+(id||'')+'\')" novalidate>'+
    campo('apelido','Nome do endereço *',antigo?'Casa':atual.apelido,'required maxlength="40" list="end-apelidos" placeholder="Casa, Trabalho..."')+
    '<datalist id="end-apelidos"><option value="Casa"><option value="Trabalho"><option value="Casa dos pais"></datalist>'+
    (antigo?'<p class="hint" style="margin:-8px 0 16px">Antes: '+esc(atual.texto)+'</p>':'')+
    '<div class="grid g2" style="gap:0 16px">'+campo('cep','CEP',atual.cep,'inputmode="numeric" maxlength="9" placeholder="00000-000" aria-describedby="end-cep-status" oninput="this.value=maskCEP(this.value);buscarCEP(this.value)"')+
    campo('numero','Número *',atual.numero,'required maxlength="10" placeholder="Ex.: 120"')+'</div>'+
    '<p class="hint" id="end-cep-status" aria-live="polite" style="margin:-8px 0 16px">Digite o CEP para preencher rua, bairro e cidade.</p>'+
    campo('rua','Rua *',atual.rua,'required maxlength="120" autocomplete="address-line1"')+
    campo('complemento','Complemento',atual.complemento,'maxlength="60" placeholder="Apto, bloco, referência"')+
    campo('bairro','Bairro *',atual.bairro,'required maxlength="60"')+
    '<div class="grid g2" style="gap:0 16px">'+campo('cidade','Cidade *',atual.cidade||'Recife','required maxlength="60"')+
    '<div class="field"><label for="end-uf">Estado *</label><select class="select" id="end-uf" name="uf" required>'+UFS.map(uf=>'<option'+((atual.uf||'PE')===uf?' selected':'')+'>'+uf+'</option>').join('')+'</select></div></div>'+
    '<label class="lp-auth-check" style="margin-bottom:18px"><input type="checkbox" name="principal"'+(atual.principal||!listaEnderecos().length?' checked':'')+'> Usar como endereço principal</label>'+
    '<p class="hint" id="end-erro" role="alert" style="color:var(--danger-text)"></p>'+
    '<button class="btn btn-primary btn-block" id="end-salvar">Salvar endereço</button></form>',{onOpen:()=>$('#end-apelido')?.focus()});
}
async function gravarEnderecos(lista){
  if(lista.length&&!lista.some(e=>e.principal))lista[0].principal=true;
  const principal=lista.find(e=>e.principal);
  await saveUser({addresses:lista,address:principal?linhaEndereco(principal):''});
}
async function salvarEndereco(ev,id){
  ev.preventDefault();
  const f=ev.target,dados=Object.fromEntries(new FormData(f).entries()),erro=$('#end-erro');
  const faltando=[...f.querySelectorAll('[required]')].filter(c=>!String(c.value).trim());
  if(faltando.length){erro.textContent='Preencha: '+faltando.map(c=>f.querySelector('label[for="'+c.id+'"]').textContent.replace(' *','')).join(', ')+'.';faltando[0].focus();return;}
  if(dados.cep&&String(dados.cep).replace(/\D/g,'').length!==8){erro.textContent='O CEP precisa ter 8 números.';$('#end-cep').focus();return;}
  const novo={id:(id&&id!=='antigo')?id:'end-'+Date.now().toString(36),apelido:dados.apelido.trim(),cep:dados.cep||'',rua:dados.rua.trim(),numero:dados.numero.trim(),complemento:(dados.complemento||'').trim(),bairro:dados.bairro.trim(),cidade:dados.cidade.trim(),uf:dados.uf,principal:!!dados.principal};
  let lista=listaEnderecos().filter(e=>e.id!=='antigo').map(e=>Object.assign({},e));
  if(novo.principal)lista.forEach(e=>e.principal=false);
  const i=lista.findIndex(e=>e.id===novo.id);if(i>=0)lista[i]=novo;else lista.push(novo);
  const botao=$('#end-salvar');botao.disabled=true;botao.textContent='Salvando...';
  try{await gravarEnderecos(lista);closeModal();toast('Endereço salvo.','ok');render();}
  catch(e){erro.textContent=e.message||'Não foi possível salvar o endereço.';botao.disabled=false;botao.textContent='Salvar endereço';}
}
async function definirEnderecoPrincipal(id){
  const lista=listaEnderecos().filter(e=>e.id!=='antigo').map(e=>Object.assign({},e,{principal:e.id===id}));
  try{await gravarEnderecos(lista);toast('Endereço principal atualizado.','ok');render();}catch(e){toast(e.message||'Não foi possível atualizar.','err');}
}
async function excluirEndereco(id){
  const lista=listaEnderecos().filter(e=>e.id!==id&&e.id!=='antigo').map(e=>Object.assign({},e));
  try{await gravarEnderecos(lista);toast('Endereço excluído.','ok');render();}catch(e){toast(e.message||'Não foi possível excluir.','err');}
}
/* Escolha do endereço ao contratar: os salvos viram opções; "outro" abre o campo livre. */
function escolherEnderecoContratar(id){
  W.addrId=id;
  if(id==='outro'){W.addr='';render();setTimeout(()=>$('#wAddr')?.focus(),30);return;}
  W.addr=linhaEndereco(listaEnderecos().find(e=>e.id===id));render();
}
function campoEnderecoContratar(){
  const lista=listaEnderecos();
  if(!lista.length)return '<div class="field"><label for="wAddr">Endereço do atendimento</label><input class="input" id="wAddr" placeholder="Rua, número, bairro, cidade" value="'+esc(W.addr||'')+'" oninput="W.addr=this.value"><div class="hint">Dica: salve seus endereços no <a class="lp-auth-link" href="#/painel">Perfil</a> para escolher aqui da próxima vez.</div></div>';
  if(!W.addrId){const p=enderecoPrincipal();W.addrId=p.id;W.addr=linhaEndereco(p);}
  return '<fieldset class="field enderecos-escolha"><legend>Endereço do atendimento</legend><div class="formas">'+
    lista.map(e=>'<label class="forma'+(W.addrId===e.id?' sel':'')+'"><input type="radio" name="wEnd" value="'+e.id+'"'+(W.addrId===e.id?' checked':'')+' onchange="escolherEnderecoContratar(this.value)">'+ic('mapPin')+'<span><b>'+esc(e.apelido||'Endereço')+'</b><small>'+esc(linhaEndereco(e))+'</small></span></label>').join('')+
    '<label class="forma'+(W.addrId==='outro'?' sel':'')+'"><input type="radio" name="wEnd" value="outro"'+(W.addrId==='outro'?' checked':'')+' onchange="escolherEnderecoContratar(this.value)">'+ic('plus')+'<span><b>Outro endereço</b><small>Digitar só para este pedido</small></span></label></div>'+
    (W.addrId==='outro'?'<input class="input" id="wAddr" aria-label="Outro endereço" style="margin-top:12px" placeholder="Rua, número, bairro, cidade" value="'+esc(W.addr||'')+'" oninput="W.addr=this.value">':'')+
    '<a class="lp-auth-link" href="#/painel" style="margin-top:8px">Gerenciar endereços no Perfil</a></fieldset>';
}
/* Busca do CEP no ViaCEP: preenche rua, bairro, cidade e estado. O CEP digitado é enviado a esse serviço. */
let buscaCEPAtual=null;
async function buscarCEP(valor){
  const cep=String(valor).replace(/\D/g,''),status=$('#end-cep-status');
  if(cep.length!==8){if(buscaCEPAtual)buscaCEPAtual.abort();return;}
  if(buscaCEPAtual)buscaCEPAtual.abort();
  const controle=new AbortController();buscaCEPAtual=controle;
  if(status)status.textContent='Buscando o endereço...';
  try{
    const resposta=await fetch('https://viacep.com.br/ws/'+cep+'/json/',{signal:controle.signal});
    if(!resposta.ok)throw new Error('falha');
    const d=await resposta.json();
    if(controle!==buscaCEPAtual)return;
    if(d.erro){if(status)status.textContent='CEP não encontrado. Confira os números ou preencha o endereço à mão.';return;}
    const pores={rua:d.logradouro,bairro:d.bairro,cidade:d.localidade};
    for(const nome in pores){const c=$('#end-'+nome);if(c&&pores[nome])c.value=pores[nome];}
    const uf=$('#end-uf');if(uf&&d.uf)uf.value=d.uf;
    if(status)status.textContent=d.logradouro?'Endereço encontrado. Agora informe o número.':'CEP da cidade inteira: informe a rua e o bairro.';
    (d.logradouro?$('#end-numero'):$('#end-rua'))?.focus();
  }catch(e){
    if(e.name==='AbortError')return;
    if(status)status.textContent='Não foi possível buscar o CEP agora. Preencha o endereço à mão.';
  }finally{if(controle===buscaCEPAtual)buscaCEPAtual=null;}
}
