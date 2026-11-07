/* =====================================================
   AMATSUKA CREATORS - TUS DATOS (edita solo este archivo)
   Las rutas de fotos/videos/gifs se escriben desde la carpeta
   principal del sitio. Ej: "media/ana.jpg", "media/clip.mp4",
   "media/baile.gif". Tambien sirven links http(s)://
   ===================================================== */

/* ---------- PROYECTOS ----------
   anio:      año del proyecto (los agrupa por año)
   titulo:    titulo grande (parte oscura de abajo a la derecha)
   info:      pequeña informacion debajo del titulo
   estado:    "terminada" (verde), "proceso" (naranja) o "cancelada" (rojo). Si lo omites: proceso
   portada:   (opcional) imagen/gif/video de la tarjeta chiquita; si no, usa el primer slide
   (Al hacer clic en la tarjeta chiquita se abre la ventana grande con el slider)
   slides:    lista de imagenes / gifs / videos del slider
   intervalo: (opcional) milisegundos entre slides, por defecto 5000
   Para agregar otro proyecto copia un bloque { ... }, y ponle una coma.
   categoria: (opcional) para los botones de filtro; los botones se crean solos con las categorias que escribas
   INVISIBLE: { anio: 2026, invisible: true } deja un espacio en blanco del tamaño de una tarjeta
   (sin ventana) dentro de ese año, para que las tarjetas reales no se estiren. */
window.PROYECTOS = [
  // Si esta lista esta vacia, la pagina muestra una tarjeta "Próximamente".
  // Quita las // de este bloque para agregar tu primer proyecto:
   {
     anio: 2026,
     titulo: "CHILLMON I",
     info: "Una pequeña Serie de Cobblemon, en colaboracion de AmatsukaCreators x Creators.",
     estado: "terminado",
     categoria: "Cobblemon",
     portada: "proyectos/chillmon/icono.png",
     slides: ["proyectos/chillmon/ch1.png", "proyectos/chillmon/ch2.png","proyectos/chillmon/ch3.png","proyectos/chillmon/ch4.png","proyectos/chillmon/ch5.png","proyectos/chillmon/ch6.png","proyectos/chillmon/ch7.png","proyectos/chillmon/ch8.png","proyectos/chillmon/ch9.png","proyectos/chillmon/ch10.png","proyectos/chillmon/ch11.png","proyectos/chillmon/ch12.png","proyectos/chillmon/ch13.png","proyectos/chillmon/ch14.png",],
     intervalo: 5000
   },

   { anio: 2026, invisible: true },
   { anio: 2026, invisible: true }

   

  ];


/* ---------- CRONOLOGIA (debajo de Proyectos) ----------
   Linea de tiempo horizontal. Los elementos se alternan arriba/abajo automaticamente.
   titulo / texto:  encabezado y descripcion de la seccion (vacios = no se muestran)
   items: lista; para agregar otro copia un bloque { ... } y ponle coma.
     img:      imagen / gif / video del recuadro central (vacio = recuadro de color)
     logo:     (opcional) imagen del titulo; si no, se muestra "titulo" en texto
     titulo:   texto del elemento
     fecha:    texto superior (ej. "2026", "2026 (T2)")
     etiqueta: texto amarillo bajo la fecha (ej. "Sagrada linea")
     categoria:(opcional) debe coincidir con la categoria del proyecto para que el filtro funcione
     link:     (opcional) al hacer clic en el recuadro abre este link
   Si la lista items esta vacia, la seccion no aparece. */
window.CRONOLOGIA = {
  titulo: "Cronología",
  texto: "Recorrido por los hitos de Amatsuka Creators y sus proyectos a lo largo del tiempo.",
  items: [
    { img: "proyectos/chillmon/ch1.png", logo: "", titulo: "CHILLMON I", fecha: "2026", etiqueta: "Proyecto", categoria: "Cobblemon", link: "" },
    { img: "", logo: "", titulo: "Proximo proyecto", fecha: "2026 (T2)", etiqueta: "Proximamente", categoria: "Otros", link: "" }
  ]
};

/* ---------- PROYECTOS A FUTURO (boton rectangular al final de Proyectos) ----------
   boton:   texto del boton      titulo:  titulo de la ventana que se abre
   mensaje: lo que dice si no hay items
   items:   lista de proyectos futuros (copia un bloque { ... } y ponle coma)
     titulo, info (descripcion), fecha (ej. "2027"), img (imagen/gif/video, opcional) */
window.FUTUROS = {
  boton: "Proyectos a futuro",
  titulo: "Proyectos a futuro",
  mensaje: "PRÓXIMAMENTE",
  items: [
    // { titulo: "CHILLMON II", info: "Segunda temporada de la serie.", fecha: "2027", img: "" },
  ]
};

