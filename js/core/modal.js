/* ---------- MODAL ---------- */
let modalOpen=false,modalOrigem=null;
function openModal(html,opts){
  opts=opts||{};
  modalOpen=true;
  if(!$('#modal-root').contains(document.activeElement))modalOrigem=document.activeElement;
  $('#modal-root').innerHTML='<div class="modal-bg" data-close><div class="modal'+(opts.className?' '+opts.className:'')+'" role="dialog" aria-modal="true" tabindex="-1" style="'+(opts.wide?'max-width:640px':'')+'">'+html+'</div></div>';
  $('#modal-root .modal-bg').addEventListener('click',e=>{if(e.target.hasAttribute('data-close'))closeModal();});
  ligarRotulos($('#modal-root'));
  const caixa=$('#modal-root .modal'),titulo=caixa.querySelector('h1,h2,h3');
  if(titulo)caixa.setAttribute('aria-label',titulo.textContent.trim());
  caixa.focus({preventScroll:true});
  if(opts.onOpen)opts.onOpen();
}
function closeModal(){modalOpen=false;$('#modal-root').innerHTML='';if(modalOrigem?.isConnected)modalOrigem.focus();modalOrigem=null;}
document.addEventListener('keydown',e=>{
  if(!modalOpen)return;
  if(e.key==='Escape')return closeModal();
  if(e.key!=='Tab')return;
  /* Mantém o foco do teclado dentro do modal aberto. */
  const caixa=$('#modal-root .modal');if(!caixa)return;
  const itens=[...caixa.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(i=>i.offsetParent!==null);
  if(!itens.length){e.preventDefault();return;}
  const primeiro=itens[0],ultimo=itens[itens.length-1],atual=document.activeElement;
  if(e.shiftKey&&(atual===primeiro||atual===caixa)){e.preventDefault();ultimo.focus();}
  else if(!e.shiftKey&&atual===ultimo){e.preventDefault();primeiro.focus();}
});

