/* ---------- CONTATO ---------- */
function formContato(){
  return '<form id="contact-form" onsubmit="enviarContato(event)">'+
  '<div class="form-duas"><div class="field"><label for="contact-name">Nome</label><input class="input" id="contact-name" name="nome" required maxlength="120" autocomplete="name" placeholder="Seu nome completo"></div>'+
  '<div class="field"><label for="contact-email">E-mail</label><input class="input" id="contact-email" name="email" type="email" required maxlength="254" autocomplete="email" placeholder="voce@email.com"></div></div>'+
  '<div class="field"><label for="contact-subject">Assunto</label><select class="select" id="contact-subject" name="assunto" required><option>Quero ser profissional</option><option>Quero participar da validação</option><option>Suporte ao cliente</option><option>Parcerias / Empresas</option><option>Imprensa</option><option>Outro</option></select></div>'+
  '<div class="field"><label for="contact-message">Mensagem</label><textarea class="textarea" id="contact-message" name="mensagem" required maxlength="5000" placeholder="Como podemos ajudar?"></textarea></div>'+
  '<div aria-hidden="true" class="oculto-robo"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>'+
  '<div class="form-envio"><button id="contact-submit" class="btn btn-primary btn-lg"><span>Enviar mensagem</span>'+ic('arrow')+'</button><p id="contact-status" class="form-status" aria-live="polite"></p></div></form>';
}
function pageContato(){
  return '<section class="folha fecho"><div class="wrap fecho-in"><div>'+duo('fale com','a equipe',1)+
  '<p class="corpo">Use o formulário para registrar sua mensagem. Ela fica salva na TaskGO, mas o envio por e-mail ainda não está configurado.</p>'+
  '<ul class="contatos">'+
    '<li><small>E-mail</small>contato@taskgo.com.br</li>'+
    '<li><small>WhatsApp</small><a href="https://wa.me/5581973370508" target="_blank" rel="noopener noreferrer">(81) 97337-0508</a></li>'+
  '</ul></div>'+formContato()+'</div></section>';
}
async function enviarContato(e){
  e.preventDefault();const form=e.currentTarget,button=$('#contact-submit'),status=$('#contact-status');
  const rotulo=button?.querySelector('span');
  const data=Object.fromEntries(new FormData(form).entries());if(button)button.disabled=true;if(rotulo)rotulo.textContent='Enviando...';if(status)status.textContent='Enviando sua mensagem para registro seguro.';
  try{
    const response=await fetch(API_BASE_URL+'/api/contatos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const result=await response.json().catch(()=>null);
    if(!response.ok)throw new Error(result?.detail||result?.message||(response.status===429?'Limite de envios atingido. Tente novamente mais tarde.':'Não foi possível registrar a mensagem.'));
    form.reset();if(status)status.textContent='Mensagem registrada na TaskGO. O envio por e-mail ainda não está configurado.';toast('Mensagem registrada na TaskGO.','ok');
  }catch(error){if(status)status.textContent=error.message||'Falha de conexão. Seus campos foram mantidos para tentar novamente.';toast(error.message||'Falha de conexão. Tente novamente.','err');}
  finally{if(button)button.disabled=false;if(rotulo)rotulo.textContent='Enviar mensagem';}
}