/* ---------- PERSONAL ----------
   Cada rol aparece SOLO si tiene al menos una persona con nombre.
   Ejemplo de una persona:
     { nombre: "Ana", foto: "media/ana.jpg",
       desc: "Directora de Arte",          // texto bajo el nombre (si lo omites, muestra el rol)
       instagram: "https://instagram.com/ana",
       twitter:   "https://x.com/ana",
       patreon:   "",                       // vacio = no aparece el boton
       coffee:    "https://ko-fi.com/ana",
       web:       "",
       otros: [ { icono: "assets/redes/tiktok.svg", url: "https://tiktok.com/@ana", titulo: "TikTok" } ]
     }
   - Cada red es un boton con icono (assets/redes/instagram.svg, twitter.svg,
     patreon.svg, coffee.svg, web.svg). Si dejas el link vacio, NO se muestra nada.
   - Para usar otro logo, reemplaza el .svg con el mismo nombre en assets/redes/.
   - "otros": para redes extra. Necesita icono (ruta del .svg) y url; si falta alguno, no aparece.
   foto puede ser imagen, gif o video (mp4/webm). Si la dejas vacia
   se muestra la inicial del nombre.
   desc en el rol (junto a rol:) = mini descripcion bajo el titulo de la categoria.
   INVISIBLES: { invisible: true } crea un espacio en blanco del tamaño de una tarjeta, sin ventana.
   Sirve para que las tarjetas reales se mantengan pequeñas (4 por fila) cuando hay pocas.
   Ej: 1 persona + 3 invisibles = una tarjeta chica con espacio vacio al lado. */
window.PERSONAL = [
  { rol: "OWNERS", desc: "Fundadores de Amatsuka.", miembros: [

{ nombre: "NgArtStudio", foto: "personal/ngperfil.png", desc: "Director General",
  instagram: "https://www.instagram.com/ngartstudio", twitter: "https://x.com/dng_295", patreon: "", coffee: "", web: "https://ngartstudio.online/", otros: [] },
{ nombre: "TheGumboySide", foto: "personal/gumboyperfil.png", desc: "Director de Media",
  instagram: "", twitter: "https://x.com/TheGumboySide", patreon: "", coffee: "https://ko-fi.com/thegumboyside", web: "https://haunt.gg/thegumboyside", otros: [] },
{ nombre: "Esme_DreamWave", foto: "personal/esmeperfil.png", desc: "Directora de Roleplay",
  instagram: "", twitter: "https://x.com/Esme_Dreamwave", patreon: "", coffee: "https://ko-fi.com/esmedreamwave", web: "", otros: [] },
{ nombre: "KrakenSalas", foto: "personal/krakenperfil.png", desc: "Director de Dev",
  instagram: "https://www.instagram.com/krakensalas0/", twitter: "https://x.com/SalasKraken?t=GGegDPF0INsfAfILW5msng&s=09", patreon: "", coffee: "", web: "https://www.youtube.com/@krakensalas", otros: [] }
  ]},

  { rol: "DIRECTORES", miembros: [

{ nombre: "El BIN", foto: "personal/binperfil.png", desc: "Directora de Dev",
  instagram: "https://www.instagram.com/el_b1n/", twitter: "https://x.com/El_BE4N", patreon: "https://www.patreon.com/cw/ElBIN", coffee: "", web: "", otros: [] },
{ nombre: "TomokiSama", foto: "personal/tomokiperfil.png", desc: "Directora de Ideas",
  instagram: "https://www.instagram.com/tomokisama321/", twitter: "https://x.com/TomokiSamaVT", patreon: "", coffee: "", web: "https://www.youtube.com/channel/UC8On484QlHOQL5npD20zMpw", otros: [] },
{ nombre: "Spooky Luna", foto: "personal/lunaperfil.png", desc: "Directora de Arte",
  instagram: "https://www.instagram.com/_picafresa_3?vrfl=MXZuZnQ4eGU5bDFyOQ%3D%3D&utm_source=qr", twitter: "https://x.com/4_Loneey_25", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "El Aleck", foto: "personal/aleckperfil.png", desc: "Directora de Media",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },


  ] },



  { rol: "Direct@r Rp", miembros: [] },
  
  { rol: "Media", miembros: [

{ nombre: "Jd", foto: "personal/jdperfil.png", desc: "Media",
  instagram: "https://www.instagram.com/jd05tw", twitter: "https://x.com/JD05tw", patreon: "", coffee: "", web: "https://www.behance.net/jafetrojas2", otros: [] },

{ invisible: true },
{ invisible: true },
{ invisible: true },

  ] },
  { rol: "Direct@r De Idea", miembros: [] },
  { rol: "Direct@r Arte", miembros: [] },
  { rol: "Direct@r Dev", miembros: [] },
  { rol: "Dev 🖥️", miembros: [] },
  { rol: "Media 🎞️", miembros: [] },

  { rol: "Role Players", miembros: [

{ nombre: "Chinony", foto: "personal/chino.jpg", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "Junior", foto: "personal/junionperfil.jpg", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "JAxIN", foto: "personal/jaxinperfil.png", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "Ara", foto: "personal/araperfil.jpg", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "KioNathan", foto: "personal/kionathanperfil.jpg", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "https://www.youtube.com/channel/UC-Zkd_xChxIS-Pkk9rKIpUg", otros: [] },
{ nombre: "Alex Sans Fandubs", foto: "", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },


  ] },

  { rol: "Soporte", miembros: [

    { nombre: "chachuziel", foto: "personal/chachuperfil.jpg", desc: "Media",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },

{ invisible: true },
{ invisible: true },
{ invisible: true },

  ] },


];

