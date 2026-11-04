/* ---------- UTIL ---------- */
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const money=n=>'R$ '+Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const dt=ts=>new Date(ts).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})+' · '+new Date(ts).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
function maskCPF(v){v=String(v).replace(/\D/g,'').slice(0,11);return v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');}
function maskPhone(v){v=String(v).replace(/\D/g,'').slice(0,11);if(v.length<=10)return v.replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{4})(\d)/,'$1-$2');return v.replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2');}
function avatar(user,size){
  size=size||40;
  const st='width:'+size+'px;height:'+size+'px;font-size:'+(size*.36)+'px';
  if(user&&user.photo)return '<img class="avatar" style="'+st+'" src="'+user.photo+'" alt="">';
  return '<div class="avatar" style="'+st+'">'+esc(initials(user?user.name:'?'))+'</div>';
}
function stars(n){let h='';for(let i=0;i<5;i++)h+='<svg viewBox="0 0 24 24" style="opacity:'+(i<Math.round(n)?1:.25)+'">'+I.star+'</svg>';return '<span class="stars">'+h+'</span>';}
function toast(msg,type){
  const t=document.createElement('div');
  t.className='toast '+(type||'');
  t.innerHTML=ic(type==='err'?'x':'checkCircle')+'<span>'+esc(msg)+'</span>';
  $('#toasts').appendChild(t);
  setTimeout(()=>{t.style.transition='.3s';t.style.opacity='0';t.style.transform='translateX(20px)';setTimeout(()=>t.remove(),320);},3200);
}

