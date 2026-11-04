/* ---------- CONTATO ---------- */
function pageContato(){
  return '<section class="section"><div class="wrap"><div class="split">'+
  '<div><span class="eyebrow">'+ic('mail')+' Contato</span><h2 style="margin:14px 0">Vamos conversar</h2>'+
  '<p class="t2">Use o formulario para registrar uma solicitacao de contato. O envio de e-mail ainda nao esta configurado.</p>'+
  '<div style="display:flex;flex-direction:column;gap:14px;margin-top:28px">'+
  [['mail','E-mail','contato@taskgo.com.br'],['wa','WhatsApp','(81) 97337-0508'],['clock','Atendimento','Seg a Sex, 8h às 20h · Emergências 24h']]
  .map(c=>'<div style="display:flex;gap:14px;align-items:center"><div class="ico-box" style="width:42px;height:42px">'+ic(c[0])+'</div>'+
  '<div><span class="muted" style="font-size:.78rem;font-weight:700">'+c[1]+'</span><div style="font-size:.95rem;font-weight:600">'+(c[0]==='wa'?'<a href="https://wa.me/5581973370508" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none">'+c[2]+'</a>':c[2])+'</div></div></div>').join('')+'</div></div>'+
  '<div class="card"><h3 style="margin-bottom:18px">Envie uma mensagem</h3>'+
  '<form id="contact-form" onsubmit="enviarContato(event)">'+
  '<div class="field"><label for="contact-name">Nome</label><input class="input" id="contact-name" name="nome" required maxlength="120" placeholder="Seu nome completo"></div>'+ 
  '<div class="field"><label for="contact-email">E-mail</label><input class="input" id="contact-email" name="email" type="email" required maxlength="254" placeholder="voce@email.com"></div>'+ 
  '<div class="field"><label for="contact-subject">Assunto</label><select class="select" id="contact-subject" name="assunto" required><option>Suporte ao cliente</option><option>Quero ser profissional</option><option>Parcerias / Empresas</option><option>Imprensa</option><option>Outro</option></select></div>'+ 
  '<div class="field"><label for="contact-message">Mensagem</label><textarea class="textarea" id="contact-message" name="mensagem" required maxlength="5000" placeholder="Como podemos ajudar?"></textarea></div>'+ 
  '<div aria-hidden="true" style="position:absolute;left:-10000px"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>'+ 
  '<p id="contact-status" class="hint" aria-live="polite"></p><button id="contact-submit" class="btn btn-grad btn-block">Enviar mensagem '+ic('arrow')+'</button></form></div>'+ 
  '</div></div></section>';
}
async function enviarContato(e){
  e.preventDefault();const form=e.currentTarget,button=$('#contact-submit'),status=$('#contact-status');
  const data=Object.fromEntries(new FormData(form).entries());if(button){button.disabled=true;button.textContent='Enviando...';}if(status)status.textContent='Enviando sua mensagem para registro seguro.';
  try{
    const response=await fetch(API_BASE_URL+'/api/contatos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const result=await response.json().catch(()=>null);
    if(!response.ok)throw new Error(result?.detail||result?.message||(response.status===429?'Limite de envios atingido. Tente novamente mais tarde.':'Nao foi possivel registrar a mensagem.'));
    form.reset();if(status)status.textContent='Mensagem registrada no TaskGo. O encaminhamento por e-mail ainda nao esta configurado.';toast('Mensagem registrada no TaskGo.','ok');
  }catch(error){if(status)status.textContent=error.message||'Falha de conexao. Seus campos foram mantidos para tentar novamente.';toast(error.message||'Falha de conexao. Tente novamente.','err');}
  finally{if(button){button.disabled=false;button.innerHTML='Enviar mensagem '+ic('arrow');}}
}

