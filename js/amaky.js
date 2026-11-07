/* AMAKY - mascota virtual. Se carga sola desde menu.js en todas las paginas.
   Dibujos: assets/amaky/<animacion>_1.svg y _2.svg (maximo 2 frames por animacion). */
(function(){
'use strict';
if(window.__amaky)return;window.__amaky=1;
var me=document.currentScript,root=(me&&me.getAttribute('data-root'))||'',NS=root+'assets/amaky/';

/* ===== AJUSTES ===== */
var CFG={
 persistirBorrado:true, /* true: si la eliminas sigue borrada al cambiar de pagina y vuelve al RECARGAR (F5). false: vuelve en cualquier carga de pagina */
 dormirMs:24000,        /* sin actividad: se duerme */
 sentarseMs:14000,      /* sin actividad: se sienta */
 distSeguir:88,         /* a que distancia del cursor se detiene */
 velCaminar:62, velCorrer:210
};
var ANIMS=['idle','walk','run','sleep','sit','happy','love','grab','fall','look','scared','dizzy','wave','yawn','cling'];
var DUR={walk:170,run:105,sleep:1150,yawn:650,sit:520,happy:230,love:380,grab:210,look:650,scared:80,dizzy:260,wave:240,cling:260};

/* ===== si fue eliminada ===== */
var reload=false;
try{var nv=performance.getEntriesByType('navigation')[0];reload=nv?nv.type==='reload':!!(performance.navigation&&performance.navigation.type===1)}catch(e){}
try{if(reload)sessionStorage.removeItem('amaky-off');if(CFG.persistirBorrado&&sessionStorage.getItem('amaky-off')==='1')return}catch(e){}

var reduce=false;try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
var HEART="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-12 -10 24 22'%3E%3Cpath d='M0 7C-11 -1 -8 -10 0 -5C8 -10 11 -1 0 7Z' fill='%23ff5c7a' stroke='%23521c2b' stroke-width='1.6' stroke-linejoin='round'/%3E%3C/svg%3E\")";
var S=innerWidth<700?80:96,GY=116/128,BW=innerWidth<700?70:84,BH=BW*130/96,BM=22;

/* ===== estilos ===== */
var st=document.createElement('style');
st.textContent='#amaky,#amaky-sh,#amaky-bin{position:fixed;left:0;top:0;margin:0;pointer-events:none}'
+'#amaky{width:'+S+'px;height:'+S+'px;z-index:7000;pointer-events:auto;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;will-change:transform;transform-origin:50% 25%;cursor:grab}'
+'#amaky.dr{cursor:grabbing}'
+'#amaky .fl,#amaky-bin .fl{position:absolute;inset:0}'
+'#amaky img,#amaky-bin img{position:absolute;inset:0;width:100%;height:100%;display:none;pointer-events:none;-webkit-user-drag:none;user-select:none}'
+'#amaky img.on,#amaky-bin img.on{display:block}'
+'#amaky-sh{width:54px;height:14px;border-radius:50%;background:rgba(0,0,0,.24);z-index:6999;will-change:transform,opacity}'
+'#amaky-bin{right:'+BM+'px;bottom:'+BM+'px;left:auto;top:auto;width:'+BW+'px;height:'+BH+'px;z-index:7001;transform:translateY(190%);transition:transform .42s cubic-bezier(.2,1.25,.4,1)}'
+'#amaky-bin.on{transform:none}'
+'#amaky-bin .fl{transition:transform .2s cubic-bezier(.3,1.5,.5,1);transform-origin:50% 100%}'
+'#amaky-bin.over .fl{transform:scale(1.16) rotate(-5deg)}'
+'#amaky-bin.bump .fl{animation:amkb .45s ease}'
+'@keyframes amkb{30%{transform:scale(1.14,.88)}60%{transform:scale(.94,1.08)}}'
+'.amkh{position:fixed;left:0;top:0;pointer-events:none;z-index:7003;background:'+HEART+' center/contain no-repeat;will-change:transform,opacity}';
document.head.appendChild(st);

/* ===== elementos ===== */
function mk(tag,id,cls){var e=document.createElement(tag);if(id)e.id=id;if(cls)e.className=cls;return e}
var el=mk('div','amaky'),fl=mk('div','',"fl"),sh=mk('div','amaky-sh'),bin=mk('div','amaky-bin'),bfl=mk('div','',"fl"),FR={},BI=[];
el.setAttribute('role','img');el.setAttribute('aria-label','Amaky, la mascota');
ANIMS.forEach(function(a){FR[a]=[1,2].map(function(i){var im=new Image();im.alt='';im.draggable=false;im.src=NS+a+'_'+i+'.svg';fl.appendChild(im);return im})});
[1,2].forEach(function(i){var im=new Image();im.alt='';im.draggable=false;im.src=NS+'caneca_'+i+'.svg';bfl.appendChild(im);BI.push(im)});
BI[0].className='on';bin.appendChild(bfl);el.appendChild(fl);
document.body.appendChild(sh);document.body.appendChild(bin);document.body.appendChild(el);
function lid(open){BI[0].classList.toggle('on',!open);BI[1].classList.toggle('on',!!open)}

/* ===== estado ===== */
var now=performance.now(),last=now,x,y,lift=0,vy=0,rot=0,sc=1,face=1,mode='free',cur='',fi=0,nextF=0,busy=null,
    sleeping=false,sleepAt=0,curX=0,curY=0,curOK=false,lastMove=0,lastAct=now,wT=null,idleUntil=0,
    ptr={x:0,y:0},offX=0,offY=0,dragging=false,downT=0,downX=0,downY=0,over=false,
    shk=0,shkT=0,lastSign=0,dizzyUntil=0,tt=0,fx=0,fy=0,bx=0,by=0,prog=0,pvx=0,
    clingEnd=0,clingCool=0,curMouse=false,heartAt=0,evT=0,ck=0,ckT=0,ckS=0,pcx=0;
var rnd=function(a,b){return a+Math.random()*(b-a)};
function clampPos(){x=Math.min(Math.max(x,S*.4),innerWidth-S*.4);y=Math.min(Math.max(y,S*GY+8),innerHeight-6)}
try{var sp=JSON.parse(sessionStorage.getItem('amaky-pos')||'null');if(sp){x=sp.x*innerWidth;y=sp.y*innerHeight}}catch(e){}
if(x==null||isNaN(x)){x=innerWidth*.18;y=innerHeight-60}
clampPos();

function fdur(n,i){if(n==='idle')return i?140:rnd(2000,4600);if(n==='fall')return 1e9;return DUR[n]||400}
function play(n){if(n===cur)return;if(cur)FR[cur][fi].classList.remove('on');cur=n;fi=0;FR[n][0].classList.add('on');nextF=now+fdur(n,0)}
function setF(i){if(!cur||i===fi)return;FR[cur][fi].classList.remove('on');fi=i;FR[cur][fi].classList.add('on')}
function act(n,ms,then,f){busy={n:n,u:performance.now()+ms,then:then||null,f:f==null?null:f}}

/* ===== dibujo ===== */
function render(){
 var gy=y-lift;
 el.style.transform='translate3d('+(x-S/2)+'px,'+(gy-S*GY)+'px,0) rotate('+rot+'deg) scale('+sc+')';
 fl.style.transform='scaleX('+face+')';
 var k=Math.max(.45,1-lift/90);
 sh.style.transform='translate3d('+(x-27)+'px,'+(y-9)+'px,0) scale('+(k*sc)+')';
 sh.style.opacity=(1-Math.min(.55,lift/80))*(mode==='trash'?1-prog:1);
}
function move(dx,dy,d,sp,dt){var s=Math.min(d,sp*dt);x+=dx/d*s;y+=dy/d*s;if(Math.abs(dx)>5)face=dx>0?1:-1}

/* ===== comportamiento libre ===== */
function freeStep(dt){
 var anim='idle',bob=0;
 if(busy){
  if(now<busy.u){play(busy.n);if(busy.f!=null)setF(busy.f);lift=0;return}
  var th=busy.then;busy=null;if(th){act(th.n,th.ms,th.then,th.f);return}
 }
 var idle=now-lastAct;
 if(sleeping){
  if(lastAct>sleepAt){sleeping=false;act('yawn',1300);return}
  play('sleep');return;
 }
 if(idle>CFG.dormirMs){sleeping=true;sleepAt=now;play('sleep');return}
 if(idle>CFG.sentarseMs){play('sit');return}
 var follow=!reduce&&curOK&&now-lastMove<6000;
 if(follow){
  wT=null;
  var dx=curX-x,dy=curY-(y-S*.4),d=Math.hypot(dx,dy);
  if(d>CFG.distSeguir){
   var run=d>380,sp=(run?CFG.velCorrer:CFG.velCaminar)*Math.min(1,(d-CFG.distSeguir)/90+.4);
   move(dx,dy,d,sp,dt);anim=run?'run':'walk';
  }else{
   anim=(now-lastMove<2500)?'look':'idle';
   if(curMouse&&now-lastMove<2500&&now>clingCool&&Math.random()<dt*.18){startCling();return}
  }
  if(Math.abs(dx)>5&&anim!=='walk'&&anim!=='run')face=dx>0?1:-1;
 }else if(!reduce){
  if(wT){
   var wx=wT.x-x,wy=wT.y-y,wd=Math.hypot(wx,wy);
   if(wd<6){wT=null;idleUntil=now+rnd(2000,5000)}
   else{move(wx,wy,wd,CFG.velCaminar*.85,dt);anim='walk'}
  }else if(now>=idleUntil){
   var r=Math.random();
   if(r<.6)wT={x:rnd(S*.5,innerWidth-S*.5),y:rnd(S+30,innerHeight-10)};
   else if(r<.76)act('sit',rnd(3000,5500));
   else if(r<.86)act('happy',900);
   else if(r<.94)act('look',2400);
   else act('wave',1600);
   if(!wT)idleUntil=now+rnd(1500,3500);
  }
 }
 if(anim==='walk')bob=Math.abs(Math.sin(now*Math.PI/DUR.walk))*3;
 if(anim==='run')bob=Math.abs(Math.sin(now*Math.PI/DUR.run))*5;
 lift=bob;play(anim);clampPos();
}

/* ===== agarrar / soltar ===== */
function inBin(px,py){return px>innerWidth-BM-BW-34&&py>innerHeight-BM-BH-34}
el.addEventListener('pointerdown',function(e){
 if(e.button>0||mode==='trash'||mode==='gone')return;
 e.preventDefault();try{el.setPointerCapture(e.pointerId)}catch(x){}
 mode='drag';dragging=false;busy=null;sleeping=false;wT=null;
 ptr.x=e.clientX;ptr.y=e.clientY;downX=ptr.x;downY=ptr.y;downT=performance.now();lastAct=downT;
 offX=ptr.x-x;offY=ptr.y-(y-lift-S*GY);shk=0;lastSign=0;rot=0;pvx=0;
});
el.addEventListener('pointermove',function(e){
 if(mode!=='drag')return;
 if(dragging&&(e.clientX<0||e.clientY<0||e.clientX>innerWidth||e.clientY>innerHeight)){fallDown();return}
 var dxm=e.clientX-ptr.x;
 if(Math.abs(dxm)>7){var sg=dxm>0?1:-1;if(lastSign&&sg!==lastSign){shk++;shkT=performance.now()}lastSign=sg}
 if(performance.now()-shkT>700)shk=0;
 if(shk>=5){dizzyUntil=performance.now()+2300;shk=0}
 pvx=dxm;ptr.x=e.clientX;ptr.y=e.clientY;lastAct=performance.now();
 if(!dragging&&Math.hypot(ptr.x-downX,ptr.y-downY)>=6){dragging=true;el.classList.add('dr');el.style.zIndex=7002;bin.classList.add('on')}
 if(dragging){over=inBin(ptr.x,ptr.y);bin.classList.toggle('over',over);lid(over)}
});
function release(e){
 if(mode!=='drag')return;
 try{el.releasePointerCapture(e.pointerId)}catch(x){}
 el.classList.remove('dr');
 if(!dragging){ /* solo un clic: corazones */
  mode='free';act('love',1900);return;
 }
 bin.classList.remove('over');
 if(over){toTrash();return}
 bin.classList.remove('on');lid(false);
 mode='drop';vy=0;el.style.zIndex=7000;clampPos();play('fall');setF(0);
}
el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);
['dragstart','contextmenu','selectstart'].forEach(function(n){el.addEventListener(n,function(e){e.preventDefault()})});

function dragStep(dt){
 if(!dragging)return;
 var k=1-Math.pow(.0005,dt);
 offX+=(0-offX)*k;offY+=(S*.2-offY)*k;lift+=(34-lift)*k;
 x=ptr.x-offX;y=ptr.y-offY+S*GY+lift;
 rot+=(Math.max(-16,Math.min(16,pvx*.9))-rot)*k;pvx*=.8;
 if(over)play('scared');else if(now<dizzyUntil)play('dizzy');else play('grab');
}
function dropStep(dt){
 vy+=2300*dt;lift-=vy*dt;rot*=.8;
 if(lift<=0){
  lift=0;rot=0;mode='free';
  var dz=now<dizzyUntil;
  act('fall',420,dz?{n:'dizzy',ms:1900}:{n:'happy',ms:1000},1);
 }else{play('fall');setF(0)}
}

/* ===== a la caneca ===== */
function toTrash(){
 mode='trash';tt=now;fx=x;fy=y;bx=innerWidth-BM-BW/2;by=innerHeight-BM-BH*.55;
 el.style.zIndex=7000;play('scared');lid(true);
}
function trashStep(t){
 prog=Math.min(1,(t-tt)/650);var e=prog*prog;
 x=fx+(bx-fx)*e;y=fy+(by+S*.25-fy)*e;lift=lift*(1-e);rot=e*600;sc=1-.88*e;
 if(prog>=1){
  mode='gone';
  try{if(CFG.persistirBorrado)sessionStorage.setItem('amaky-off','1')}catch(x){}
  el.remove();sh.remove();
  setTimeout(function(){lid(false);bin.classList.add('bump')},120);
  setTimeout(function(){bin.classList.remove('on')},900);
  setTimeout(function(){bin.remove();st.remove()},1500);
 }
}

/* ===== agarrarse del cursor ===== */
function startCling(){
 mode='cling';clingEnd=now+rnd(5000,10000);wT=null;busy=null;ck=0;ckS=0;pcx=curX;
 el.style.pointerEvents='none';el.style.zIndex=7002;play('cling');
}
function clingStep(dt){
 if(!curOK){fallDown();return}
 var k=1-Math.pow(.001,dt);
 lift+=(34-lift)*k;
 x+=(curX-x)*k;y+=((curY-S*.2+S*GY+lift)-y)*k;
 var cvx=(curX-pcx)/Math.max(dt,.001);pcx=curX;
 rot+=(Math.max(-18,Math.min(18,cvx*.015))-rot)*k;
 if(Math.abs(cvx)>60)face=cvx>0?1:-1;
 play('cling');
 if(now>clingEnd)letGoSoft();
}
function letGoSoft(){ /* se suelta y cae un poquito */
 if(mode!=='cling')return;
 mode='drop';vy=0;clingCool=performance.now()+10000;
 el.style.pointerEvents='';el.style.zIndex=7000;clampPos();play('fall');setF(0);
}
function fallDown(){ /* el cursor se fue de la pantalla: cae hasta el suelo */
 if(mode!=='cling'&&!(mode==='drag'&&dragging))return;
 var n=performance.now(),top=y-lift;
 el.classList.remove('dr');bin.classList.remove('on','over');lid(false);over=false;dragging=false;
 x=Math.min(Math.max(x,S*.4),innerWidth-S*.4);
 var floor=innerHeight-8-rnd(0,40);y=Math.max(top,floor);lift=Math.max(0,y-top);
 vy=0;clingCool=n+10000;mode='drop';
 el.style.pointerEvents='';el.style.zIndex=7000;
 if(lift>250)dizzyUntil=n+2500;
 play('fall');setF(0);
}

/* ===== corazoncitos ===== */
function hearts(c){
 var r=el.getBoundingClientRect();
 for(var i=0;i<c;i++)(function(i){
  var h=document.createElement('i'),sz=rnd(14,24),dx=rnd(-34,34),dy=-rnd(60,115),rt=rnd(-25,25);
  h.className='amkh';h.style.width=h.style.height=sz+'px';
  h.style.left=(r.left+r.width/2-sz/2+rnd(-S*.25,S*.25))+'px';h.style.top=(r.top+S*.12+rnd(0,S*.2))+'px';
  document.body.appendChild(h);
  var a=h.animate([{transform:'translate(0,0) scale(.3)',opacity:0},{opacity:1,offset:.2},{transform:'translate('+dx+'px,'+dy+'px) scale(1) rotate('+rt+'deg)',opacity:0}],{duration:rnd(1000,1500),delay:i*90,easing:'ease-out',fill:'both'});
  a.onfinish=function(){h.remove()};
 })(i);
}

/* ===== bucle ===== */
function tick(t){
 if(mode==='gone')return;
 requestAnimationFrame(tick);
 now=t;var dt=Math.min(.05,(t-last)/1000);last=t;
 if(mode==='drag')dragStep(dt);
 else if(mode==='drop')dropStep(dt);
 else if(mode==='trash')trashStep(t);
 else if(mode==='cling')clingStep(dt);
 else freeStep(dt);
 if(cur!=='fall'&&t>=nextF){setF(1-fi);nextF=t+fdur(cur,fi)}
 render();
}

/* ===== cursor y actividad ===== */
addEventListener('pointermove',function(e){
 if(e.pointerType==='touch')return;
 var d=Math.hypot(e.clientX-curX,e.clientY-curY),dtm=e.timeStamp-evT,spd=dtm>0?d/dtm:0,dxm=e.clientX-curX,n=performance.now();
 evT=e.timeStamp;curX=e.clientX;curY=e.clientY;curOK=true;curMouse=true;
 if(d>3){lastMove=n;lastAct=n}
 /* cursor muy rapido por encima de ella: corazoncitos */
 if(mode==='free'&&spd>1.4&&n-heartAt>2200){
  var r=el.getBoundingClientRect();
  if(curX>r.left+8&&curX<r.right-8&&curY>r.top+8&&curY<r.bottom-8){heartAt=n;sleeping=false;busy=null;act('love',1700);hearts(7)}
 }
 /* si la sacudes agarrada del cursor: se marea y se suelta */
 if(mode==='cling'){
  if(Math.abs(dxm)>9){var sg=dxm>0?1:-1;if(ckS&&sg!==ckS){ck++;ckT=n}ckS=sg}
  if(n-ckT>700)ck=0;
  if(ck>=6){ck=0;dizzyUntil=n+2300;letGoSoft()}
 }
},{passive:true});
document.documentElement.addEventListener('mouseleave',function(){curOK=false;fallDown()});
document.addEventListener('mouseout',function(e){if(!e.relatedTarget)fallDown()});
addEventListener('blur',function(){letGoSoft()});
addEventListener('pointerdown',function(e){
 var n=performance.now();lastAct=n;
 if(mode==='cling'&&e.target!==el)letGoSoft(); /* un clic la suelta */
 if(e.pointerType==='touch'&&e.target!==el){curX=e.clientX;curY=e.clientY;curOK=true;curMouse=false;lastMove=n}
},{passive:true,capture:true});
['keydown','wheel','scroll'].forEach(function(n){addEventListener(n,function(){lastAct=performance.now()},{passive:true,capture:true})});
addEventListener('resize',function(){if(mode==='free')clampPos()});
addEventListener('pagehide',function(){if(mode==='gone')return;try{sessionStorage.setItem('amaky-pos',JSON.stringify({x:x/innerWidth,y:y/innerHeight}))}catch(e){}});

/* reacciona al cambio de tema: oscuro = bosteza, claro = feliz */
addEventListener('amaky-tema',function(e){if(mode!=='free'||sleeping)return;if(e.detail==='dark')act('yawn',1400);else act('happy',1000)});
/* aparece saludando */
play('wave');act('wave',1800);
requestAnimationFrame(function(t){last=t;tick(t)});
})();
