/* =====================================================
   AMATSUKA - libreria compartida (formato .amatsuka)
   La usan la pagina de contactos (crea el archivo) y el lector (lo abre).
   Un archivo .amatsuka es JSON en UTF-8:
   { formato:"amatsuka", version:1, codigo, estado, proyecto, descripcion, nombre,
     correo, contacto, creado, modificado, origen, plantilla:{colores}, logos:{A,M,C} }
   ===================================================== */
(function(g){
var AMA={};
AMA.EXT='.amatsuka';
AMA.MIME='application/x-amatsuka';
AMA.COLORES={ventana:'#521c2b',barra:'#301219',punto:'#4b1a28',acento:'#a42b34',texto:'#ffe9e0'};
AMA.ESTADOS={
 revision:{n:'En revisión',c:'#ff9f1a'},
 aprobado:{n:'Aprobado',c:'#2fd16b'},
 cambios:{n:'Necesita cambios',c:'#ffd23f'},
 rechazado:{n:'No aprobado',c:'#ff1f4b'}
};

/* ---------- codigo de solicitud ---------- */
var AB='23456789ABCDEFGHJKMNPQRSTUVWXYZ'; /* sin 0 O 1 I L */
AMA.codigo=function(){
 var a=new Uint8Array(10),s='';
 (g.crypto||g.msCrypto).getRandomValues(a);
 for(var i=0;i<10;i++){s+=AB[a[i]%AB.length];if(i===4)s+='-'}
 return 'AMA-'+s;
};
AMA.normCodigo=function(c){return String(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'')};
AMA.fmtCodigo=function(c){var n=AMA.normCodigo(c);if(n.indexOf('AMA')===0)n=n.slice(3);return n.length===10?'AMA-'+n.slice(0,5)+'-'+n.slice(5):String(c||'').trim().toUpperCase()};

/* ---------- SHA-256 (para guardar solo huellas de los codigos en estados.json) ---------- */
function sha256js(s){
 var b=new TextEncoder().encode(s),n=b.length,pad=((n+9+63)>>6)<<6,w=new Uint8Array(pad);w.set(b);w[n]=128;
 var dv=new DataView(w.buffer);dv.setUint32(pad-4,(n*8)>>>0);dv.setUint32(pad-8,Math.floor(n*8/4294967296));
 var K=[],H=[],p=2;
 while(K.length<64){var ok=true;for(var i=2;i*i<=p;i++)if(p%i===0){ok=false;break}
  if(ok){K.push(Math.floor((Math.cbrt(p)%1)*4294967296)>>>0);if(H.length<8)H.push(Math.floor((Math.sqrt(p)%1)*4294967296)>>>0)}p++}
 var R=function(x,k){return (x>>>k)|(x<<(32-k))};
 for(var o=0;o<pad;o+=64){
  var W=new Array(64),t;for(t=0;t<16;t++)W[t]=dv.getUint32(o+t*4);
  for(t=16;t<64;t++){var a0=R(W[t-15],7)^R(W[t-15],18)^(W[t-15]>>>3),a1=R(W[t-2],17)^R(W[t-2],19)^(W[t-2]>>>10);W[t]=(W[t-16]+a0+W[t-7]+a1)>>>0}
  var a=H[0],bb=H[1],c=H[2],d=H[3],e=H[4],f=H[5],gg=H[6],h=H[7];
  for(t=0;t<64;t++){
   var S1=R(e,6)^R(e,11)^R(e,25),ch=(e&f)^(~e&gg),t1=(h+S1+ch+K[t]+W[t])>>>0,
       S0=R(a,2)^R(a,13)^R(a,22),mj=(a&bb)^(a&c)^(bb&c),t2=(S0+mj)>>>0;
   h=gg;gg=f;f=e;e=(d+t1)>>>0;d=c;c=bb;bb=a;a=(t1+t2)>>>0}
  H=[H[0]+a,H[1]+bb,H[2]+c,H[3]+d,H[4]+e,H[5]+f,H[6]+gg,H[7]+h].map(function(x){return x>>>0});
 }
 return H.map(function(x){return ('00000000'+x.toString(16)).slice(-8)}).join('');
}
AMA._sha256js=sha256js;
AMA.huella=async function(codigo){
 var txt='amatsuka:'+AMA.normCodigo(codigo);
 try{
  if(g.crypto&&g.crypto.subtle){
   var buf=await g.crypto.subtle.digest('SHA-256',new TextEncoder().encode(txt));
   return Array.prototype.map.call(new Uint8Array(buf),function(x){return ('0'+x.toString(16)).slice(-2)}).join('');
  }
 }catch(e){}
 return sha256js(txt);
};

/* ---------- archivo .amatsuka ---------- */
AMA.crear=function(d,logos){
 var ahora=new Date().toISOString();
 return {
  formato:'amatsuka',version:1,
  codigo:d.codigo||AMA.codigo(),
  estado:d.estado||'revision',
  proyecto:String(d.proyecto||'').trim(),
  descripcion:String(d.descripcion||'').trim(),
  nombre:String(d.nombre||'').trim(),
  correo:String(d.correo||'').trim(),
  contacto:String(d.contacto||'').trim(),
  creado:d.creado||ahora,modificado:ahora,
  origen:d.origen||'',
  plantilla:{colores:AMA.COLORES},
  logos:logos||null
 };
};
AMA.validar=function(o){
 if(!o||typeof o!=='object'||o.formato!=='amatsuka')throw new Error('Este archivo no es un .amatsuka válido');
 if(typeof o.version!=='number'||o.version>1)throw new Error('Versión de archivo no compatible');
 var r=AMA.crear(o,o.logos);
 r.codigo=o.codigo?AMA.fmtCodigo(o.codigo):AMA.codigo();
 r.estado=AMA.ESTADOS[o.estado]?o.estado:'revision';
 r.creado=o.creado||r.creado;r.origen=o.origen||'';
 if(o.nota)r.nota=String(o.nota);
 return r;
};
AMA.aBlob=function(o){return new Blob([JSON.stringify(o,null,2)],{type:AMA.MIME})};
AMA.leer=function(file){
 return new Promise(function(ok,no){
  var fr=new FileReader();
  fr.onload=function(){try{ok(AMA.validar(JSON.parse(String(fr.result).replace(/^﻿/,''))))}catch(e){no(e.message?e:new Error('Archivo ilegible'))}};
  fr.onerror=function(){no(new Error('No se pudo leer el archivo'))};
  fr.readAsText(file);
 });
};
AMA.slug=function(s){return (String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'proyecto').slice(0,30)};
AMA.nombreArchivo=function(o){return AMA.slug(o.proyecto)+'-'+AMA.normCodigo(o.codigo).slice(-5).toLowerCase()+AMA.EXT};

/* ---------- logos del sitio embebidos como data URL (el archivo queda autocontenido) ---------- */
AMA.logosDe=async function(root){
 if(AMA._lg&&AMA._lg.root===root)return AMA._lg.v;
 var out={},n=[['A','A'],['M','Matsuka'],['C','Creators']];
 try{
  for(var i=0;i<n.length;i++){
   var r=await fetch(root+'assets/rojo/'+n[i][1]+'.svg');if(!r.ok)return null;
   var t=await r.text();out[n[i][0]]='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(t)));
  }
  AMA._lg={root:root,v:out};return out;
 }catch(e){return null}
};

/* ---------- tarjeta como PNG (igual que la vista previa; crece si el texto es largo) ---------- */
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function wrap(x,text,maxW,maxLines){
 var out=[];String(text).split(/\r?\n/).forEach(function(par){
  var words=par.split(/\s+/).filter(Boolean),line='';
  if(!words.length){out.push('');return}
  words.forEach(function(w){
   while(x.measureText(w).width>maxW){var i=w.length;while(i>1&&x.measureText(w.slice(0,i)).width>maxW)i--;if(line){out.push(line);line=''}out.push(w.slice(0,i));w=w.slice(i)}
   var t=line?line+' '+w:w;if(x.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t});
  out.push(line)});
 if(maxLines&&out.length>maxLines){out=out.slice(0,maxLines);var l=out[maxLines-1];while(l.length&&x.measureText(l+'…').width>maxW)l=l.slice(0,-1);out[maxLines-1]=l+'…'}
 return out}
function loadImg(src){return new Promise(function(r){if(!src)return r(null);var i=new Image();i.onload=function(){r(i)};i.onerror=function(){r(null)};i.src=src})}

/* d: {proyecto,nombre,descripcion}  o:{logos:{A,M,C}|null, font:'css font-family', colores} */
AMA.tarjetaPNG=async function(d,o){
 o=o||{};
 try{await document.fonts.ready}catch(e){}
 var C=Object.assign({},AMA.COLORES,o.colores||{}),FF=o.font||getComputedStyle(document.body).fontFamily,
     cw=1200,u=cw/100,baseH=Math.round(cw*Math.min(2.2,Math.max(979/899,o.ratio||0)));
 var logoOk=o.logos&&o.logos.A&&o.logos.M&&o.logos.C,im=null;
 if(logoOk){im=await Promise.all([o.logos.A,o.logos.M,o.logos.C].map(loadImg));if(!im.every(Boolean))im=null}
 /* medir el texto antes de dibujar */
 var m=document.createElement('canvas').getContext('2d'),maxW=cw-12*u,pre=function(x,fs,em){x.font='400 '+fs+'px '+FF;if('letterSpacing' in x)x.letterSpacing=(em*fs)+'px'};
 var fT=8*u,fN=4.45*u,fD=4.5*u;
 pre(m,fT,.1);var lt=wrap(m,d.proyecto,maxW,2);
 pre(m,fN,.1);var ln=wrap(m,d.nombre,maxW,1);
 pre(m,fD,.08);var ld=wrap(m,d.descripcion,maxW,0);
 var extra=Math.max(0,ld.length-7)*fD*1.45,ch=Math.round(baseH+extra);
 var c=document.createElement('canvas');c.width=cw;c.height=ch;var x=c.getContext('2d');
 rr(x,0,0,cw,ch,104*cw/899);x.save();x.clip();
 x.fillStyle=C.ventana;x.fillRect(0,0,cw,ch);
 x.fillStyle=C.barra;x.fillRect(0,0,cw,11.7*u);
 var pw=8.7*u,ph=2.3*u,py=(11.7*u-ph)/2,px=cw-5.8*u-pw;
 for(var i=2;i>=0;i--){x.fillStyle=i===2?C.acento:C.punto;rr(x,px,py,pw,ph,ph/2);x.fill();px-=pw+3.9*u}
 x.fillStyle=C.texto;x.textAlign='center';x.textBaseline='alphabetic';
 var cx=cw/2,y=11.7*u+2.2*u;
 pre(x,fT,.1);lt.forEach(function(l){y+=fT*1.12;x.fillText(l,cx,y-fT*.22)});
 pre(x,fN,.1);y+=1*u;ln.forEach(function(l){y+=fN*1.2;x.fillText(l,cx,y-fN*.22)});
 pre(x,fD,.08);y+=7*u-fD*.2;ld.forEach(function(l){y+=fD*1.45;x.fillText(l,cx,y-fD*.3)});
 var lw=54*u,lh=lw*243.3/1128,lx=(cw-lw)/2,ly=ch-3*u-lh,s=lw/1128;
 if(im){
  x.drawImage(im[0],lx,ly,273.29*s,184.08*s);
  x.drawImage(im[1],lx+277.99*s,ly+55*s,850.47*s,114.91*s);
  x.drawImage(im[2],lx+599.44*s,ly+174.7*s,529.02*s,68.59*s);
 }else{x.fillStyle=C.acento;x.font='700 '+(5.5*u)+'px '+FF;if('letterSpacing' in x)x.letterSpacing=(.1*5.5*u)+'px';x.fillText('AMATSUKA CREATORS',cx,ch-5*u)}
 x.restore();
 return new Promise(function(res,rej){try{c.toBlob(function(b){b?res(b):rej(new Error('png'))},'image/png')}catch(e){rej(e)}});
};

/* ---------- descargas ---------- */
AMA.guardar=function(blob,name){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500)};

g.AMA=AMA;
})(window);
