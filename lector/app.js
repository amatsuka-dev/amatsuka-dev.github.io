/* =====================================================
   LECTOR AMATSUKA
   - abre archivos .amatsuka (boton, arrastrar, o doble clic una vez instalado como app de Chrome)
   - muestra la plantilla tal cual, con texto editable y seleccionable
   - guarda cada solicitud por codigo en este navegador y le pones su estado
   - exporta estados.json (solo huellas SHA-256) para publicarlo con la pagina
   ===================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)},KEY='amatsuka_lector_v1',E=AMA.ESTADOS;
var LIB={items:{},logos:null,extras:{}},cur=null,tm=0;

/* ---------- almacenamiento ---------- */
try{var j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&j.items)LIB=Object.assign({items:{},logos:null,extras:{}},j)}catch(e){}
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
function aviso(t){var o=$('toast');o.textContent=t;o.classList.add('on');clearTimeout(aviso.t);aviso.t=setTimeout(function(){o.classList.remove('on')},3200)}
function guardar(){try{localStorage.setItem(KEY,JSON.stringify(LIB));return true}catch(e){aviso('No hay espacio en el navegador: guarda un respaldo para no perder datos');return false}}
function later(){clearTimeout(tm);tm=setTimeout(guardar,300)}
function R(){return cur&&LIB.items[cur]||null}
function ahora(){return new Date().toISOString()}
function key(c){return AMA.normCodigo(c)}
function descargar(blob,n){AMA.guardar(blob,n)}

/* ---------- abrir archivos ---------- */
async function abrir(files){
 var ult=null,bad=0;
 for(var i=0;i<files.length;i++){
  var f=files[i];
  if(!/\.amatsuka$/i.test(f.name)){bad++;continue}
  try{
   var o=await AMA.leer(f),k=key(o.codigo),prev=LIB.items[k];
   if(o.logos&&o.logos.A&&o.logos.M&&o.logos.C)LIB.logos=o.logos;delete o.logos;
   if(prev){o.estado=prev.estado;o.nota=prev.nota||o.nota||'';o.estadoFecha=prev.estadoFecha||o.modificado}
   else o.estadoFecha=o.modificado||ahora();
   delete o.stub;LIB.items[k]=o;ult=k;
  }catch(e){bad++;aviso((f.name||'Archivo')+': '+(e.message||'no se pudo abrir'))}
 }
 if(ult){guardar();sel(ult);aviso(files.length>1?'Archivos abiertos':'Plantilla abierta')}
 else if(bad&&files.length&&!files[0].name.match(/\.amatsuka$/i))aviso('Solo se pueden abrir archivos .amatsuka');
}
$('fileIn').addEventListener('change',function(e){var fs=[].slice.call(e.target.files);e.target.value='';abrir(fs)});
if('launchQueue' in window)launchQueue.setConsumer(async function(p){
 if(!p.files||!p.files.length)return;var fs=[];for(var i=0;i<p.files.length;i++)try{fs.push(await p.files[i].getFile())}catch(e){}
 abrir(fs)});
var dd=0;
window.addEventListener('dragover',function(e){e.preventDefault();document.body.classList.add('drop')});
window.addEventListener('dragleave',function(e){if(!e.relatedTarget)document.body.classList.remove('drop')});
window.addEventListener('drop',function(e){e.preventDefault();document.body.classList.remove('drop');var fs=[].slice.call(e.dataTransfer.files||[]);if(fs.length)abrir(fs)});

/* ---------- buscar / crear por codigo ---------- */
$('fCode').addEventListener('submit',function(e){
 e.preventDefault();var inp=$('inCode'),n=key(inp.value);
 if(n.indexOf('AMA')===0)n=n.slice(3);
 if(n.length!==10){aviso('El código debe verse así: AMA-XXXXX-XXXXX');inp.focus();return}
 var c='AMA-'+n.slice(0,5)+'-'+n.slice(5),k=key(c);
 if(!LIB.items[k]){var t=ahora();LIB.items[k]={formato:'amatsuka',version:1,codigo:c,estado:'revision',proyecto:'',descripcion:'',nombre:'',correo:'',contacto:'',creado:t,modificado:t,origen:'',stub:true,estadoFecha:t};guardar();aviso('Código añadido: ya puedes ponerle estado')}
 inp.value='';sel(k);
});

/* ---------- pintar ---------- */
function setT(el,v,ph){var has=!!(v&&v.trim());el.textContent=has?v:ph;el.classList.toggle('hint',!has)}
function logos(){var L=LIB.logos,b=$('cL');b.innerHTML='';
 if(L&&L.A&&L.M&&L.C)['A','M','C'].forEach(function(n){var i=new Image();i.className=n;i.alt='';i.src=L[n];b.appendChild(i)});
 else{var s=document.createElement('span');s.className='tx';s.textContent='AMATSUKA CREATORS';b.appendChild(s)}}
