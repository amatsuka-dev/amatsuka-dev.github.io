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
   Para agregar otro proyecto copia un bloque { ... }, y ponle una coma. */
window.PROYECTOS = [
  // Si esta lista esta vacia, la pagina muestra una tarjeta "Próximamente".
  // Quita las // de este bloque para agregar tu primer proyecto:
  // {
  //   anio: 2026,
  //   titulo: "Título del proyecto",
  //   info: "Una pequeña información del proyecto.",
  //   estado: "proceso",
  //   portada: "",
  //   slides: ["media/proyecto1-a.jpg", "media/proyecto1-b.mp4"],
  //   intervalo: 5000
  // },
];

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
   desc en el rol (junto a rol:) = mini descripcion bajo el titulo de la categoria. */
window.PERSONAL = [
  { rol: "OWNERS", desc: "Fundadores de Amatsuka.", miembros: [

{ nombre: "NgArtStudio", foto: "personal/ngperfil.png", desc: "Director General",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "TheGumboySide", foto: "personal/gumboyperfil.png", desc: "Director de Media",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "Esme_DreamWave", foto: "", desc: "Directora de Roleplay",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "KrakenSalas", foto: "", desc: "Director de Dev",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] }
  ]},

  { rol: "DIRECTORES", miembros: [

{ nombre: "El BIN", foto: "", desc: "Directora de Dev",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "TomokiSama", foto: "", desc: "Directora de Ideas",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "Spooky Luna", foto: "", desc: "Directora de Arte",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
{ nombre: "El Aleck", foto: "", desc: "Directora de Media",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },


  ] },



  { rol: "Direct@r Rp", miembros: [] },
  { rol: "Direct@r Media", miembros: [] },
  { rol: "Direct@r De Idea", miembros: [] },
  { rol: "Direct@r Arte", miembros: [] },
  { rol: "Direct@r Dev", miembros: [] },
  { rol: "Dev 🖥️", miembros: [] },
  { rol: "Media 🎞️", miembros: [] },
  { rol: "Artistas 🎨", miembros: [] },

  { rol: "Role Players", miembros: [

{ nombre: "Chinony", foto: "", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "Junior", foto: "", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "JAxIN", foto: "", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "Ara", foto: "", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },
  { nombre: "KioNathan", foto: "", desc: "Rolplayer",
  instagram: "", twitter: "", patreon: "", coffee: "", web: "", otros: [] },

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
     boton:  color del cuadrado del boton
     texto:  texto bajo el logo
   Solo estos botones y la X para cerrar se pueden pulsar; el resto de la ventana no. */
window.DESCARGAR = {
  fondo: "#521c2b",                   // fondo general de la ventana (cuando no se apunta a ningun modpack)
  textoBoton: "#ffe9e0",              // color de las letras de los botones
  modpacks: [
    { nombre: "Modery", logo: "assets/modery.svg", link: "https://tu-link-aqui.com",
      fondo: "", boton: "#a42b34", texto: "descarga modpack" },
    // { nombre: "Otro modpack", logo: "", link: "", fondo: "media/fondo-otro.jpg", boton: "#a42b34", texto: "descarga modpack" },
  ],
  mostrarLauncher: true,              // false = oculta el boton de Launcher
  botonLauncher: "#a42b34",           // color del cuadrado de Launcher
  textoLauncher: "",                  // texto bajo el logo de Launcher (vacio = solo logo)
  mensajeLauncher: "PRÓXIMAMENTE"     // lo que dice la ventana al abrir Launcher o un modpack sin link
};
