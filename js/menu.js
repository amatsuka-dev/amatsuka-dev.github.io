(function(){
var s=document.currentScript,root=s.dataset.root||'',page=s.dataset.page||'',B=document.body,dark=B.classList.contains('dark');
var items=[['Inicio','inicio',''],['Sobre Nosotros','sobre','sobre-nosotros/'],['Proyectos','proyectos','proyectos/'],['Personal','personal','personal/'],['Contactos','contactos','contactos/']];
function logo(cls){var d='rojo/',u=function(n){return root+'assets/'+d+n+'.svg'};
return '<div class="'+cls+'"><div class="logo"><img class="A" alt="Amatsuka" src="'+u('A')+'"><img class="M" alt="" src="'+u('Matsuka')+'"><img class="C" alt="" src="'+u('Creators')+'"></div></div>'}
/* menu + pie */
B.insertAdjacentHTML('afterbegin','<nav>'+(page==='inicio'?'<span></span>':'<a href="'+root+'" class="lg">'+logo('mini')+'</a>')+'<button class="burger" aria-label="Menú" aria-expanded="false"><span></span><span></span><span></span></button><div class="links">'+items.map(function(i,n){return '<a style="--i:'+n+'" href="'+root+i[2]+'"'+(i[1]===page?' class="on"':'')+'>'+i[0]+'</a>'}).join('')+'<a href="#" class="dlb" style="--i:5" data-dl>Descargar<img src="'+root+'assets/'+'desc'+'.svg" alt=""></a><button type="button" class="thm" data-thm style="--i:6"><svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><span class="lbl"></span></button></div></nav>');
/* modo claro / oscuro (se recuerda en el navegador) */
var DH=document.documentElement;
function paintT(){var d=DH.getAttribute('data-theme')==='dark',b=document.querySelector('[data-thm]');if(!b)return;var t=d?'Modo claro':'Modo oscuro';b.setAttribute('aria-label',t);b.title=t;b.querySelector('.lbl').textContent=t}
paintT();
var thmBusy=false,thmRM=false;try{thmRM=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function applyT(t){DH.setAttribute('data-theme',t);try{localStorage.setItem('tema',t)}catch(x){}paintT();try{dispatchEvent(new CustomEvent('amaky-tema',{detail:t}))}catch(x){}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-thm]');if(!b||thmBusy)return;
var t=DH.getAttribute('data-theme')==='dark'?'light':'dark';
b.classList.remove('sw');void b.offsetWidth;b.classList.add('sw');setTimeout(function(){b.classList.remove('sw')},800);
if(thmRM){applyT(t);return}
var r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,W=innerWidth,H=innerHeight,rad=Math.hypot(Math.max(cx,W-cx),Math.max(cy,H-cy)),D=700,EA='cubic-bezier(.4,0,.2,1)';
thmBusy=true;
if(document.startViewTransition){
 /* revelado circular desde el boton (la pagina nueva se pinta sola en GPU) */
 DH.classList.add('vt');
 var vt=document.startViewTransition(function(){applyT(t)});
 vt.ready.then(function(){DH.animate({clipPath:['circle(0px at '+cx+'px '+cy+'px)','circle('+rad+'px at '+cx+'px '+cy+'px)']},{duration:D,easing:EA,pseudoElement:'::view-transition-new(root)'})}).catch(function(){});
 vt.finished.finally(function(){DH.classList.remove('vt');thmBusy=false});
}else{
 /* respaldo: circulo que crece (solo transform) y al final cambia el tema */
 var o=document.createElement('div');o.className='thv';o.style.cssText='position:fixed;left:'+(cx-rad)+'px;top:'+(cy-rad)+'px;width:'+(rad*2)+'px;height:'+(rad*2)+'px;border-radius:50%;z-index:8500;pointer-events:none;will-change:transform;background:'+(t==='dark'?'#1a0a0e':'#fff');
 document.body.appendChild(o);
 var a=o.animate({transform:['scale(0)','scale(1)']},{duration:D,easing:EA,fill:'forwards'});
 a.onfinish=function(){applyT(t);requestAnimationFrame(function(){o.animate({opacity:[1,0]},{duration:200}).onfinish=function(){o.remove();thmBusy=false}})};
}
});
B.insertAdjacentHTML('beforeend','<footer><span>©2026 AmatsukaCreators. Todos los derechos reservados.</span><div class="ic">'+['gumboy','ng','esme','kraken'].map(function(n){return '<img src="'+root+'assets/'+n+'.svg" alt="'+n+'">'}).join('')+'</div></footer>');
/* menu hamburguesa (celular) */
var bg=document.querySelector('nav .burger');if(bg)bg.addEventListener('click',function(){var o=document.querySelector('nav').classList.toggle('open');bg.setAttribute('aria-expanded',o)});
/* transición: A.svg + círculo de carga */
var ld=document.createElement('div');ld.className='ld on';var bl=[[10,20,0,'58% 42% 55% 45%/48% 60% 40% 52%'],[52,0,.06,'45% 55% 40% 60%/55% 45% 58% 42%'],[92,26,.12,'60% 40% 52% 48%/42% 58% 42% 58%'],[16,82,.09,'42% 58% 60% 40%/58% 42% 55% 45%'],[60,100,.03,'55% 45% 45% 55%/45% 55% 45% 55%'],[96,90,.15,'50% 50% 58% 42%/60% 40% 52% 48%']];
ld.innerHTML='<div class="blobs">'+bl.map(function(b){return '<i style="left:'+b[0]+'%;top:'+b[1]+'%;--d:'+b[2]+';border-radius:'+b[3]+'"></i>'}).join('')+'</div><img src="'+root+'assets/rojo/A.svg" alt=""><div class="ring"></div>';B.appendChild(ld);B.classList.add('ready');
/* logo animado del inicio */
var h=document.querySelector('[data-hero]');
if(h){h.innerHTML=logo('stage');var st=h.firstChild,lg=st.firstChild;
function fit(){var k=Math.min(1,innerWidth*.8/1128);lg.style.transform='scale('+k+')';st.style.width=1128*k+'px';st.style.height=243.3*k+'px'}
fit();addEventListener('resize',fit)}
/* sonidos (sintetizados, sin archivos) */
var AC,on=true;try{on=localStorage.getItem('snd')!=='0'}catch(e){}
function ctx(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
function tone(f,t,d,ty,v,f2){if(!on)return;var a=ctx();if(!a||a.state!=='running')return;var o=a.createOscillator(),g=a.createGain(),n=a.currentTime+t;o.type=ty||'sine';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(v||.08,n+.01);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.02)}
var SND={hover:function(){tone(900,0,.06,'sine',.04,1200)},click:function(){tone(500,0,.09,'triangle',.09,800);tone(1000,.05,.1,'sine',.05)},go:function(){tone(180,0,.6,'sawtooth',.04,1400);tone(400,.1,.5,'sine',.06,1800)},hi:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*.09,.25,'sine',.06)})},a:function(){tone(110,0,.5,'sine',.15,60)},m:function(){tone(220,0,.9,'triangle',.06,880)},c:function(){tone(900,0,.5,'sine',.07,300)}};
var TT='a,button,input,textarea,.win,.card,.pw',lastH=null;
addEventListener('pointerdown',ctx);addEventListener('keydown',ctx);
document.addEventListener('mouseover',function(e){var t=e.target.closest&&e.target.closest(TT);if(t&&t.closest('.md')&&t.matches('.pw,.win'))t=null;if(t&&t!==lastH)SND.hover();lastH=t});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest(TT);if(t&&!(t.closest('.md')&&t.matches('.pw,.win')))SND.click()});
/* proyectos y personal desde datos.js */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function PP(s){return /^(https?:|\/|data:)/.test(s)?s:root+s}
function media(s,al){if(!s)return '';s=PP(s);return /\.(mp4|webm|ogv|mov)(\?|$)/i.test(s)?'<video src="'+s+'" autoplay muted loop playsinline></video>':'<img src="'+s+'" alt="'+esc(al)+'">'}
/* ventanas emergentes (se pueden apilar) */
var stack=[];
function closeM(){var m=stack.pop();if(!m)return;clearInterval(m._t);m.classList.remove('on');if(!stack.length)B.style.overflow='';setTimeout(function(){m.remove()},350)}
function openModal(html,cls,keep){if(!keep)while(stack.length)closeM();var m=document.createElement('div');m.className='md';m.style.zIndex=8000+stack.length;m.innerHTML='<div class="mw '+(cls||'')+'">'+html.replace('<s></s></div>','<s class="x" data-x title="Cerrar"></s></div>')+'</div>';B.appendChild(m);B.style.overflow='hidden';stack.push(m);requestAnimationFrame(function(){m.classList.add('on')});m.addEventListener('click',function(e){if(e.target===m||e.target.closest('[data-x]'))closeM()});return m}
addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
/* descargar: ventana con Modery y Launcher (se configura en datos.js) */
function bgCSS(f){f=String(f||'').trim();if(!f)return '';return /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)|^(https?:|data:)/i.test(f)?'background:#000 url('+esc(PP(f))+') center/cover no-repeat':'background:'+esc(f)}
function dlHTML(mode){var D=window.DESCARGAR||{},AG0=D.agruparModpacks!==false&&mode!=='mods'&&!document.querySelector('[data-descargar]');function vis(m){return mode==='mods'?!!m.ventana:!AG0}var MP=(D.modpacks&&D.modpacks.length?D.modpacks:[{nombre:'Modery',logo:'assets/modery.svg',link:D.link,fondo:'',boton:D.botonModery,texto:D.textoModery}]).filter(function(m){return m}),
st='--dfondo:'+(D.fondo||'#521c2b')+';--db2:'+(D.botonLauncher||'#a42b34')+';--dtx:'+(D.textoBoton||'#ffe9e0'),
fl=MP.map(function(m,i){return (vis(m)&&m.fondo)?'<div class="fbg" data-f="'+i+'" style="'+bgCSS(m.fondo)+'"></div>':''}).join(''),
bt=MP.map(function(m,i){if(!vis(m))return '';var l=String(m.link==null?'':m.link).trim(),ok=l&&!/^https?:\/*$/i.test(l),c='--db1:'+esc(m.boton||D.botonModery||'#a42b34'),
inner=(m.logo?'<img src="'+esc(PP(m.logo))+'" alt="'+esc(m.nombre||'')+'" draggable="false">':'<b>'+esc(m.nombre||'')+'</b>')+'<span>'+esc(m.texto==null?'descarga modpack':m.texto)+'</span>';
return ok?'<a class="dbtn b1" data-f="'+i+'" data-cat="'+esc(m.categoria||'')+'" style="'+c+'" href="'+esc(/^(https?:|mailto:)/i.test(l)?l:'https://'+l)+'" target="_blank" rel="noopener">'+inner+'</a>':'<button class="dbtn b1" data-f="'+i+'" data-cat="'+esc(m.categoria||'')+'" data-soon style="'+c+'">'+inner+'</button>'}).join(''),
AG=AG0,ln=(D.mostrarLauncher===false||mode==='mods')?'':'<button class="dbtn b2" data-soon><img src="'+root+'assets/launcher.svg" alt="Launcher" draggable="false"><span>'+esc(D.textoLauncher||'')+'</span></button>';
if(AG)bt+='<button class="dbtn b1" data-mods style="--db1:'+esc(D.botonModpacks||(MP[0]||{}).boton||'#a42b34')+'"><img src="'+esc(PP(D.logoBotonModpacks||'assets/modery.svg'))+'" alt="'+esc(D.nombreBotonModpacks||'Modery')+'" draggable="false"><span>'+esc(D.textoBotonModpacks==null?'descarga modpack':D.textoBotonModpacks)+'</span></button>';
if(mode==='mods'&&!bt)bt='<div class="vacio">'+esc(D.mensajeLauncher||'PRÓXIMAMENTE')+'</div>';
var CT=(D.categorias&&D.categorias.length)?D.categorias:[],dt=(mode==='mods'&&CT.length)?'<div class="dtools"><button class="dfil" data-dfil title="Filtrar por categoría" aria-label="Filtrar"><img src="'+root+'assets/filtro.svg" alt="" draggable="false"></button><div class="dchips"><button data-dc="" class="on">Todas</button>'+CT.map(function(c){return '<button data-dc="'+esc(c)+'">'+esc(c)+'</button>'}).join('')+'</div></div>':'';
return '<div class="pw dl" style="'+st+'">'+fl+'<div class="bar"><s></s><s></s><s></s></div>'+dt+'<div class="slider"><div class="dbtns'+(MP.filter(vis).length+(AG?1:0)+(ln?1:0)>2?' many':'')+'">'+bt+ln+'</div></div></div>'}
/* al pasar sobre un modpack, cambia el fondo de la ventana */
function dlBg(e){var w=e.target.closest&&e.target.closest('.pw.dl');if(!w)return;var b=e.target.closest('.dbtn[data-f]'),k=b?b.dataset.f:null;[].forEach.call(w.querySelectorAll('.fbg'),function(x){x.classList.toggle('on',x.dataset.f===k)})}
document.addEventListener('mouseover',dlBg);document.addEventListener('focusin',dlBg);
/* ventanas emergentes: nada se selecciona ni se arrastra */
['selectstart','dragstart','contextmenu'].forEach(function(n){document.addEventListener(n,function(e){if(e.target.closest&&e.target.closest('.md'))e.preventDefault()})});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-dl],[data-soon],[data-mods]');if(!t)return;
if(t.hasAttribute('data-mods')){var m=openModal(dlHTML('mods'),'',true);m.addEventListener('click',function(ev){var f=ev.target.closest('[data-dfil]');if(f){f.classList.toggle('on',m.querySelector('.dchips').classList.toggle('on'));return}var ch=ev.target.closest('[data-dc]');if(!ch)return;var k=ch.dataset.dc;[].forEach.call(m.querySelectorAll('[data-dc]'),function(x){x.classList.toggle('on',x===ch)});[].forEach.call(m.querySelectorAll('.dbtn[data-cat]'),function(b){b.style.display=(!k||b.dataset.cat===k)?'':'none'});m.querySelector('.dchips').classList.remove('on');m.querySelector('[data-dfil]').classList.remove('on')});return}
if(t.hasAttribute('data-dl')){e.preventDefault();openModal(dlHTML())}
else openModal('<div class="win soonw"><div class="bar"><s></s><s></s><s></s></div><div class="ph"><span>'+esc((window.DESCARGAR||{}).mensajeLauncher||'PRÓXIMAMENTE')+'</span></div></div>','sm',true)});
var dp=document.querySelector('[data-descargar]');if(dp)dp.innerHTML=dlHTML();
/* botones de redes: solo aparecen los que tengan link (y icono) */
var RED=[['instagram','Instagram'],['twitter','Twitter'],['patreon','Patreon'],['coffee','Coffee'],['web','Web']];
function href(u){u=String(u==null?'':u).trim();if(!u||/^https?:\/*$/i.test(u))return '';return /^(https?:|mailto:)/i.test(u)?u:'https://'+u}
function redes(x){var o=[];RED.forEach(function(r){o.push({i:'assets/redes/'+r[0]+'.svg',u:x[r[0]],t:r[1]})});
(x.otros||[]).forEach(function(r){if(r&&r.icono)o.push({i:r.icono,u:r.url,t:r.titulo||''})});
o=o.filter(function(r){return href(r.u)});
return o.length?'<div class="lks">'+o.map(function(r){return '<a href="'+esc(href(r.u))+'" target="_blank" rel="noopener" title="'+esc(r.t)+'" aria-label="'+esc(r.t)+'"><img src="'+PP(r.i)+'" alt=""></a>'}).join('')+'</div>':''}
var pe=document.querySelector('[data-personal]');
if(pe){var ph=(window.PERSONAL||[]).map(function(g){function gh(x){return x&&(x.invisible||x.vacio)}var m=(g.miembros||[]).filter(function(x){return gh(x)||(x&&x.nombre&&String(x.nombre).trim())});if(!m.some(function(x){return !gh(x)}))return '';
return '<section class="grp"><h3>'+esc(g.rol)+'</h3>'+(g.desc?'<p class="gdesc">'+esc(g.desc)+'</p>':'')+'<div class="cards">'+m.map(function(x){if(gh(x))return '<div class="win ghost" aria-hidden="true"></div>';var n=String(x.nombre).trim(),lk=redes(x);return '<div class="win"><div class="bar"><s></s><s></s><s></s></div><div class="ph">'+(x.foto?media(x.foto,n):'<span class="ini">'+esc(n.charAt(0))+'</span>')+'</div><div class="info"><b>'+esc(n)+'</b><small>'+esc(x.desc||g.rol)+'</small>'+lk+'</div></div>'}).join('')+'</div></section>'}).join('');
pe.innerHTML=ph||'<p>Próximamente…</p>'}
var pr=document.querySelector('[data-proyectos]');
if(pr){var L=window.PROYECTOS||[],by={},NR=L.filter(function(p){return p&&!(p.invisible||p.vacio)}).length;L.forEach(function(p,i){p._i=i;var y=p.anio||'';(by[y]=by[y]||[]).push(p)});
var ys=Object.keys(by).sort(function(a,b){return b-a});
function est(p){var e=String(p.estado||'').toLowerCase(),k=/termin|listo|final/.test(e)?'ok':/cancel/.test(e)?'ca':'pr',t={ok:'Terminada',pr:'En proceso',ca:'Cancelada'}[k];return '<i class="est '+k+'" title="'+t+'"></i>'}
function big(p){var S=p.slides||[];return '<div class="pw"><div class="bar">'+est(p)+'<s></s><s></s><s></s></div><div class="slider">'+(S.length?S.map(function(s,k){return '<div class="sl'+(k?'':' on')+'">'+media(s,p.titulo)+'</div>'}).join(''):'<span class="ph0">*SLIDER*</span>')+(S.length>1?'<button class="pv" data-d="-1" aria-label="Anterior">‹</button><button class="nx" data-d="1" aria-label="Siguiente">›</button>':'')+'</div><div class="pinfo"><b>'+esc(p.titulo)+'</b><span>'+esc(p.info)+'</span></div><img class="aw" src="'+root+'assets/aw.svg" alt=""></div>'}
pr.innerHTML=ys.map(function(y){return '<div class="yg">'+(y?'<h3>'+esc(y)+'</h3>':'')+'<div class="cards">'+by[y].map(function(p){if(p.invisible||p.vacio)return '<div class="win ghost" aria-hidden="true"></div>';var cv=p.portada||(p.slides&&p.slides[0])||'';return '<div class="win pc" data-i="'+p._i+'" tabindex="0"><div class="bar">'+est(p)+'<s></s><s></s><s></s></div><div class="ph">'+(cv?media(cv,p.titulo):'<span>*foto PROYECTO*</span>')+'<em>'+esc(p.titulo)+'</em></div></div>'}).join('')+'</div></div>'}).join('');
if(NR)pr.innerHTML='<div class="leyenda"><span><i class="est ok inl"></i>Terminada</span><span><i class="est pr inl"></i>En proceso</span><span><i class="est ca inl"></i>Cancelada</span></div>'+pr.innerHTML;
else pr.innerHTML='<div class="cards"><div class="win soon"><div class="bar"><s></s><s></s><s></s></div><div class="ph"><span>PRÓXIMAMENTE</span></div></div></div>';
function openM(p){var m=openModal(big(p)),ss=m.querySelectorAll('.sl'),n=0,hv=false;
if(ss.length>1){function go(d){ss[n].classList.remove('on');n=(n+d+ss.length)%ss.length;ss[n].classList.add('on')}
m.addEventListener('click',function(e){var b=e.target.closest('button[data-d]');if(b)go(+b.dataset.d)});
var x0=0;m.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});m.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)go(d<0?1:-1)},{passive:true});
m.addEventListener('mouseenter',function(){hv=true});m.addEventListener('mouseleave',function(){hv=false});
m._t=setInterval(function(){if(!hv)go(1)},p.intervalo||5000)}}
pr.addEventListener('click',function(e){var c=e.target.closest('.pc');if(c)openM(L[+c.dataset.i])});
pr.addEventListener('keydown',function(e){if(e.key==='Enter'){var c=e.target.closest('.pc');if(c)openM(L[+c.dataset.i])}})}
/* cronologia, vistas, filtros y proyectos a futuro */
var ce=document.querySelector('[data-cronologia]'),CR=window.CRONOLOGIA||{},CI=(CR.items||[]).filter(function(x){return x&&(x.titulo||x.img||x.fecha)}),cat='',vista='tarjetas',PL=window.PROYECTOS||[];
function pz(w){if(w._pz)return;w._pz=1;var t=w.querySelector('.tl'),s=1,x=0,y=0,P={},d0=1,mv=0,cap=null;
function ap(){t.style.transform='translate('+x+'px,'+y+'px) scale('+s+')'}
function cl(){var W=w.clientWidth,H=w.clientHeight,tw=t.offsetWidth*s,th=t.offsetHeight*s,m=80;x=Math.min(W-m,Math.max(m-tw,x));y=Math.min(H-m,Math.max(m-th,y))}
function fit(){s=1;var W=w.clientWidth,H=w.clientHeight,tw=t.offsetWidth,th=t.offsetHeight;x=tw<W?(W-tw)/2:14;y=Math.max(0,(H-th)/2);ap()}
function rel(cx,cy){var r=w.getBoundingClientRect(),k=r.width/(w.clientWidth||1)||1;return [(cx-r.left)/k,(cy-r.top)/k]}
function zoom(cx,cy,f){var ns=Math.min(4,Math.max(.3,s*f));f=ns/s;x=cx-(cx-x)*f;y=cy-(cy-y)*f;s=ns;cl();ap()}
w.addEventListener('wheel',function(e){e.preventDefault();var r=rel(e.clientX,e.clientY);zoom(r[0],r[1],Math.exp(-e.deltaY*(e.deltaMode?.05:.0015)))},{passive:false});
w.addEventListener('pointerdown',function(e){mv=0;if(e.target.closest('.tz'))return;P[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(P);if(k.length===2){var a=P[k[0]],b=P[k[1]];d0=Math.hypot(a.x-b.x,a.y-b.y)||1}});
w.addEventListener('pointermove',function(e){var p=P[e.pointerId];if(!p)return;var k=Object.keys(P);
if(k.length===1){var dx=e.clientX-p.x,dy=e.clientY-p.y;mv+=Math.abs(dx)+Math.abs(dy);if(mv>6){x+=dx;y+=dy;cl();ap();w.classList.add('grab');if(cap==null){try{w.setPointerCapture(e.pointerId);cap=e.pointerId}catch(_){}}}p.x=e.clientX;p.y=e.clientY}
else if(k.length===2){p.x=e.clientX;p.y=e.clientY;var a=P[k[0]],b=P[k[1]],d=Math.hypot(a.x-b.x,a.y-b.y)||1,c=rel((a.x+b.x)/2,(a.y+b.y)/2);zoom(c[0],c[1],d/d0);d0=d;mv=99}});
function up(e){delete P[e.pointerId];if(!Object.keys(P).length){w.classList.remove('grab');cap=null}}
w.addEventListener('pointerup',up);w.addEventListener('pointercancel',up);
w.addEventListener('click',function(e){if(mv>6){e.preventDefault();e.stopPropagation();mv=0}},true);
w.addEventListener('click',function(e){var b=e.target.closest('[data-z]');if(!b)return;var z=+b.dataset.z;if(!z)fit();else zoom(w.clientWidth/2,w.clientHeight/2,z>0?1.25:.8)});
w.addEventListener('dblclick',function(e){if(!e.target.closest('.tz'))fit()});
w.addEventListener('dragstart',function(e){e.preventDefault()});
fit()}
function ico(n,t){return '<img src=\"'+root+'assets/'+n+'.svg\" alt=\"'+t+'\" draggable=\"false\">'}
function tlHTML(it){return '<div class=\"tlw\"><div class=\"tl\">'+it.map(function(x,i){var up=i%2===0,inf=(x.fecha?'<div class=\"tf\">'+esc(x.fecha)+'</div>':'')+(x.etiqueta?'<div class=\"tg\">'+esc(x.etiqueta)+'</div>':''),
tt='<div class=\"tt\">'+(x.logo?'<img src=\"'+esc(PP(x.logo))+'\" alt=\"'+esc(x.titulo||'')+'\">':esc(x.titulo||''))+'</div>',
lk=String(x.link==null?'':x.link).trim(),md=x.img?media(x.img,x.titulo):'<div class=\"tph\"></div>',
mid=lk?'<a class=\"tm\" href=\"'+esc(/^(https?:|mailto:)/i.test(lk)?lk:PP(lk))+'\" target=\"_blank\" rel=\"noopener\">'+md+'</a>':'<div class=\"tm\">'+md+'</div>';
return '<div class=\"tc\"><div class=\"tu\">'+(up?inf+'<i></i>':tt)+'</div>'+mid+'<div class=\"td\">'+(up?tt:'<i></i>'+inf)+'</div></div>'}).join('')+'</div><div class=\"tz\"><button data-z=\"1\" title=\"Acercar\">+</button><button data-z=\"-1\" title=\"Alejar\">−</button><button data-z=\"0\" title=\"Restablecer\">⟲</button></div><span class=\"tzh\">Rueda: zoom · Arrastra: mover · Doble clic: restablecer</span></div>'}
function drawCrono(){if(!ce)return;var it=CI.filter(function(x){return !cat||String(x.categoria||'')===cat}),hd=(CR.titulo?'<h3>'+esc(CR.titulo)+'</h3>':'')+(CR.texto?'<p>'+esc(CR.texto)+'</p>':'');
ce.innerHTML='<section class=\"crono\">'+hd+(it.length?tlHTML(it):'<p>No hay elementos en esta categoría.</p>')+'</section>';[].forEach.call(ce.querySelectorAll('.tlw'),pz)}
function applyF(){if(!pr)return;var all=!cat;
[].forEach.call(pr.querySelectorAll('.yg'),function(g){var n=0;[].forEach.call(g.querySelectorAll('.win'),function(w){var gh=w.classList.contains('ghost'),sh=gh?all:(all||(w.dataset.i!=null&&(PL[+w.dataset.i]||{}).categoria===cat));w.style.display=sh?'':'none';if(sh&&!gh)n++});g.style.display=(all||n)?'':'none'});
pr.style.display=vista==='tarjetas'?'':'none';if(ce){ce.style.display=vista==='crono'?'':'none';if(vista==='crono')drawCrono()}
[].forEach.call(document.querySelectorAll('.ptools [data-v]'),function(b){b.classList.toggle('on',b.dataset.v===vista)});
var fb=document.querySelector('.ptools [data-filtro]');if(fb)fb.classList.toggle('on',!!cat)}
if(pr){var cats=[];PL.concat(CI).forEach(function(x){if(x&&!(x.invisible||x.vacio)&&x.categoria&&cats.indexOf(String(x.categoria))<0)cats.push(String(x.categoria))});
if(ce)ce.style.display='none';
if(CI.length||cats.length){var wr=document.createElement('div'),cl=document.createElement('div'),tb=document.createElement('div');wr.className='pl';cl.className='pcol';tb.className='ptools';
pr.parentNode.insertBefore(wr,pr);wr.appendChild(cl);cl.appendChild(pr);if(ce)cl.appendChild(ce);wr.appendChild(tb);
tb.innerHTML='<button data-menu title="Menú" aria-label="Menú">'+ico('rayas','Menú')+'</button><div class="pg">'+(CI.length?'<button data-v="tarjetas" class="on" title="Tarjetas" aria-label="Tarjetas">'+ico('ventan','Tarjetas')+'</button><button data-v="crono" title="Línea cronológica" aria-label="Línea cronológica">'+ico('lineac','Línea cronológica')+'</button>':'')+(cats.length?'<button data-filtro title="Filtrar por categoría" aria-label="Filtrar">'+ico('filtro','Filtrar')+'</button>':'')+'</div>';
tb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
if(b.hasAttribute('data-menu')){b.classList.toggle('on',tb.classList.toggle('open'));return}
if(b.hasAttribute('data-v')){vista=b.dataset.v;applyF();return}
if(b.hasAttribute('data-filtro')){var m=openModal('<div class=\"win futw\"><div class=\"bar\"><s></s><s></s><s></s></div><div class=\"fbody\"><h3>Filtrar por categoría</h3><div class=\"pcat\"><button data-c=\"\"'+(cat?'':' class=\"on\"')+'>Todas</button>'+cats.map(function(c){return '<button data-c=\"'+esc(c)+'\"'+(c===cat?' class=\"on\"':'')+'>'+esc(c)+'</button>'}).join('')+'</div></div></div>','sm');
m.addEventListener('click',function(ev){var c=ev.target.closest('[data-c]');if(!c)return;cat=c.dataset.c;applyF();closeM()})}})}}
var fe=document.querySelector('[data-futuros]');
if(fe){var F=window.FUTUROS||{};fe.innerHTML='<button class=\"futbtn\" data-fut>'+esc(F.boton||'Proyectos a futuro')+'</button>';
fe.addEventListener('click',function(e){if(!e.target.closest('[data-fut]'))return;
var it=(F.items||[]).filter(function(x){return x&&(x.titulo||x.img)}),fv='lista';
function lista(){return '<div class=\"fl\">'+it.map(function(x){return '<div class=\"fi\">'+(x.img?'<div class=\"fim\">'+media(x.img,x.titulo)+'</div>':'')+'<div class=\"ft\">'+(x.fecha?'<small>'+esc(x.fecha)+'</small>':'')+'<b>'+esc(x.titulo||'')+'</b>'+(x.info?'<p>'+esc(x.info)+'</p>':'')+'</div></div>'}).join('')+'</div>'}
function cont(){return it.length?(fv==='crono'?tlHTML(it):lista()):'<div class=\"ph\"><span>'+esc(F.mensaje||'PRÓXIMAMENTE')+'</span></div>'}
var m=openModal('<div class=\"win futw\"><div class=\"bar\"><s></s><s></s><s></s></div><div class=\"fbody\">'+(F.titulo?'<h3>'+esc(F.titulo)+'</h3>':'')+(it.length?'<div class=\"ptools row\"><button data-fv=\"lista\" class=\"on\" title=\"Lista\" aria-label=\"Lista\">'+ico('ventan','Lista')+'</button><button data-fv=\"crono\" title=\"Línea cronológica\" aria-label=\"Línea cronológica\">'+ico('lineac','Línea cronológica')+'</button></div>':'')+'<div class=\"fcont\">'+cont()+'</div></div></div>','fut');
m.addEventListener('click',function(ev){var b=ev.target.closest('[data-fv]');if(!b)return;fv=b.dataset.fv;m.querySelector('.fcont').innerHTML=cont();var tw=m.querySelector('.tlw');if(tw)pz(tw);[].forEach.call(m.querySelectorAll('[data-fv]'),function(x){x.classList.toggle('on',x===b)})})})}
/* animaciones al hacer scroll */
var rv=[].slice.call(document.querySelectorAll('main h1,main h2,main h3,main p,.card,.win,.pw,form,.head'));
rv.forEach(function(e,i){e.classList.add('rv');e.style.transitionDelay=(i%4)*.09+'s'});
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12}):null;
function start(){SND.hi();if(h){SND.a();setTimeout(SND.m,600);setTimeout(SND.c,1500)}ld.classList.remove('on');B.classList.add('go');rv.forEach(function(e){io?io.observe(e):e.classList.add('in')})}
if(document.readyState==='complete')setTimeout(start,250);else addEventListener('load',function(){setTimeout(start,250)});
/* cambio de página con transición */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a||!a.href||a.target||e.metaKey||e.ctrlKey||e.shiftKey)return;
var u=new URL(a.href);if(!/^(https?|file):$/.test(u.protocol)||u.origin!==location.origin||u.href.split('#')[0]===location.href.split('#')[0])return;
e.preventDefault();SND.go();B.classList.add('leaving');ld.classList.add('on');setTimeout(function(){location.href=a.href},620)});
addEventListener('pageshow',function(e){if(e.persisted){ld.classList.remove('on');B.classList.remove('leaving')}});
/* cursor que se adapta a la forma del botón */
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
var c=document.createElement('div'),dt=document.createElement('div');c.className='cur';dt.className='dot';B.appendChild(c);B.appendChild(dt);document.documentElement.classList.add('nocur');
var idle=false,mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,cw=22,ch=22,cr=11,el=null,T='a,button,input,textarea,.win,.card,.pw,#amaky';
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;el=e.target.closest&&e.target.closest(T);if(el&&el.closest('.md')&&el.matches('.pw,.win'))el=null;dt.style.transform='translate('+mx+'px,'+my+'px)';c.classList.toggle('hov',!!el);dt.style.opacity=el?0:1});
addEventListener('mousedown',function(){c.classList.add('dn')});addEventListener('mouseup',function(){c.classList.remove('dn')});
(function loop(){var tx=mx,ty=my,tw=22,th=22,tr=11;
if(el&&el.isConnected){var r=el.getBoundingClientRect(),p=7;tx=r.left+r.width/2;ty=r.top+r.height/2;tw=r.width+2*p;th=r.height+2*p;if(el._r==null)el._r=parseFloat(getComputedStyle(el).borderTopLeftRadius)||0;tr=el._r+p}
var dl=Math.abs(tx-cx)+Math.abs(ty-cy)+Math.abs(tw-cw)+Math.abs(th-ch)+Math.abs(tr-cr);if(dl<.05&&idle){requestAnimationFrame(loop);return}idle=dl<.05;
cx+=(tx-cx)*.25;cy+=(ty-cy)*.25;cw+=(tw-cw)*.25;ch+=(th-ch)*.25;cr+=(tr-cr)*.25;
c.style.width=cw+'px';c.style.height=ch+'px';c.style.borderRadius=Math.min(cr,cw/2,ch/2)+'px';c.style.transform='translate('+(cx-cw/2)+'px,'+(cy-ch/2)+'px)';requestAnimationFrame(loop)})()}
/* mascota virtual Amaky */
var am=document.createElement('script');am.src=root+'js/amaky.js';am.setAttribute('data-root',root);document.body.appendChild(am);
})();