function pintarTarjeta(){
 var r=R(),ed=!!r&&!r.stub;
 setT($('cP'),r&&r.proyecto,r&&r.stub?'Solo tengo el código':'Nombre Del Proyecto');
 setT($('cN'),r&&r.nombre,'tu nombre');
 setT($('cD'),r&&r.descripcion,r&&r.stub?'Abre su archivo .amatsuka para ver la plantilla completa.':'Describe Tu Proyecto');
 ['cP','cN','cD'].forEach(function(i){var el=$(i);el.contentEditable=ed?'plaintext-only':'false';if(ed&&el.contentEditable!=='plaintext-only')el.contentEditable='true'});
 $('cD').scrollTop=0;logos();
 $('cardHint').textContent=ed?'Puedes editar el texto aquí mismo y seleccionarlo para copiarlo.':'Arrastra aquí un archivo .amatsuka para verlo tal cual lo envió la persona.';
}
function pintarEstado(){
 var r=R(),b=$('estB');b.innerHTML='';
 Object.keys(E).forEach(function(k){var x=document.createElement('button');x.type='button';x.dataset.k=k;x.disabled=!r;
  x.className=r&&r.estado===k?'on':'';x.innerHTML='<i style="background:'+E[k].c+'"></i>'+E[k].n;b.appendChild(x)});
 $('vCode').textContent=r?r.codigo:'—';$('bCode').disabled=!r;
 var n=$('nota');n.disabled=!r;if(document.activeElement!==n)n.value=r&&r.nota||'';
 $('estFecha').textContent=r&&r.estadoFecha?'Estado actualizado: '+new Date(r.estadoFecha).toLocaleString('es'):'';
 var ed=!!r&&!r.stub;
 ['mN','mE','mC'].forEach(function(i){$(i).disabled=!ed});
 $('mN').value=r&&r.nombre||'';$('mE').value=r&&r.correo||'';$('mC').value=r&&r.contacto||'';
 $('mMeta').textContent=r?(r.stub?'Solo código (sin archivo todavía).':'Recibido: '+new Date(r.creado).toLocaleString('es')+(r.origen?'\nDesde: '+r.origen:'')):'';
 $('bMail').disabled=!(r&&r.correo);
 ['bSave','bPng','bCopy'].forEach(function(i){$(i).disabled=!ed});
}
function pintarLista(){
 var ul=$('list'),ks=Object.keys(LIB.items).sort(function(a,b){return (LIB.items[b].modificado||'').localeCompare(LIB.items[a].modificado||'')});
 ul.innerHTML='';$('libHint').hidden=ks.length>0;
 ks.forEach(function(k){var r=LIB.items[k],li=document.createElement('li');li.dataset.k=k;if(k===cur)li.className='on';
  li.innerHTML='<span class="dot" style="background:'+E[r.estado].c+'"></span><span class="tx"><b></b><small></small></span><button type="button" title="Quitar de la biblioteca" aria-label="Quitar">✕</button>';
  li.querySelector('b').textContent=r.proyecto||'Solo código';li.querySelector('small').textContent=r.codigo+' · '+E[r.estado].n;ul.appendChild(li)});
}
function pintar(){pintarTarjeta();pintarEstado();pintarLista()}
function sel(k){cur=k;pintar()}

$('list').addEventListener('click',function(e){
 var li=e.target.closest('li');if(!li)return;var k=li.dataset.k;
 if(e.target.closest('button')){if(confirm('¿Quitar esta solicitud de la biblioteca de este navegador?')){delete LIB.items[k];if(cur===k)cur=null;guardar();pintar()}return}
 sel(k)});

/* ---------- edicion ---------- */
function tocar(){var r=R();if(r){r.modificado=ahora();later();pintarLista()}}
function ligar(id,campo,ph,quita){
 var el=$(id);
 el.addEventListener('focus',function(){if(el.classList.contains('hint')&&el.isContentEditable){el.textContent='';el.classList.remove('hint')}});
 el.addEventListener('input',function(){var r=R();if(!r)return;r[campo]=el.innerText.replace(/ /g,' ').replace(/\n$/,'');tocar();pintarEstado()});
 el.addEventListener('blur',function(){var r=R();if(r&&!(r[campo]||'').trim())setT(el,'',ph)});
 el.addEventListener('paste',function(e){if(el.contentEditable==='true'){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text'))}});
}
ligar('cP','proyecto','Nombre Del Proyecto');ligar('cN','nombre','tu nombre');ligar('cD','descripcion','Describe Tu Proyecto');
[['mN','nombre'],['mE','correo'],['mC','contacto']].forEach(function(p){$(p[0]).addEventListener('input',function(){var r=R();if(!r)return;r[p[1]]=this.value;tocar();if(p[1]==='nombre')setT($('cN'),r.nombre,'tu nombre');$('bMail').disabled=!r.correo})});
$('estB').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||!R())return;var r=R();r.estado=b.dataset.k;r.estadoFecha=ahora();r.modificado=r.estadoFecha;guardar();pintarEstado();pintarLista()});
$('nota').addEventListener('input',function(){var r=R();if(!r)return;r.nota=this.value;r.estadoFecha=ahora();r.modificado=r.estadoFecha;later();$('estFecha').textContent='Estado actualizado: '+new Date(r.estadoFecha).toLocaleString('es')});
$('bCode').onclick=function(){var r=R();if(r&&navigator.clipboard)navigator.clipboard.writeText(r.codigo).then(function(){aviso('Código copiado')})};

