/* =====================================================
   LABCODE MOBILE
   VS CODE MOBILE + INTELLISENSE + EXTENSION SYSTEM
===================================================== */


/* =====================================================
   ARCHIVOS PREDETERMINADOS
===================================================== */

const defaultFiles = {

  html: `<!DOCTYPE html>
<html lang="es">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Mi página</title>

</head>

<body>

  <h1>Hola, LabCode Mobile 🚀</h1>

  <p>
    Escribe tu código y presiona Ejecutar.
  </p>

</body>

</html>`,

  css: `body {

  font-family: Arial, sans-serif;

  margin: 0;

  padding: 40px;

  background-color: #101827;

  color: #ffffff;

}

h1 {

  color: #38bdf8;

}`,

  js: `console.log("LabCode Mobile funcionando");`,

  readme: `# LabCode Mobile

Editor móvil inspirado en VS Code.

- HTML
- CSS
- JavaScript
- Preview
- Guardado local
- IntelliSense
- Extensiones`,

  privacy: `Política de privacidad

Los proyectos se almacenan localmente en este dispositivo.`
};


/* =====================================================
   ESTADO
===================================================== */

let files = {
  ...defaultFiles
};

let current = "html";


/* =====================================================
   ELEMENTOS
===================================================== */

const $ = id =>
  document.getElementById(id);

const editor =
  $("editor");

const lineNumbers =
  $("lineNumbers");

const suggestionBox =
  $("suggestions");


/* =====================================================
   CARGAR PROYECTO GUARDADO
===================================================== */

try {

  const saved =
    localStorage.getItem(
      "labcode-mobile-project"
    );

  if (saved) {

    files = {
      ...defaultFiles,
      ...JSON.parse(saved)
    };

  }

} catch (error) {

  console.log(
    "No se pudo cargar el proyecto."
  );

}


/* =====================================================
   GUARDAR
===================================================== */

function save() {

  files[current] =
    editor.value;

  localStorage.setItem(
    "labcode-mobile-project",
    JSON.stringify(files)
  );

  showToast(
    "Proyecto guardado en este dispositivo"
  );

}


function saveSilent() {

  localStorage.setItem(
    "labcode-mobile-project",
    JSON.stringify(files)
  );

}


/* =====================================================
   NÚMEROS DE LÍNEA
===================================================== */

function updateLines() {

  const count =
    Math.max(
      1,
      editor.value.split("\n").length
    );

  lineNumbers.innerHTML =
    Array.from(
      {
        length: count
      },
      (_, i) =>
        `<div>${i + 1}</div>`
    ).join("");

}


/* =====================================================
   CURSOR
===================================================== */

function updateCursor() {

  const before =
    editor.value.slice(
      0,
      editor.selectionStart
    );

  const lines =
    before.split("\n");

  const line =
    lines.length;

  const column =
    lines[lines.length - 1].length + 1;

  $("cursorPos").textContent =
    `Ln ${line}, Col ${column}`;

}


/* =====================================================
   CARGAR ARCHIVO
===================================================== */

function loadFile(file) {

  if (!files[file]) {
    return;
  }

  files[current] =
    editor.value;

  current =
    file;

  editor.value =
    files[file];

  const names = {

    html: "index.html",
    css: "style.css",
    js: "script.js",
    readme: "README.md",
    privacy: "privacy-policy"

  };

  $("breadcrumbFile").textContent =
    names[file] || file;

  document
    .querySelectorAll("[data-file]")
    .forEach(element => {

      element.classList.toggle(
        "active",
        element.dataset.file === file
      );

    });

  editor.focus();

  updateLines();

  updateCursor();

  editor.setAttribute(
    "data-lang",
    file
  );

  hideCompletions();

}


/* =====================================================
   EJECUTAR
===================================================== */

function runCode() {

  files[current] =
    editor.value;

  saveSilent();

  const html =
    files.html || "";

  const css =
    files.css || "";

  const js =
    files.js || "";

  let source =
    html;

  if (
    source.includes("</head>")
  ) {

    source =
      source.replace(
        "</head>",
        `<style>
${css}
</style>
</head>`
      );

  } else {

    source =
      `<style>
${css}
</style>
${source}`;

  }


  if (
    source.includes("</body>")
  ) {

    source =
      source.replace(
        "</body>",
        `<script>
${js.replaceAll(
  "</script>",
  "<\\/script>"
)}
</script>
</body>`
      );

  } else {

    source +=
      `<script>
${js.replaceAll(
  "</script>",
  "<\\/script>"
)}
</script>`;

  }


  $("preview").srcdoc =
    source;

  showToast(
    "Código ejecutado"
  );

}