/* ---------- DESCARGAR ----------
   Boton "Descargar" del menu: abre una ventana con un boton por modpack
   y el boton de Launcher. Cada modpack tiene su link y su propio fondo:
   al pasar el mouse sobre el boton, el fondo de la ventana cambia a ese.

   modpacks: lista de modpacks. Para agregar otro, copia un bloque { ... } y ponle coma.
     nombre: nombre (se muestra si no hay logo)
     logo:   ruta del .svg/.png del logo (vacio = muestra el nombre en texto)
     link:   link de descarga (vacio = el boton muestra "PRÓXIMAMENTE")
     fondo:  fondo de la ventana para este modpack. Puede ser un color ("#1a3a5c")
             o una imagen/gif ("media/fondo-modery.jpg"). Vacio = usa el fondo general.
     categoria: nombre de una de las categorias de arriba (ej. "Activos" o "Finalizados"); se usa en el filtro de la ventana Modpacks
     ventana: true = este modpack aparece DENTRO de la ventana "Modpacks" (para los de cada evento).
             Sin esta linea (o false) se queda AFUERA, directo en la ventana de Descargar (como Modery).
     boton:  color del cuadrado del boton
     texto:  texto bajo el logo
   Solo estos botones y la X para cerrar se pueden pulsar; el resto de la ventana no. */
window.DESCARGAR = {
  fondo: "#521c2b",                   // fondo general de la ventana (cuando no se apunta a ningun modpack)
  textoBoton: "#ffe9e0",              // color de las letras de los botones
  modpacks: [
    // Estos son los modpacks que se ven DENTRO de la ventana que abre el boton Modery (uno por evento).
    // Copia este bloque, cambia logo y link, y quita las //
    // { nombre: "Evento 1", logo: "assets/evento1.svg", link: "", ventana: true, categoria: "Activos", fondo: "", boton: "#a42b34", texto: "" },
    // { nombre: "Otro modpack", logo: "", link: "", fondo: "media/fondo-otro.jpg", boton: "#a42b34", texto: "descarga modpack" },
  ],
  categorias: ["Activos", "Finalizados"],  // botones del filtro dentro de la ventana Modpacks (cambia o agrega los que quieras)
  agruparModpacks: true,             // true = la ventana de Descargar tiene solo 2 botones (Modery y Launcher); el de Modery abre la ventana con los modpacks. false = los muestra directo
  logoBotonModpacks: "assets/modery.svg",  // icono del boton Modery
  textoBotonModpacks: "descarga modpack",  // texto bajo el icono
  botonModpacks: "#a42b34",                // color del cuadrado del boton Modery
  mostrarLauncher: true,              // false = oculta el boton de Launcher
  botonLauncher: "#a42b34",           // color del cuadrado de Launcher
  textoLauncher: "",                  // texto bajo el logo de Launcher (vacio = solo logo)
  mensajeLauncher: "PRÓXIMAMENTE"     // lo que dice la ventana al abrir Launcher o un modpack sin link
};


/* ---------- CONTACTOS ----------
   correo:  donde llega la tarjeta (PNG) + el archivo .amatsuka (se abre con el Lector Amatsuka) con lo que escribio la persona.
            IMPORTANTE: la primera vez que alguien envie el formulario, FormSubmit manda un
            correo de ACTIVACION a esta direccion; hay que abrirlo y pulsar "Activate Form".
   discord: link de invitacion o perfil (ej. "https://discord.gg/xxxx"). Vacio = el icono no abre nada.
   asunto:  asunto del correo que recibes. */
window.CONTACTO = {
  correo: "amatsukacreators@gmail.com",
  discord: "",
  asunto: "Nueva plantilla de proyecto - Amatsuka Creators"
};