/* ---------- acciones ---------- */
function actual(){var r=R();return r?{proyecto:r.proyecto,nombre:r.nombre,descripcion:r.descripcion}:null}
$('bSave').onclick=function(){var r=R();if(!r||r.stub)return;var o=AMA.crear(r,LIB.logos);o.estado=r.estado;if(r.nota)o.nota=r.nota;o.codigo=r.codigo;o.creado=r.creado;o.origen=r.origen;descargar(AMA.aBlob(o),AMA.nombreArchivo(o));aviso('Archivo guardado')};
$('bPng').onclick=async function(){var d=actual(),r=R();if(!d||r.stub)return;try{descargar(await AMA.tarjetaPNG(d,{logos:LIB.logos,font:getComputedStyle(document.body).fontFamily}),'tarjeta-'+AMA.slug(r.proyecto)+'.png');aviso('Imagen descargada')}catch(e){aviso('No se pudo crear la imagen')}};
$('bCopy').onclick=function(){
 var r=R();if(!r||r.stub)return;var s=String(getSelection()||'').trim();
 var t=s||[r.proyecto,r.nombre,'',r.descripcion].join('\n').trim();
 if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){aviso(s?'Selección copiada':'Texto copiado')},function(){aviso('No se pudo copiar')});
};
$('bMail').onclick=function(){var r=R();if(!r||!r.correo)return;
 var sub='Tu solicitud '+(r.proyecto?'"'+r.proyecto+'" ':'')+'['+r.codigo+']: '+E[r.estado].n;
 var body='Hola'+(r.nombre?' '+r.nombre:'')+',\n\nEl estado de tu solicitud es: '+E[r.estado].n+'.\n'+(r.nota?'\n'+r.nota+'\n':'')+'\nPuedes consultarlo cuando quieras con tu código '+r.codigo+' en la página de Amatsuka Creators (sección Estado).\n\nAmatsuka Creators';
 location.href='mailto:'+encodeURIComponent(r.correo).replace('%40','@')+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body)};

/* ---------- estados.json y respaldo ---------- */
$('bEst').onclick=function(){$('dlg').showModal()};
$('bExpEst').onclick=async function(){
 var out={version:1,actualizado:ahora(),estados:Object.assign({},LIB.extras)};
 for(var k in LIB.items){var r=LIB.items[k];out.estados[await AMA.huella(r.codigo)]={estado:r.estado,nota:r.nota||'',fecha:r.estadoFecha||r.modificado}}
 descargar(new Blob([JSON.stringify(out,null,1)],{type:'application/json'}),'estados.json');
 aviso('estados.json listo: súbelo a la carpeta estado/ de tu página');
};
$('impEst').addEventListener('change',async function(e){
 var f=e.target.files[0];e.target.value='';if(!f)return;
 try{var j=JSON.parse(await f.text()),n=0;if(!j||typeof j.estados!=='object')throw 0;
  for(var h in j.estados){var x=j.estados[h];if(x&&E[x.estado]){LIB.extras[h]=x;n++}}
  guardar();aviso(n+' estados importados (se conservan al exportar)')}catch(er){aviso('Ese no es un estados.json válido')}});
$('bExpLib').onclick=function(){descargar(new Blob([JSON.stringify({formato:'amatsuka-biblioteca',version:1,guardado:ahora(),items:LIB.items,logos:LIB.logos,extras:LIB.extras})],{type:'application/json'}),'amatsuka-respaldo.json');aviso('Respaldo guardado')};
$('impLib').addEventListener('change',async function(e){
 var f=e.target.files[0];e.target.value='';if(!f)return;
 try{var j=JSON.parse(await f.text());if(!j||j.formato!=='amatsuka-biblioteca'||typeof j.items!=='object')throw 0;
  var n=0;Object.keys(j.items).forEach(function(k){var x=j.items[k],o=LIB.items[k];if(!x||!x.codigo||!E[x.estado])return;if(!o||(x.estadoFecha||'')>(o.estadoFecha||'')){LIB.items[k]=x;n++}});
  if(j.logos&&!LIB.logos)LIB.logos=j.logos;Object.assign(LIB.extras,j.extras||{});guardar();pintar();aviso(n+' solicitudes cargadas')}catch(er){aviso('Ese no es un respaldo válido')}});

/* ---------- instalar como app + service worker ---------- */
var ip=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();ip=e;$('bInst').hidden=false});
$('bInst').onclick=async function(){if(!ip)return;ip.prompt();try{await ip.userChoice}catch(e){}ip=null;$('bInst').hidden=true};
window.addEventListener('appinstalled',function(){$('bInst').hidden=true;aviso('App instalada')});
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(function(){});

pintar();
})();
