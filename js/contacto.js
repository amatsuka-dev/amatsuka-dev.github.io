/* =====================================================
   CONTACTOS: formulario + vista previa + envio de la tarjeta (PNG) y del archivo .amatsuka
   (la configuracion -correo, discord- esta en js/datos.js, bloque CONTACTO)
   ===================================================== */
(function(){
var C=window.CONTACTO||{},ROOT='../';
var CORREO=C.correo||'amatsukacreators@gmail.com',DISCORD=C.discord||'',ASUNTO=C.asunto||'Nueva plantilla de proyecto - Amatsuka Creators';
var $=function(i){return document.getElementById(i)};
var f={p:$('fp'),d:$('fd'),n:$('fn'),e:$('fe'),c:$('fc')},btn=$('fb'),form=$('cf');
var LABEL=btn.textContent,busy=false,ultimo=null;

/* ---- enlaces de contacto ---- */
$('ic-mail').href='mailto:'+CORREO;
var dc=$('ic-dc');if(DISCORD)dc.href=DISCORD;else{dc.removeAttribute('target');dc.title='Discord (pronto)'}

/* ---- vista previa en vivo (la descripcion tiene scroll y sigue al final mientras escribes) ---- */
function put(el,v,ph){v=v.trim();el.textContent=v||ph;el.classList.toggle('hint',!v);el.classList.toggle('val',!!v)}
function upd(){
 put($('pp'),f.p.value,'Nombre Del Proyecto');put($('pn'),f.n.value,'tu nombre');
 var pd=$('pd'),atEnd=document.activeElement===f.d&&f.d.selectionStart>=f.d.value.length-1;
 put(pd,f.d.value,'Describe Tu Proyecto');
 if(atEnd)pd.scrollTop=pd.scrollHeight;
}
var raf=0;function sched(){if(!raf)raf=requestAnimationFrame(function(){raf=0;upd()})}
['p','d','n','e','c'].forEach(function(k){f[k].addEventListener('input',function(){f[k].classList.remove('bad');sched();if(!busy&&btn.textContent!==LABEL)btn.textContent=LABEL})});
upd();

function say(t,ms){btn.textContent=t;if(ms)setTimeout(function(){if(!busy)btn.textContent=LABEL},ms)}
function estadoURL(o){try{return new URL('../estado/?c='+encodeURIComponent(o.codigo),location.href).href}catch(e){return 'estado/'}}
function mensajeCodigo(o){return 'Guarda este código: con él puedes consultar en cualquier momento si tu proyecto está en revisión, aprobado o no aprobado, aquí: '+estadoURL(o)}
var ovl=$('res'),rs=$('rs');
function estadoMsg(t,cls){rs.textContent=t||'';rs.className='rs'+(cls?' '+cls:'')}
function cerrar(){ovl.hidden=true;document.body.classList.remove('ovl-on')}
function mostrar(o){
 ultimo=o;$('rc').textContent=o.codigo;$('rm').textContent=mensajeCodigo(o);$('rst').href=estadoURL(o);
 ovl.hidden=false;document.body.classList.add('ovl-on');$('rx').focus();
 try{localStorage.setItem('amatsuka_ultimo',JSON.stringify({codigo:o.codigo,proyecto:o.proyecto}));localStorage.setItem('amatsuka_codigo',o.codigo)}catch(e){}
}
$('rx').onclick=cerrar;
ovl.addEventListener('pointerdown',function(e){if(e.target===ovl)cerrar()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ovl.hidden)cerrar()});
$('rcp').onclick=function(){
 var t=($('rc').textContent||'').trim(),b=this,ok=function(){b.textContent='¡Copiado!';setTimeout(function(){b.textContent='Copiar código'},1800)};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){});
};
$('rdl').onclick=function(){if(ultimo&&ultimo.formato)AMA.guardar(AMA.aBlob(ultimo),AMA.nombreArchivo(ultimo))};