/* =====================================================
   MODOS
===================================================== */

function showPreview() {

  runCode();

  $("editorWrap")
    .classList.add("hidden");

  $("previewWrap")
    .classList.remove("hidden");

  $("previewMode")
    .classList.add("active");

  $("editorMode")
    .classList.remove("active");

}


function showEditor() {

  $("previewWrap")
    .classList.add("hidden");

  $("editorWrap")
    .classList.remove("hidden");

  $("editorMode")
    .classList.add("active");

  $("previewMode")
    .classList.remove("active");

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

  const element =
    $("toast");

  element.textContent =
    message;

  element.classList.add(
    "show"
  );

  clearTimeout(
    showToast.timer
  );

  showToast.timer =
    setTimeout(
      () => {

        element.classList.remove(
          "show"
        );

      },
      1700
    );

}


/* =====================================================
   MODAL
===================================================== */

function openModal(
  title,
  html
) {

  $("modalTitle").textContent =
    title;

  $("modalContent").innerHTML =
    html;

  $("modalBackdrop")
    .classList.remove("hidden");

}


/* =====================================================
   PRIVACIDAD
===================================================== */

function privacy() {

  openModal(
    "⚖ Privacidad",

    `
    <div class="modal-body">

      <h3>
        LabCode Mobile
      </h3>

      <p>
        <b>
          Política de privacidad
        </b>
      </p>

      <ul>

        <li>
          No recopilamos datos personales.
        </li>

        <li>
          Los proyectos se guardan localmente
          en tu dispositivo.
        </li>

        <li>
          No compartimos tu código con terceros.
        </li>

        <li>
          La vista previa se ejecuta
          dentro de esta aplicación web.
        </li>

      </ul>

      <p>
        Última actualización:
        29 de septiembre de 2026.
      </p>

    </div>
    `
  );

}


/* =====================================================
   EVENTOS DEL EDITOR
===================================================== */

editor.addEventListener(
  "input",
  () => {

    files[current] =
      editor.value;

    updateLines();

    updateCursor();

    saveSilent();

  }
);


[
  "keyup",
  "click",
  "select"
].forEach(event => {

  editor.addEventListener(
    event,
    updateCursor
  );

});


editor.addEventListener(
  "scroll",
  () => {

    lineNumbers.scrollTop =
      editor.scrollTop;

  }
);


/* =====================================================
   ARCHIVOS
===================================================== */

document
  .querySelectorAll(
    ".file-item,.tab"
  )
  .forEach(element => {

    element.addEventListener(
      "click",
      () => {

        loadFile(
          element.dataset.file
        );

        if (
          window.innerWidth <= 700
        ) {

          $("sidebar")
            .classList.remove("open");

        }

      }
    );

  });


/* =====================================================
   ACTIVIDADES
===================================================== */

document
  .querySelectorAll(".activity")
  .forEach(element => {

    element.addEventListener(
      "click",
      () => {

        if (
          element.dataset.panel ===
          "explorer"
        ) {

          $("sidebar")
            .classList.toggle("open");

          return;

        }

        showToast(
          element.dataset.panel ===
          "search"
            ? "Buscar: próximamente"
            : "Panel disponible próximamente"
        );

      }
    );

  });


/* =====================================================
   BOTONES
===================================================== */

$("menuBtn").onclick =
  () =>
    $("sidebar")
      .classList.toggle("open");


$("closeSidebar").onclick =
  () =>
    $("sidebar")
      .classList.remove("open");


$("runBtn").onclick =
  runCode;


$("saveBtn").onclick =
  save;


$("editorMode").onclick =
  showEditor;


$("previewMode").onclick =
  showPreview;


$("refreshPreview").onclick =
  runCode;


$("openPreview").onclick =
  () => {

    const windowPreview =
      window.open();

    if (windowPreview) {

      windowPreview.document.write(
        $("preview").srcdoc
      );

      windowPreview.document.close();

    }

  };


$("privacyBtn").onclick =
  privacy;


$("privacyMenu").onclick =
  () => {

    $("moreMenu")
      .classList.add("hidden");

    privacy();

  };


$("modalClose").onclick =
  () => {

    $("modalBackdrop")
      .classList.add("hidden");

  };


$("modalBackdrop").onclick =
  event => {

    if (
      event.target ===
      $("modalBackdrop")
    ) {

      $("modalBackdrop")
        .classList.add("hidden");

    }

  };


$("moreBtn").onclick =
  () => {

    $("moreMenu")
      .classList.toggle("hidden");

  };


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        "#moreBtn"
      ) &&
      !event.target.closest(
        "#moreMenu"
      )
    ) {

      $("moreMenu")
        .classList.add("hidden");

    }

  }
);


