/* ---------- MODAL ---------- */
let modalOpen=false;
function openModal(html,opts){
  opts=opts||{};
  modalOpen=true;
  $('#modal-root').innerHTML='<div class="modal-bg" data-close><div class="modal'+(opts.className?' '+opts.className:'')+'" style="'+(opts.wide?'max-width:640px':'')+'">'+html+'</div></div>';
  enhanceInteractiveButtons($('#modal-root'));
  $('#modal-root .modal-bg').addEventListener('click',e=>{if(e.target.hasAttribute('data-close'))closeModal();});
  if(opts.onOpen)opts.onOpen();
}
function closeModal(){modalOpen=false;stopFace(false);$('#modal-root').innerHTML='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalOpen)closeModal();});

