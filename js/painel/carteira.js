/* ---------- CARTEIRA ---------- */
/* No PIX, deposits or withdrawals are available without a provider and ledger. */
function abrirPix(){toast('PIX indisponivel: provedor nao configurado.','err');}
function simularPix(){toast('Recargas desativadas ate a integracao de pagamentos.','err');}
function abrirSaque(){toast('Saques desativados: nenhum saldo financeiro disponivel.','err');}
function confirmarSaque(){toast('Saques desativados: nenhum saldo financeiro disponivel.','err');}
function executarSaque(){toast('Saques desativados: nenhum saldo financeiro disponivel.','err');}
function editarChavePix(){
  const u=me();
  openModal('<div class="modal-head"><div><h3>Chave PIX</h3><p>Use CPF, e-mail, telefone ou chave aleatória.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Tipo da chave</label><select class="select" id="pkType"><option>CPF</option><option>E-mail</option><option>Telefone</option><option>Chave aleatória</option></select></div>'+
  '<div class="field"><label>Chave</label><input class="input" id="pkVal" value="'+esc(u.pixKey||'')+'"></div>'+
  '<button class="btn btn-grad btn-block" onclick="salvarChavePix()">Salvar chave</button>');
}
async function salvarChavePix(){try{await saveUser({pixKey:($('#pkVal')||{}).value});closeModal();toast('Chave PIX atualizada','ok');render();}catch(error){toast(error.message||'Não foi possível salvar a chave.','err');}}
function copiar(t){
  try{navigator.clipboard.writeText(t);}catch(e){}
  toast('Copiado para a área de transferência','ok');
}