/* =====================================================
   LIMPIAR PROYECTO
===================================================== */

$("clearBtn").onclick =
  () => {

    if (
      confirm(
        "¿Borrar el proyecto guardado y volver al ejemplo?"
      )
    ) {

      files = {
        ...defaultFiles
      };

      current =
        "html";

      editor.value =
        files.html;

      saveSilent();

      loadFile("html");

      showToast(
        "Proyecto restaurado"
      );

    }

  };


/* =====================================================
   CONFIGURACIÓN
===================================================== */

$("settingsBtn").onclick =
  () =>
    showToast(
      "Configuración: próximamente"
    );


/* =====================================================
   NUEVO ARCHIVO
===================================================== */

$("newFileBtn").onclick =
  () => {

    const name =
      prompt(
        "Nombre del archivo, por ejemplo app.js"
      );

    if (!name) {
      return;
    }

    if (
      files[name]
    ) {

      showToast(
        "Ese archivo ya existe"
      );

      return;

    }

    files[name] =
      "";

    saveSilent();

    showToast(
      `Archivo ${name} creado`
    );

  };


/* =====================================================
   TAB
===================================================== */

editor.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Tab" &&
      suggestionBox.classList.contains(
        "hidden"
      )
    ) {

      event.preventDefault();

      const start =
        editor.selectionStart;

      const end =
        editor.selectionEnd;

      editor.value =
        editor.value.slice(
          0,
          start
        ) +
        "  " +
        editor.value.slice(
          end
        );

      editor.selectionStart =
        editor.selectionEnd =
          start + 2;

      files[current] =
        editor.value;

      updateLines();

      updateCursor();

      saveSilent();

    }

  }
);


/* =====================================================
   CSS INTELLISENSE
===================================================== */

const cssCompletion = [

  "color:",
  "background-color:",
  "background:",
  "var()",

  "padding:",
  "padding-top:",
  "padding-right:",
  "padding-bottom:",
  "padding-left:",

  "margin:",
  "margin-top:",
  "margin-right:",
  "margin-bottom:",
  "margin-left:",

  "align-items:",
  "align-content:",
  "align-self:",

  "justify-content:",
  "justify-items:",
  "justify-self:",

  "place-items:",

  "display:",
  "flex",
  "flex-direction:",
  "flex-wrap:",
  "flex-flow:",
  "flex-grow:",
  "flex-shrink:",
  "flex-basis:",

  "grid",
  "grid-template-columns:",
  "grid-template-rows:",
  "grid-gap:",

  "width:",
  "height:",
  "min-width:",
  "max-width:",
  "min-height:",
  "max-height:",

  "border:",
  "border-style:",
  "border-width:",
  "border-color:",

  "border-radius:",
  "border-top:",
  "border-right:",
  "border-bottom:",
  "border-left:",

  "font-size:",
  "font-weight:",
  "font-family:",
  "font-style:",
  "font-variant:",

  "text-align:",
  "text-decoration:",
  "text-transform:",
  "text-shadow:",
  "letter-spacing:",
  "line-height:",

  "cursor:",

  "box-shadow:",
  "opacity:",

  "position:",
  "top:",
  "right:",
  "bottom:",
  "left:",

  "z-index:",

  "overflow:",
  "overflow-x:",
  "overflow-y:",

  "visibility:",

  "transition:",
  "transition-property:",
  "transition-duration:",

  "transform:",

  "animation:",
  "animation-duration:",

  "object-fit:",
  "object-position:",

  "white-space:",
  "word-break:",
  "word-wrap:",

  "content:",
  "filter:",

  "list-style:",
  "list-style-type:",

  "outline:",
  "outline-color:",
  "outline-width:"

];


const htmlCompletion = [

  "html",
  "head",
  "body",
  "title",
  "meta",
  "link",
  "style",
  "script",

  "div",
  "section",
  "header",
  "main",
  "footer",
  "nav",
  "article",
  "aside",

  "button",
  "input",
  "textarea",
  "select",
  "option",
  "label",
  "form",

  "img",
  "a",

  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",

  "p",
  "span",
  "strong",
  "small",

  "ul",
  "ol",
  "li",

  "table",
  "tr",
  "td",
  "th"

];


/* =====================================================
   EXTENSIONES
===================================================== */

const extensionCatalog = [

  {
    id: "css-intellisense",
    name: "CSS IntelliSense",
    icon: "🎨",
    desc:
      "Autocompletado de propiedades CSS, flex, grid, border, colores y más."
  },

  {
    id: "html-snippets",
    name: "HTML Snippets",
    icon: "🧩",
    desc:
      "Snippets rápidos para etiquetas HTML."
  },

  {
    id: "prettier-mobile",
    name: "Prettier Mobile",
    icon: "✨",
    desc:
      "Preparada para formatear tu código."
  },

  {
    id: "live-server",
    name: "Live Preview",
    icon: "🌐",
    desc:
      "Vista previa integrada en LabCode Mobile."
  }

];


