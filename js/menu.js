(function(){
var s=document.currentScript,root=s.dataset.root||'',page=s.dataset.page||'',B=document.body,dark=B.classList.contains('dark');
var items=[['Inicio','inicio',''],['Sobre Nosotros','sobre','sobre-nosotros/'],['Proyectos','proyectos','proyectos/'],['Personal','personal','personal/'],['Contactos','contactos','contactos/']];
function logo(cls){var d=dark?'rojo/':'',u=function(n){return root+'assets/'+d+n+'.svg'};
return '<div class="'+cls+'"><div class="logo"><img class="A" alt="Amatsuka" src="'+u('A')+'"><img class="M" alt="" src="'+u('Matsuka')+'"><img class="C" alt="" src="'+u('Creators')+'"></div></div>'}
/* menu + pie */
B.insertAdjacentHTML('afterbegin','<nav>'+(page==='inicio'?'<span></span>':'<a href="'+root+'" class="lg">'+logo('mini')+'</a>')+'<button class="burger" aria-label="Menú" aria-expanded="false"><span></span><span></span><span></span></button><div class="links">'+items.map(function(i,n){return '<a style="--i:'+n+'" href="'+root+i[2]+'"'+(i[1]===page?' class="on"':'')+'>'+i[0]+'</a>'}).join('')+'<a href="#" class="dlb" style="--i:5" data-dl>Descargar<img src="'+root+'assets/'+(dark?'desc-oscuro':'desc')+'.svg" alt=""></a></div></nav>');
B.insertAdjacentHTML('beforeend','<footer><span>©2026 AmatsukaCreators. Todos los derechos reservados.</span><div class="ic">'+['gumboy','ng','esme','kraken'].map(function(n){return '<img src="'+root+'assets/'+n+'.svg" alt="'+n+'">'}).join('')+'</div></footer>');
/* menu hamburguesa (celular) */
var bg=document.querySelector('nav .burger');if(bg)bg.addEventListener('click',function(){var o=document.querySelector('nav').classList.toggle('open');bg.setAttribute('aria-expanded',o)});
/* transición: A.svg + círculo de carga */
var ld=document.createElement('div');ld.className='ld on';var bl=[[10,20,0,'58% 42% 55% 45%/48% 60% 40% 52%'],[52,0,.06,'45% 55% 40% 60%/55% 45% 58% 42%'],[92,26,.12,'60% 40% 52% 48%/42% 58% 42% 58%'],[16,82,.09,'42% 58% 60% 40%/58% 42% 55% 45%'],[60,100,.03,'55% 45% 45% 55%/45% 55% 45% 55%'],[96,90,.15,'50% 50% 58% 42%/60% 40% 52% 48%']];
ld.innerHTML='<div class="blobs">'+bl.map(function(b){return '<i style="left:'+b[0]+'%;top:'+b[1]+'%;--d:'+b[2]+';border-radius:'+b[3]+'"></i>'}).join('')+'</div><img src="'+root+'assets/A.svg" alt=""><div class="ring"></div>';B.appendChild(ld);B.classList.add('ready');
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
function dlHTML(){var D=window.DESCARGAR||{},MP=(D.modpacks&&D.modpacks.length?D.modpacks:[{nombre:'Modery',logo:'assets/modery.svg',link:D.link,fondo:'',boton:D.botonModery,texto:D.textoModery}]).filter(function(m){return m}),
st='--dfondo:'+(D.fondo||'#521c2b')+';--db2:'+(D.botonLauncher||'#a42b34')+';--dtx:'+(D.textoBoton||'#ffe9e0'),
fl=MP.map(function(m,i){return m.fondo?'<div class="fbg" data-f="'+i+'" style="'+bgCSS(m.fondo)+'"></div>':''}).join(''),
bt=MP.map(function(m,i){var l=String(m.link==null?'':m.link).trim(),ok=l&&!/^https?:\/*$/i.test(l),c='--db1:'+esc(m.boton||D.botonModery||'#a42b34'),
inner=(m.logo?'<img src="'+esc(PP(m.logo))+'" alt="'+esc(m.nombre||'')+'" draggable="false">':'<b>'+esc(m.nombre||'')+'</b>')+'<span>'+esc(m.texto==null?'descarga modpack':m.texto)+'</span>';
return ok?'<a class="dbtn b1" data-f="'+i+'" style="'+c+'" href="'+esc(/^(https?:|mailto:)/i.test(l)?l:'https://'+l)+'" target="_blank" rel="noopener">'+inner+'</a>':'<button class="dbtn b1" data-f="'+i+'" data-soon style="'+c+'">'+inner+'</button>'}).join(''),
ln=D.mostrarLauncher===false?'':'<button class="dbtn b2" data-soon><img src="'+root+'assets/launcher.svg" alt="Launcher" draggable="false"><span>'+esc(D.textoLauncher||'')+'</span></button>';
return '<div class="pw dl" style="'+st+'">'+fl+'<div class="bar"><s></s><s></s><s></s></div><div class="slider"><div class="dbtns'+(MP.length+(ln?1:0)>2?' many':'')+'">'+bt+ln+'</div></div></div>'}
/* al pasar sobre un modpack, cambia el fondo de la ventana */
function dlBg(e){var w=e.target.closest&&e.target.closest('.pw.dl');if(!w)return;var b=e.target.closest('.dbtn[data-f]'),k=b?b.dataset.f:null;[].forEach.call(w.querySelectorAll('.fbg'),function(x){x.classList.toggle('on',x.dataset.f===k)})}
document.addEventListener('mouseover',dlBg);document.addEventListener('focusin',dlBg);
/* ventanas emergentes: nada se selecciona ni se arrastra */
['selectstart','dragstart','contextmenu'].forEach(function(n){document.addEventListener(n,function(e){if(e.target.closest&&e.target.closest('.md'))e.preventDefault()})});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-dl],[data-soon]');if(!t)return;
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
if(pe){var ph=(window.PERSONAL||[]).map(function(g){var m=(g.miembros||[]).filter(function(x){return x&&x.nombre&&String(x.nombre).trim()});if(!m.length)return '';
return '<section class="grp"><h3>'+esc(g.rol)+'</h3>'+(g.desc?'<p class="gdesc">'+esc(g.desc)+'</p>':'')+'<div class="cards">'+m.map(function(x){var n=String(x.nombre).trim(),lk=redes(x);return '<div class="win"><div class="bar"><s></s><s></s><s></s></div><div class="ph">'+(x.foto?media(x.foto,n):'<span class="ini">'+esc(n.charAt(0))+'</span>')+'</div><div class="info"><b>'+esc(n)+'</b><small>'+esc(x.desc||g.rol)+'</small>'+lk+'</div></div>'}).join('')+'</div></section>'}).join('');
pe.innerHTML=ph||'<p>Próximamente…</p>'}
var pr=document.querySelector('[data-proyectos]');
if(pr){var L=window.PROYECTOS||[],by={};L.forEach(function(p,i){p._i=i;var y=p.anio||'';(by[y]=by[y]||[]).push(p)});
var ys=Object.keys(by).sort(function(a,b){return b-a});
function est(p){var e=String(p.estado||'').toLowerCase(),k=/termin|listo|final/.test(e)?'ok':/cancel/.test(e)?'ca':'pr',t={ok:'Terminada',pr:'En proceso',ca:'Cancelada'}[k];return '<i class="est '+k+'" title="'+t+'"></i>'}
function big(p){var S=p.slides||[];return '<div class="pw"><div class="bar">'+est(p)+'<s></s><s></s><s></s></div><div class="slider">'+(S.length?S.map(function(s,k){return '<div class="sl'+(k?'':' on')+'">'+media(s,p.titulo)+'</div>'}).join(''):'<span class="ph0">*SLIDER*</span>')+(S.length>1?'<button class="pv" data-d="-1" aria-label="Anterior">‹</button><button class="nx" data-d="1" aria-label="Siguiente">›</button>':'')+'</div><div class="pinfo"><b>'+esc(p.titulo)+'</b><span>'+esc(p.info)+'</span></div><img class="aw" src="'+root+'assets/aw.svg" alt=""></div>'}
pr.innerHTML=ys.map(function(y){return (y?'<h3>'+esc(y)+'</h3>':'')+'<div class="cards">'+by[y].map(function(p){var cv=p.portada||(p.slides&&p.slides[0])||'';return '<div class="win pc" data-i="'+p._i+'" tabindex="0"><div class="bar">'+est(p)+'<s></s><s></s><s></s></div><div class="ph">'+(cv?media(cv,p.titulo):'<span>*foto PROYECTO*</span>')+'<em>'+esc(p.titulo)+'</em></div></div>'}).join('')+'</div>'}).join('');
if(L.length)pr.innerHTML='<div class="leyenda"><span><i class="est ok inl"></i>Terminada</span><span><i class="est pr inl"></i>En proceso</span><span><i class="est ca inl"></i>Cancelada</span></div>'+pr.innerHTML;
else pr.innerHTML='<div class="cards"><div class="win soon"><div class="bar"><s></s><s></s><s></s></div><div class="ph"><span>PRÓXIMAMENTE</span></div></div></div>';
function openM(p){var m=openModal(big(p)),ss=m.querySelectorAll('.sl'),n=0,hv=false;
if(ss.length>1){function go(d){ss[n].classList.remove('on');n=(n+d+ss.length)%ss.length;ss[n].classList.add('on')}
m.addEventListener('click',function(e){var b=e.target.closest('button[data-d]');if(b)go(+b.dataset.d)});
var x0=0;m.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});m.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)go(d<0?1:-1)},{passive:true});
m.addEventListener('mouseenter',function(){hv=true});m.addEventListener('mouseleave',function(){hv=false});
m._t=setInterval(function(){if(!hv)go(1)},p.intervalo||5000)}}
pr.addEventListener('click',function(e){var c=e.target.closest('.pc');if(c)openM(L[+c.dataset.i])});
pr.addEventListener('keydown',function(e){if(e.key==='Enter'){var c=e.target.closest('.pc');if(c)openM(L[+c.dataset.i])}})}
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
var mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,cw=22,ch=22,cr=11,el=null,T='a,button,input,textarea,.win,.card,.pw';
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;el=e.target.closest&&e.target.closest(T);if(el&&el.closest('.md')&&el.matches('.pw,.win'))el=null;dt.style.transform='translate('+mx+'px,'+my+'px)';c.classList.toggle('hov',!!el);dt.style.opacity=el?0:1});
addEventListener('mousedown',function(){c.classList.add('dn')});addEventListener('mouseup',function(){c.classList.remove('dn')});
(function loop(){var tx=mx,ty=my,tw=22,th=22,tr=11;
if(el&&el.isConnected){var r=el.getBoundingClientRect(),p=7;tx=r.left+r.width/2;ty=r.top+r.height/2;tw=r.width+2*p;th=r.height+2*p;if(el._r==null)el._r=parseFloat(getComputedStyle(el).borderTopLeftRadius)||0;tr=el._r+p}
cx+=(tx-cx)*.25;cy+=(ty-cy)*.25;cw+=(tw-cw)*.25;ch+=(th-ch)*.25;cr+=(tr-cr)*.25;
c.style.width=cw+'px';c.style.height=ch+'px';c.style.borderRadius=Math.min(cr,cw/2,ch/2)+'px';c.style.transform='translate('+(cx-cw/2)+'px,'+(cy-ch/2)+'px)';requestAnimationFrame(loop)})()}
})();
