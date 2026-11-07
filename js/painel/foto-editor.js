/* ---------- EDITOR DA FOTO DE PERFIL ----------
   Arrastar posiciona, o controle deslizante aproxima ou afasta.
   A imagem sempre cobre o círculo inteiro: não sobra borda vazia. */
const FOTO_TAM=260,FOTO_SAIDA=320,FOTO_ZOOM_MAX=4;
let fotoEd=null;
function abrirEditorFoto(fonte){
  const img=new Image();
  img.onload=()=>{
    const base=Math.max(FOTO_TAM/img.naturalWidth,FOTO_TAM/img.naturalHeight);
    fotoEd={img,base,zoom:1,x:0,y:0};
    openModal('<div class="modal-head"><div><h3>Ajustar foto</h3><p>Arraste para posicionar. Use o controle para aproximar ou afastar.</p></div><button class="icon-btn" aria-label="Fechar" onclick="closeModal()">'+ic('x')+'</button></div>'+
      '<div class="foto-palco" id="fotoPalco" tabindex="0" role="application" aria-roledescription="editor de foto" aria-label="Posição da foto. Use as setas para mover e as teclas mais e menos para aproximar ou afastar." aria-describedby="fotoEstado">'+
        '<img id="fotoImg" src="'+img.src+'" alt="" draggable="false">'+
        '<span class="foto-mascara" aria-hidden="true"></span></div>'+
      '<div class="foto-zoom">'+
        '<button type="button" class="icon-btn" aria-label="Afastar" onclick="zoomFoto(-.25)"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg></button>'+
        '<label class="leitor" for="fotoZoom">Aproximação</label>'+
        '<input type="range" class="sim-range" id="fotoZoom" min="1" max="'+FOTO_ZOOM_MAX+'" step="0.01" value="1" oninput="definirZoomFoto(+this.value)">'+
        '<button type="button" class="icon-btn" aria-label="Aproximar" onclick="zoomFoto(.25)">'+ic('plus')+'</button></div>'+
      '<p class="leitor" id="fotoEstado" aria-live="polite"></p>'+
      '<div class="foto-acoes"><button type="button" class="btn btn-ghost" onclick="centralizarFoto()">Centralizar</button>'+
      '<button type="button" class="btn btn-primary" id="fotoSalvar" onclick="salvarFotoEditada()">Salvar foto</button></div>',
      {className:'modal-foto',onOpen:ligarEditorFoto});
  };
  img.onerror=()=>toast('Não foi possível abrir esta imagem. Tente outro arquivo.','err');
  img.src=fonte;
}
function limitarFoto(){
  const e=fotoEd,esc=e.base*e.zoom;
  const mx=Math.max(0,(e.img.naturalWidth*esc-FOTO_TAM)/2),my=Math.max(0,(e.img.naturalHeight*esc-FOTO_TAM)/2);
  e.x=Math.min(mx,Math.max(-mx,e.x));e.y=Math.min(my,Math.max(-my,e.y));
}
function desenharFoto(){
  const el=$('#fotoImg');if(!el||!fotoEd)return;
  limitarFoto();
  const e=fotoEd,esc=e.base*e.zoom;
  el.style.width=e.img.naturalWidth*esc+'px';
  el.style.height=e.img.naturalHeight*esc+'px';
  el.style.transform='translate(-50%,-50%) translate('+e.x+'px,'+e.y+'px)';
  const r=$('#fotoZoom');if(r){r.value=e.zoom;r.style.setProperty('--range-progress',((e.zoom-1)/(FOTO_ZOOM_MAX-1)*100)+'%');r.setAttribute('aria-valuetext',Math.round(e.zoom*100)+'%');}
}
function anunciarFoto(){const p=$('#fotoEstado');if(p)p.textContent='Aproximação '+Math.round(fotoEd.zoom*100)+'%';}
function definirZoomFoto(z){
  if(!fotoEd)return;
  const antigo=fotoEd.zoom;fotoEd.zoom=Math.min(FOTO_ZOOM_MAX,Math.max(1,z));
  /* Aproxima em torno do centro do círculo, mantendo o ponto que está no meio. */
  const k=fotoEd.zoom/antigo;fotoEd.x*=k;fotoEd.y*=k;
  desenharFoto();
}
function zoomFoto(passo){definirZoomFoto(fotoEd.zoom+passo);anunciarFoto();}
function centralizarFoto(){fotoEd.x=0;fotoEd.y=0;fotoEd.zoom=1;desenharFoto();anunciarFoto();}
function ligarEditorFoto(){
  const palco=$('#fotoPalco');if(!palco)return;
  desenharFoto();
  let toque=null;
  palco.addEventListener('pointerdown',ev=>{palco.setPointerCapture(ev.pointerId);palco.classList.add('arrastando');toque={px:ev.clientX,py:ev.clientY,x:fotoEd.x,y:fotoEd.y};});
  palco.addEventListener('pointermove',ev=>{if(!toque)return;fotoEd.x=toque.x+ev.clientX-toque.px;fotoEd.y=toque.y+ev.clientY-toque.py;desenharFoto();});
  const soltar=()=>{toque=null;palco.classList.remove('arrastando');};
  palco.addEventListener('pointerup',soltar);palco.addEventListener('pointercancel',soltar);palco.addEventListener('lostpointercapture',soltar);
  palco.addEventListener('wheel',ev=>{ev.preventDefault();definirZoomFoto(fotoEd.zoom*(ev.deltaY<0?1.08:1/1.08));},{passive:false});
  palco.addEventListener('keydown',ev=>{
    const passo=ev.shiftKey?40:10,mov={ArrowLeft:[passo,0],ArrowRight:[-passo,0],ArrowUp:[0,passo],ArrowDown:[0,-passo]}[ev.key];
    if(mov){ev.preventDefault();fotoEd.x+=mov[0];fotoEd.y+=mov[1];desenharFoto();}
    else if(ev.key==='+'||ev.key==='='){ev.preventDefault();zoomFoto(.25);}
    else if(ev.key==='-'){ev.preventDefault();zoomFoto(-.25);}
  });
}
async function salvarFotoEditada(){
  const e=fotoEd;if(!e)return;
  const c=document.createElement('canvas');c.width=c.height=FOTO_SAIDA;
  const esc=e.base*e.zoom,k=FOTO_SAIDA/FOTO_TAM;
  /* Mesmo desenho da prévia, só que em resolução maior. */
  const w=e.img.naturalWidth*esc*k,h=e.img.naturalHeight*esc*k;
  c.getContext('2d').drawImage(e.img,FOTO_SAIDA/2+e.x*k-w/2,FOTO_SAIDA/2+e.y*k-h/2,w,h);
  const botao=$('#fotoSalvar');if(botao){botao.disabled=true;botao.textContent='Salvando...';}
  try{await saveUser({photo:c.toDataURL('image/jpeg',.85)});closeModal();fotoEd=null;toast('Foto de perfil atualizada!','ok');render();}
  catch(erro){toast(erro.message||'Não foi possível salvar a foto.','err');if(botao){botao.disabled=false;botao.textContent='Salvar foto';}}
}
