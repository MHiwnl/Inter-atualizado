/* Identity checks remain disabled until a real provider is configured. */
function faceScan(title,description,callback){
  openModal('<div class="modal-head"><div><h3>'+esc(title)+'</h3><p>'+esc(description)+'</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+ 
    '<div class="card center" style="margin-top:16px;padding:24px"><div class="ico-box" style="margin:0 auto 12px">'+ic('shield')+'</div>'+ 
    '<b>Verifica\u00e7\u00e3o de identidade indispon\u00edvel</b><p class="muted" style="margin-top:8px">Nenhum provedor de verifica\u00e7\u00e3o documental e facial est\u00e1 configurado. Abrir a c\u00e2mera n\u00e3o confirma identidade. Nenhuma imagem ser\u00e1 capturada.</p></div>');
}