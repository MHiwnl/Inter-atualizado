/* =========================================================
   MAPA (simulado)
   ========================================================= */
/* Cada pedido gera um mapa diferente: bairro, malha viária, rio, praças e rota próprios */
const BAIRROS=[
  {n:'Boa Viagem',av:['Av. Boa Viagem','Av. Conselheiro Aguiar'],st:['R. Setúbal','R. Bruno Veloso','R. Félix de Brito','R. Barão de Souza Leão'],pk:['Parque Dona Lindu','Praça da Boa Viagem'],ag:'Oceano Atlântico'},
  {n:'Casa Forte',av:['Av. Rui Barbosa','Av. 17 de Agosto'],st:['R. Dom Bosco','R. José Bonifácio','R. Amélia','R. do Espinheiro'],pk:['Praça de Casa Forte','Parque da Jaqueira'],ag:'Rio Capibaribe'},
  {n:'Espinheiro',av:['Av. Rosa e Silva','Av. Norte'],st:['R. do Futuro','R. Joaquim Nabuco','R. Bispo Cardoso Ayres','R. das Graças'],pk:['Praça Chora Menino','Praça do Derby'],ag:'Canal Derby-Tacaruna'},
  {n:'Pina',av:['Av. Herculano Bandeira','Av. Antônio de Góes'],st:['R. Padre Carapuceiro','R. Jorge Couceiro','R. Marquês de Valença','R. do Cupim'],pk:['Parque das Esculturas','Praça do Pina'],ag:'Bacia do Pina'},
  {n:'Madalena',av:['Av. Caxangá','Av. Beira Rio'],st:['R. Benfica','R. José Osório','R. Real da Torre','R. Conde de Irajá'],pk:['Praça Chora Menino','Praça Faria Neves'],ag:'Rio Capibaribe'},
  {n:'Olinda · Casa Caiada',av:['Av. Getúlio Vargas','Av. Ministro Marcos Freire'],st:['R. do Sol','R. Bispo Coutinho','R. 27 de Janeiro','R. de São Bento'],pk:['Praça do Carmo','Horto de Olinda'],ag:'Oceano Atlântico'}
];
function seedNum(str){let s=2166136261>>>0;str=String(str||'taskgo');for(let i=0;i<str.length;i++){s^=str.charCodeAt(i);s=Math.imul(s,16777619)>>>0;}return s;}
function mapSVG(id,seedStr){
  if(!DEMO_MODE)return '<div class="card center" style="padding:50px 24px"><b>Mapa indisponível</b><p class="muted">A API ainda não fornece coordenadas ou rastreamento em tempo real.</p></div>';
  let sd=seedNum(seedStr||id); const rnd=()=>{sd=(Math.imul(sd,1664525)+1013904223)>>>0;return sd/4294967296;};
  const B=BAIRROS[Math.floor(rnd()*BAIRROS.length)];
  const stepX=74+Math.round(rnd()*4)*6, stepY=72+Math.round(rnd()*3)*6;
  const offX=34+Math.round(rnd()*3)*8, offY=30+Math.round(rnd()*3)*8;
  const xs=[],ys=[];
  for(let x=offX;x<=800;x+=stepX)xs.push(x);
  for(let y=offY;y<=500;y+=stepY)ys.push(y);
  const avX=xs[2+Math.floor(rnd()*2)], avY=ys[2+Math.floor(rnd()*2)];
  /* rota: do canto inferior esquerdo até um ponto mais acima/à direita, sempre por ruas */
  const i0=Math.floor(rnd()*2), j0=ys.length-1-Math.floor(rnd()*2);
  const i2=xs.length-2-Math.floor(rnd()*2), j2=Math.floor(rnd()*2);
  const j2b=(ys[j2]<86)?j2+1:j2;
  const i1=Math.min(i2-1,i0+2+Math.floor(rnd()*2)), j1=Math.max(j2b+1,j0-2-Math.floor(rnd()*2));
  const P=(i,j)=>[xs[Math.max(0,Math.min(xs.length-1,i))],ys[Math.max(0,Math.min(ys.length-1,j))]];
  const a=P(i0,j0),b=P(i1,j0),c=P(i1,j1),e=P(i2,j1),f=P(i2,j2b);
  const d='M'+a[0]+' '+a[1]+' H'+b[0]+' V'+c[1]+' H'+e[0]+' V'+f[1];
  const dest=f;
  /* água: lado oposto ao destino */
  const lado=dest[1]<250?(rnd()>.5?'baixo':'esq'):'cima';
  const agua=lado==='baixo'?'M-40 470 C120 430 260 500 420 468 C560 440 700 500 840 470 L840 560 L-40 560 Z'
            :lado==='esq' ?'M-40 60 C40 140 60 260 30 380 C10 450 -10 500 -20 540 L-40 540 Z M-40 60 L-40 540 Z'
            :'M-40 -20 L840 -20 L840 40 C700 88 560 30 420 62 C260 98 120 26 -40 62 Z';
  const parks=[];
  for(let k=0;k<2;k++){
    const pi=1+Math.floor(rnd()*(xs.length-3)), pj=Math.floor(rnd()*(ys.length-2));
    if(Math.abs(xs[pi]-dest[0])<stepX&&Math.abs(ys[pj]-dest[1])<stepY)continue;
    parks.push([xs[pi],ys[pj],stepX,stepY,B.pk[k%B.pk.length]]);
  }
  let o='<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">';
  o+='<defs><filter id="gl'+id+'" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  o+='<rect width="800" height="500" fill="var(--map-land)"/>';
  o+=parks.map(k=>'<rect x="'+(k[0]+7)+'" y="'+(k[1]+7)+'" width="'+(k[2]-14)+'" height="'+(k[3]-14)+'" rx="10" fill="var(--map-park)"/>').join('');
  for(let i=0;i<24&&parks.length;i++){const k=parks[i%parks.length];
    o+='<circle cx="'+(k[0]+16+rnd()*(k[2]-32)).toFixed(0)+'" cy="'+(k[1]+16+rnd()*(k[3]-32)).toFixed(0)+'" r="'+(2.5+rnd()*3).toFixed(1)+'" fill="var(--map-land)" opacity=".45"/>';}
  /* quadras */
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){
    const bx=xs[i],by=ys[j],bw=xs[i+1]-bx,bh=ys[j+1]-by;
    if(parks.some(k=>bx===k[0]&&by===k[1]))continue;
    const n=2+Math.floor(rnd()*3);
    for(let k=0;k<n;k++){
      const w=15+rnd()*(bw*.42),ht=12+rnd()*(bh*.4);
      o+='<rect x="'+(bx+9+rnd()*Math.max(2,bw-18-w)).toFixed(0)+'" y="'+(by+9+rnd()*Math.max(2,bh-18-ht)).toFixed(0)+'" width="'+w.toFixed(0)+'" height="'+ht.toFixed(0)+'" rx="2" fill="var(--map-bldg)"/>';
    }
  }
  o+='<path d="'+agua+'" fill="var(--map-water)"/>';
  const minor=xs.map(x=>'M'+x+' -10 V510').concat(ys.map(y=>'M-10 '+y+' H810')).join(' ');
  const main='M'+avX+' -10 V510 M-10 '+avY+' H810';
  o+='<path d="'+minor+'" fill="none" stroke="var(--map-road-casing)" stroke-width="13"/>';
  o+='<path d="'+minor+'" fill="none" stroke="var(--map-road)" stroke-width="9"/>';
  o+='<path d="'+main+'" fill="none" stroke="var(--map-road-casing)" stroke-width="26"/>';
  o+='<path d="'+main+'" fill="none" stroke="var(--map-road)" stroke-width="20"/>';
  const occupiedLabels=[];
  const lb=(x,y,t,r)=>{
    const width=Math.max(20,String(t).length*6.2);
    const box=r?{l:x-8,r:x+5,t:y-width-2,b:y+5}:{l:x-2,r:x+width,t:y-12,b:y+5};
    const overlaps=occupiedLabels.some(a=>box.l<a.r+5&&box.r+5>a.l&&box.t<a.b+4&&box.b+4>a.t);
    if(overlaps)return '';
    occupiedLabels.push(box);
    return '<text x="'+x+'" y="'+y+'" font-size="11" font-weight="600" fill="var(--map-label)" stroke="var(--map-land)" stroke-width="3" stroke-linejoin="round" paint-order="stroke" letter-spacing=".03em"'+(r?' transform="rotate('+r+' '+x+' '+y+')"':'')+'>'+t+'</text>';
  };
  const extraStreets=B.n.indexOf('Olinda')===0
    ?['R. do Amparo','R. Prudente de Morais','R. do Bonfim','R. do Guadalupe']
    :['R. das Flores','R. da Aurora','R. do Progresso','R. da Paz'];
  const streetNames=B.st.concat(extraStreets),usedStreetNames=new Set();
  const streetLabel=(x,y,r)=>{
    for(const name of streetNames){
      if(usedStreetNames.has(name))continue;
      const label=lb(x,y,name,r);
      if(label){usedStreetNames.add(name);return label;}
    }
    return '';
  };
  o+=lb(avX+4,Math.max(70,avY-stepY),B.av[0],-90)+lb(Math.max(24,avX-250),avY+4,B.av[1]);
  xs.forEach((x,i)=>{if(i%2===1&&x!==avX)o+=streetLabel(x+4,avY-stepY*1.6,-90);});
  ys.forEach((y,j)=>{if(j%2===0&&y!==avY)o+=streetLabel(xs[1]+14,y+4);});
  parks.forEach(k=>{o+=lb(k[0]+13,k[1]+26,k[4]);});
  o+='<text x="'+(lado==='cima'?420:lado==='esq'?24:400)+'" y="'+(lado==='cima'?34:lado==='esq'?300:496)+'" font-size="11" font-style="italic" fill="var(--map-label)" opacity=".9"'+(lado==='esq'?' transform="rotate(-80 24 300)"':'')+'>'+B.ag+'</text>';
  o+='<path d="'+d+'" fill="none" stroke="var(--map-road-casing)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>';
  o+='<path id="rt'+id+'" d="'+d+'" fill="none" stroke="#3288ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#gl'+id+')"/>';
  o+='<path id="rtDone'+id+'" d="'+d+'" fill="none" stroke="#20d3a2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 10000"/>';
  o+='<g><circle cx="'+dest[0]+'" cy="'+dest[1]+'" r="18" fill="#2f8bff" opacity=".16"/>'+
     '<path d="M'+dest[0]+' '+(dest[1]-19)+'a12 12 0 0 0-12 12c0 8.5 12 20 12 20s12-11.5 12-20a12 12 0 0 0-12-12Z" fill="#2f8bff" stroke="#fff" stroke-width="2.5"/>'+
     '<circle cx="'+dest[0]+'" cy="'+(dest[1]-7)+'" r="3.8" fill="#fff"/>'+
     '<rect x="'+(dest[0]-52)+'" y="'+(dest[1]-52)+'" width="104" height="23" rx="8" fill="var(--map-road)" stroke="var(--map-road-casing)"/>'+ 
     '<text x="'+dest[0]+'" y="'+(dest[1]-36)+'" font-size="11" font-weight="700" text-anchor="middle" fill="var(--map-label)">Destino</text></g>';
  o+='<g id="mk'+id+'"><circle r="20" fill="#20d3a2" opacity=".22"><animate attributeName="r" values="14;26;14" dur="2.2s" repeatCount="indefinite"/></circle>'+ 
     '<circle r="11" fill="#20d3a2" stroke="#fff" stroke-width="3"/></g>';
  o+='<g opacity=".75"><line x1="26" y1="470" x2="96" y2="470" stroke="var(--map-label)" stroke-width="2"/>'+
     '<line x1="26" y1="465" x2="26" y2="475" stroke="var(--map-label)" stroke-width="2"/>'+
     '<line x1="96" y1="465" x2="96" y2="475" stroke="var(--map-label)" stroke-width="2"/>'+
     '<text x="61" y="462" font-size="10" text-anchor="middle" fill="var(--map-label)">200 m</text>'+
     '<text x="788" y="492" font-size="9.5" text-anchor="end" fill="var(--map-label)">TaskGO Maps · '+B.n+'</text></g>';
  return o+'</svg>';
}
function placeMarker(id,t){
  if(id==='live'&&window.trackingRouteMarker&&window.trackingRoutePoints){
    const points=window.trackingRoutePoints;
    const progress=Math.max(0,Math.min(1,Number(t)||0));
    const passed=[points[0]],remaining=[points[0]];
    let total=0;
    for(let i=1;i<points.length;i++)total+=window.trackingLeafletMap.distance(points[i-1],points[i]);
    let distanceLeft=total*progress,current=points[0],split=false;
    for(let i=0;i<points.length-1;i++){
      const from=points[i],to=points[i+1],length=window.trackingLeafletMap.distance(from,to);
      if(split){remaining.push(to);continue;}
      if(distanceLeft>=length){passed.push(to);current=to;distanceLeft-=length;continue;}
      const ratio=length?distanceLeft/length:0;
      current=[from[0]+(to[0]-from[0])*ratio,from[1]+(to[1]-from[1])*ratio];
      if(ratio>0)passed.push(current);
      remaining.splice(0,remaining.length,current,to);
      split=true;
    }
    if(!split){current=points[points.length-1];remaining.splice(0,remaining.length,current);}
    window.trackingRouteMarker.setLatLng(current);
    if(window.trackingDoneLine)window.trackingDoneLine.setLatLngs(passed);
    if(window.trackingRemainingLine)window.trackingRemainingLine.setLatLngs(remaining);
    return;
  }
  const p=document.getElementById('rt'+id),m=document.getElementById('mk'+id);
  if(!p||!m||!p.getTotalLength)return;
  const progress=Math.max(0,Math.min(1,Number(t)||0));
  const L=p.getTotalLength(),pt=p.getPointAtLength(L*progress);
  m.setAttribute('transform','translate('+pt.x+','+pt.y+')');
  const done=document.getElementById('rtDone'+id);
  if(done)done.setAttribute('stroke-dasharray',(L*progress)+' '+L);
}

