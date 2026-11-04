/* ---------- ROTEADOR ---------- */
let route={page:'home',sub:'',q:{}};
function parseHash(){
  const raw=location.hash.replace(/^#\/?/,'');
  const [pathPart,queryPart]=raw.split('?');
  const parts=pathPart.split('/').filter(Boolean);
  const q={};
  if(queryPart)queryPart.split('&').forEach(kv=>{const[a,b]=kv.split('=');q[decodeURIComponent(a)]=decodeURIComponent(b||'');});
  return {page:parts[0]||'home',sub:parts[1]||'',id:parts[2]||'',q};
}
function go(path){location.hash=path;}
window.addEventListener('hashchange',()=>{route=parseHash();window.scrollTo({top:0,behavior:'instant'});render();});