let installedExtensions = {};


try {

  installedExtensions =
    JSON.parse(
      localStorage.getItem(
        "labcode-mobile-extensions"
      ) || "{}"
    );

} catch (error) {

  installedExtensions = {};

}


if (
  !Object.keys(
    installedExtensions
  ).length
) {

  extensionCatalog.forEach(
    extension => {

      installedExtensions[
        extension.id
      ] = true;

    }
  );

  localStorage.setItem(
    "labcode-mobile-extensions",
    JSON.stringify(
      installedExtensions
    )
  );

}


/* =====================================================
   SUGERENCIAS
===================================================== */

let suggestionList = [];

let suggestionIndex = 0;


function getPrefix() {

  const position =
    editor.selectionStart;

  const line =
    editor.value
      .slice(0, position)
      .split("\n")
      .pop();

  const match =
    line.match(
      /[A-Za-z-]+$/
    );

  return match
    ? match[0].toLowerCase()
    : "";

}


function hideCompletions() {

  suggestionBox
    .classList.add("hidden");

  suggestionList = [];

}


function showCompletions() {

  const prefix =
    getPrefix();

  if (!prefix) {

    hideCompletions();

    return;

  }


  let pool = [];


  if (
    current === "css"
  ) {

    if (
      !installedExtensions[
        "css-intellisense"
      ]
    ) {

      hideCompletions();

      return;

    }

    pool =
      cssCompletion;

  }


  else if (
    current === "html"
  ) {

    if (
      !installedExtensions[
        "html-snippets"
      ]
    ) {

      hideCompletions();

      return;

    }

    pool =
      htmlCompletion;

  }


  else {

    hideCompletions();

    return;

  }


  suggestionList =
    pool
      .filter(
        item =>
          item
            .toLowerCase()
            .startsWith(prefix)
      )
      .slice(0, 10);


  if (
    !suggestionList.length
  ) {

    hideCompletions();

    return;

  }


  suggestionIndex = 0;


  suggestionBox.innerHTML =
    suggestionList
      .map(
        (item, index) => `

        <button
          class="suggestion ${
            index === 0
              ? "selected"
              : ""
          }"
          data-i="${index}"
        >

          <b>
            ${item}
          </b>

          <span>
            ${current.toUpperCase()}
          </span>

        </button>

      `
      )
      .join("");


  suggestionBox
    .classList.remove(
      "hidden"
    );

}


/* =====================================================
   INSERTAR SUGERENCIA
===================================================== */

function insertCompletion(index) {

  const value =
    suggestionList[index];

  if (!value) {
    return;
  }


  const position =
    editor.selectionStart;

  const prefix =
    getPrefix();

  const start =
    position -
    prefix.length;


  let insert =
    value;


  if (
    current === "css"
  ) {

    const snippets = {

      "color:":
        "color: ;",

      "background-color:":
        "background-color: ;",

      "background:":
        "background: ;",

      "var()":
        "var(--);",

      "padding:":
        "padding: ;",

      "margin:":
        "margin: ;",

      "align-items:":
        "align-items: center;",

      "justify-content:":
        "justify-content: center;",

      "border:":
        "border: 1px solid ;",

      "border-radius:":
        "border-radius: 8px;",

      "border-style:":
        "border-style: solid;",

      "font-size:":
        "font-size: 16px;",

      "font-weight:":
        "font-weight: 600;",

      "display:":
        "display: flex;",

      "flex":
        "display: flex;",

      "width:":
        "width: 100%;",

      "height:":
        "height: 100%;",

      "cursor:":
        "cursor: pointer;",

      "box-shadow:":
        "box-shadow: 0 4px 12px rgba(0,0,0,.2);",

      "position:":
        "position: relative;",

      "transition:":
        "transition: all .3s ease;",

      "text-align:":
        "text-align: center;",

      "overflow:":
        "overflow: hidden;"

    };


    insert =
      snippets[value] ||
      value + " ";

  }


  else {

    insert =
      `<${value}></${value}>`;

  }


  editor.value =
    editor.value.slice(
      0,
      start
    ) +
    insert +
    editor.value.slice(
      position
    );


  let cursor =
    start +
    insert.length;


  if (
    current === "css"
  ) {

    if (
      insert.endsWith(";")
    ) {

      cursor -= 1;

    }

  }


  editor.selectionSt