/* Mapa real do acompanhamento: tiles OpenStreetMap e rota fictícia em Recife. */
function initTrackingMap(orderId,progress){
  if(!DEMO_MODE)return;
  const container=document.getElementById('mapa-rastreio');
  if(!container)return;
  if(!window.L){container.innerHTML=mapSVG('live',orderId);return;}
  if(window.trackingLeafletMap){window.trackingLeafletMap.remove();window.trackingLeafletMap=null;}
  window.trackingRouteMarker=null;window.trackingDoneLine=null;window.trackingRemainingLine=null;
  window.trackingRoutePoints=[
    [-8.0476,-34.9002],
    [-8.0512,-34.8968],
    [-8.0551,-34.8968],
    [-8.0551,-34.8927],
    [-8.0601,-34.8895]
  ];
  container.replaceChildren();
  const map=window.L.map(container,{
    scrollWheelZoom:false,
    doubleClickZoom:false,
    zoomControl:true
  });
  window.trackingLeafletMap=map;
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);
  const points=window.trackingRoutePoints;
  window.trackingRemainingLine=window.L.polyline(points,{color:'#24d3b2',weight:5,opacity:.98,lineCap:'round',lineJoin:'round'}).addTo(map);
  window.trackingDoneLine=window.L.polyline([points[0]],{color:'#20d3a2',weight:5,opacity:1,lineCap:'round',lineJoin:'round'}).addTo(map);
  window.trackingRouteMarker=window.L.circleMarker(points[0],{
    radius:10,color:'#fff',weight:3,fillColor:'#20d3a2',fillOpacity:1
  }).addTo(map).bindTooltip('Profissional',{direction:'top',offset:[0,-8]});
  window.L.marker(points[points.length-1]).addTo(map).bindTooltip('Cliente',{direction:'top',offset:[0,-28]});
  map.fitBounds(window.L.latLngBounds(points),{padding:[42,42]});
  placeMarker('live',progress||0);
  requestAnimationFrame(()=>map.invalidateSize());
}

