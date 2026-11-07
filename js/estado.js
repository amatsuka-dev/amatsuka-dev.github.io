/* =====================================================
   ESTADO: el cliente escribe su codigo y se busca en estado/estados.json
   (ese archivo lo genera el Lector Amatsuka y se sube junto al sitio; guarda solo huellas SHA-256 de los codigos)
   ===================================================== */
(function(){
var $=function(i){return document.getElementById(i)},inp=$('ec'),btn=$('eb'),box=$('er');
try{var g=localStorage.getItem('amatsuka_codigo');if(g)inp.value=g}catch(e){}
var q=(new URLSearchParams(location.search).get('c')||'').trim();if(q)inp.value=q;
function show(cls,t,n,small){box.hidden=false;$('ed').className='edot '+cls;$('et').textContent=t;$('en').textContent=n||'';$('ef2').textContent=small||'';box.style.animation='none';void box.offsetWidth;box.style.animation=''}
$('ef').addEventListener('submit',async function(e){
 e.preventDefault();var raw=inp.value.trim(),n=AMA.normCodigo(raw);
 if(n.length<13){inp.classList.remove('bad');void inp.offsetWidth;inp.classList.add('bad');inp.focus();show('nada','Código incompleto','Debe verse así: AMA-XXXXX-XXXXX');return}
 btn.disabled=true;btn.textContent='Consultando…';
 try{
  var h=await AMA.huella(n),r=await fetch('estados.json?t='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error('http');
  var j=await r.json(),x=(j.estados||{})[h];
  if(x&&AMA.ESTADOS[x.estado]){
   try{localStorage.setItem('amatsuka_codigo',AMA.fmtCodigo(raw))}catch(e){}
   show(x.estado,AMA.ESTADOS[x.estado].n,x.nota||'',x.fecha?'Actualizado: '+new Date(x.fecha).toLocaleString('es'):'');
  }else show('nada','Sin respuesta todavía','No hay una respuesta para este código. Si lo acabas de enviar, tu solicitud está en cola de revisión. Revisa también que el código esté bien escrito.');
 }catch(err){show('nada','No se pudo consultar','Intenta de nuevo en unos minutos.')}
 btn.disabled=false;btn.textContent='Consultar';
});
if(q)$('ef').requestSubmit?$('ef').requestSubmit():0;
})();