/* ---- envio: formulario multipart REAL (el unico modo en que FormSubmit adjunta archivos) ---- */
function adjuntar(fd,campo,blob,nombre){fd.append(campo,blob,nombre)}
async function enviar(o,png,amaBlob,sl){
 var fd=new FormData();
 fd.append('_subject',ASUNTO+': '+o.proyecto+' ['+o.codigo+']');
 fd.append('_template','table');fd.append('_captcha','false');
 fd.append('Codigo',o.codigo);fd.append('Proyecto',o.proyecto);fd.append('Nombre',o.nombre);
 fd.append('email',o.correo);fd.append('Contacto',o.contacto||'(no indicado)');
 fd.append('Descripcion',o.descripcion);
 fd.append('Mensaje_del_codigo','Código de solicitud: '+o.codigo+'. '+mensajeCodigo(o));
 fd.append('_autoresponse','Hola '+o.nombre+', recibimos tu solicitud "'+o.proyecto+'" en Amatsuka Creators.\n\nTu código de solicitud es: '+o.codigo+'\n\n'+mensajeCodigo(o)+'\n\nGracias por escribirnos.');
 if(png)adjuntar(fd,'tarjeta',png,'tarjeta-'+sl+'.png');
 adjuntar(fd,'plantilla',amaBlob,AMA.nombreArchivo(o));
 /* no-cors: la respuesta es opaca, pero el correo sale con los adjuntos. Un fallo de red sí lanza error */
 await fetch('https://formsubmit.co/'+encodeURIComponent(CORREO),{method:'POST',body:fd,mode:'no-cors'});
}

form.addEventListener('submit',async function(e){
 e.preventDefault();if(busy)return;
 var d={proyecto:f.p.value.trim(),descripcion:f.d.value.trim(),nombre:f.n.value.trim(),correo:f.e.value.trim(),contacto:f.c.value.trim()};
 var miss=['p','d','n','e'].filter(function(k){return !f[k].value.trim()});
 if(!miss.length&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo))miss=['e'];
 if(miss.length){miss.forEach(function(k){f[k].classList.remove('bad');void f[k].offsetWidth;f[k].classList.add('bad')});f[miss[0]].focus();say(miss[0]==='e'&&d.correo?'Revisa tu correo':'Completa los campos',2500);return}
 busy=true;btn.disabled=true;say('Generando…');
 var sl=AMA.slug(d.proyecto),png=null,o;
 /* la ventana se abre YA con el codigo; el trabajo pesado se hace despues de pintarla */
 var codigo=AMA.codigo();
 mostrar({codigo:codigo});$('rdl').disabled=true;estadoMsg('Generando tu plantilla…');
 await new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r)})});
 var logos=await AMA.logosDe(ROOT);
 o=AMA.crear(Object.assign({origen:location.href,codigo:codigo},d),logos);
 var amaBlob=AMA.aBlob(o);
 var cr=$('card').getBoundingClientRect();
 try{png=await AMA.tarjetaPNG(d,{logos:logos,ratio:cr.width?cr.height/cr.width:0})}catch(err){png=null}
 ultimo=o;$('rdl').disabled=false;estadoMsg('Enviando a Amatsuka Creators…');
 try{
  say('Enviando…');
  await enviar(o,png,amaBlob,sl);
  btn.classList.add('ok');say('¡Enviado! ✓');estadoMsg('✓ Enviado. Tu solicitud ya está en revisión.','ok');
  setTimeout(function(){btn.classList.remove('ok');busy=false;btn.disabled=false;say(LABEL)},4500);
 }catch(err){
  /* respaldo: descarga la tarjeta y el .amatsuka y abre el correo para adjuntarlos */
  if(png)AMA.guardar(png,'tarjeta-'+sl+'.png');
  AMA.guardar(amaBlob,AMA.nombreArchivo(o));
  var body='Código: '+o.codigo+'\nProyecto: '+d.proyecto+'\nNombre: '+d.nombre+'\nCorreo: '+d.correo+'\nContacto: '+(d.contacto||'-')+'\n\n'+d.descripcion+'\n\n'+mensajeCodigo(o)+'\n\n(Adjunta la tarjeta y el .amatsuka que se descargaron)';
  setTimeout(function(){location.href='mailto:'+CORREO+'?subject='+encodeURIComponent(ASUNTO+': '+d.proyecto+' ['+o.codigo+']')+'&body='+encodeURIComponent(body)},700);
  estadoMsg('No se pudo enviar. Descargamos tus archivos: adjúntalos en el correo que se abrirá.','bad');
  say('No se pudo enviar: archivos descargados',5000);busy=false;btn.disabled=false;
 }
});
})();
