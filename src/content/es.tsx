import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import { SNIPPETS } from '../snippets'
import type { Section } from './types'

const code = SNIPPETS.es

// Los IDs coinciden con los del artículo en inglés para conservar los enlaces al cambiar de idioma.
export const ES_SECTIONS: Section[] = [
  {
    id: 'overview', title: 'Qué es axe',
    lead: 'Un motor de pruebas de accesibilidad y una familia de herramientas basadas en él.',
    body: <>
      <p><strong>axe-core</strong> ejecuta reglas automáticas sobre el HTML renderizado. Ayuda a encontrar problemas como controles sin nombre accesible, imágenes sin alternativa textual y contraste insuficiente. Es un motor que puedes llamar desde tus pruebas; no es un certificado de que una página sea accesible.</p>
      <div className="cards">{[
        ['axe-core', 'El motor JavaScript de código abierto que evalúa reglas y devuelve resultados estructurados.'],
        ['axe DevTools', 'La extensión de navegador para analizar, inspeccionar y corregir problemas de forma visual.'],
        ['cypress-axe', 'La integración que inyecta axe-core en una página de Cypress y añade comprobaciones a las pruebas.'],
      ].map(([title, text]) => <div className="card" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
      <Callout tone="tip">Empieza con la extensión para explorar un problema; lleva las comprobaciones repetibles a pruebas automáticas cuando conozcas la página y sus estados.</Callout>
    </>,
  },
  {
    id: 'rules', title: 'Qué revisa',
    lead: 'Las reglas inspeccionan propiedades comprobables de la interfaz que está renderizada.',
    body: <>
      <p>axe-core incluye reglas etiquetadas con criterios WCAG 2.0, 2.1 y 2.2, además de buenas prácticas. Cada regla encuentra elementos relevantes y ejecuta comprobaciones. El resultado depende de lo que esté presente y visible en el momento del análisis.</p>
      <div className="table-wrap"><table><thead><tr><th>Regla de ejemplo</th><th>Pregunta que ayuda a responder</th></tr></thead><tbody>{[
        ['button-name', '¿Tiene el botón un nombre que pueda usar la tecnología de asistencia?'],
        ['image-alt', '¿Tiene una imagen significativa una alternativa textual adecuada?'],
        ['color-contrast', '¿Tiene el texto suficiente contraste con su fondo?'],
      ].map(([rule, description]) => <tr key={rule}><td><code>{rule}</code></td><td>{description}</td></tr>)}</tbody></table></div>
      <Callout>Las etiquetas WCAG indican con qué criterios se relaciona una regla. Pasar las pruebas de axe no demuestra por sí solo conformidad con WCAG.</Callout>
    </>,
  },
  {
    id: 'workflow', title: 'Un flujo útil',
    lead: 'Analiza un estado real, revisa cada hallazgo, corrige la causa y vuelve a analizar.',
    body: <ol className="steps">{[
      ['Renderiza la página', 'Espera a que la interfaz y sus datos lleguen al estado que quieres probar.'],
      ['Ejecuta axe', 'Revisa primero la página completa o un componente mientras lo desarrollas.'],
      ['Lee el hallazgo', 'Usa el ID de la regla, el elemento afectado, la explicación y el enlace de ayuda.'],
      ['Corrige la interfaz', 'Prefiere HTML semántico, etiquetas claras y una interacción correcta antes que desactivar reglas.'],
      ['Repite en otros estados', 'Abre diálogos y menús, provoca errores, enfoca controles y vuelve a ejecutar la prueba.'],
    ].map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>,
  },
  {
    id: 'browser', title: 'Analizar en el navegador',
    lead: 'La extensión axe DevTools ofrece una primera revisión rápida de la página renderizada.',
    body: <>
      <ol>
        <li>Abre la página que quieres revisar y entra al panel axe DevTools desde las herramientas de desarrollo.</li>
        <li>Ejecuta un análisis de página completa. Si trabajas en un componente, un análisis parcial puede acotar los resultados.</li>
        <li>Inspecciona el elemento afectado y la guía de cada problema; corrige la página y vuelve a analizar.</li>
      </ol>
      <p>Ejecuta otra revisión después de abrir un diálogo, menú o tooltip. El contenido que no estaba renderizado o activo durante la primera revisión necesita su propia comprobación.</p>
      <Callout tone="warn">Un resultado sin hallazgos en la página inicial no dice nada sobre un componente cerrado ni sobre un estado de error posterior.</Callout>
    </>,
  },
  {
    id: 'api', title: 'Usar axe-core en código',
    lead: 'La API de JavaScript devuelve un informe estructurado del documento actual.',
    body: <>
      <p>Instala <code>axe-core</code> en el proyecto que ejecuta la prueba. Cuando la interfaz esté renderizada en un navegador, llama a <code>axe.run(document)</code>. También puedes pasar un selector o elemento para acotar el contexto.</p>
      <CodeBlock code={code.core} caption="axe-core en una prueba de navegador" />
      <p>El ejemplo muestra cada regla fallida y sus nodos afectados. En una prueba automática, comprueba <code>results.violations</code> y conserva los detalles en el reporte de fallo para poder reproducir el problema.</p>
      <Callout>Esta guía muestra el código como texto. No carga axe-core ni analiza a sus visitantes.</Callout>
    </>,
  },
  {
    id: 'results', title: 'Leer los resultados',
    lead: 'Cuatro listas indican si una regla pasó, falló, necesita revisión o no aplica.',
    body: <>
      <div className="table-wrap"><table><thead><tr><th>Lista</th><th>Significado</th></tr></thead><tbody>{[
        ['violations', 'Una regla encontró un fallo definitivo en uno o más nodos.'],
        ['incomplete', 'axe no pudo decidir; una persona debe revisar esos nodos.'],
        ['passes', 'Una regla pasó en los nodos que evaluó.'],
        ['inapplicable', 'No se encontró contenido que coincidiera con esa regla.'],
      ].map(([name, text]) => <tr key={name}><td><code>{name}</code></td><td>{text}</td></tr>)}</tbody></table></div>
      <p>Una infracción incluye <code>id</code>, <code>impact</code>, <code>helpUrl</code> y <code>nodes</code>. Cada nodo aporta <code>target</code> y normalmente <code>failureSummary</code>. El impacto ayuda a priorizar, pero no sustituye entender la barrera real para la persona usuaria.</p>
      <Callout tone="warn">Cero infracciones no significa cero problemas de accesibilidad. Revisa <code>incomplete</code> y haz una evaluación humana.</Callout>
    </>,
  },
  {
    id: 'cypress', title: 'Añadir axe a Cypress',
    lead: 'cypress-axe ejecuta el mismo motor en los puntos que elige tu prueba de extremo a extremo.',
    body: <>
      <p>Para Cypress 10 o posterior, instala los paquetes e importa <code>cypress-axe</code> en <code>cypress/support/e2e.ts</code>. La integración antigua de Cypress 9 usaba otra ruta para el archivo de soporte y la serie 0.x de cypress-axe.</p>
      <CodeBlock code={code.install} caption="preparación para Cypress 10+" lang="plain" />
      <p>Visita la página, llama a <code>cy.injectAxe()</code> y después a <code>cy.checkA11y()</code>. La inyección va después de <code>cy.visit()</code> y antes de la comprobación. Por defecto, <code>checkA11y</code> evalúa el documento actual.</p>
      <Callout tone="tip">Usa una dirección local de la app que pruebas. La demo anterior de este repositorio apuntaba a una URL publicada; estos ejemplos usan <code>cy.visit('/')</code>.</Callout>
    </>,
  },
  {
    id: 'states', title: 'Probar estados interactivos',
    lead: 'El análisis ve lo que está renderizado ahora: un tooltip necesita otra revisión después de abrirse.',
    body: <>
      <p>La demo original probaba un tooltip de Material UI. Su sucesor útil revisa la página inicial, enfoca el botón de icono, espera a que aparezca el tooltip y vuelve a revisar. El botón necesita su propio nombre accesible; un icono visual no basta.</p>
      <CodeBlock code={code.cypress} caption="cypress/e2e/accessibility.cy.ts" />
      <p>Aplica el mismo patrón a menús y diálogos abiertos, acordeones expandidos, errores de validación y otros estados alcanzables. Comprueba también la interacción con teclado por separado.</p>
    </>,
  },
  {
    id: 'scope', title: 'Elegir el alcance',
    lead: 'Revisar un componente ayuda durante el desarrollo, pero sigue haciendo falta revisar la página completa.',
    body: <>
      <p>Tanto <code>axe.run</code> como <code>cy.checkA11y</code> aceptan un contexto. Un selector como <code>#dialog</code> centra el informe en una región renderizada.</p>
      <CodeBlock code={code.scope} caption="comprobaciones acotadas" />
      <Callout tone="warn">Un alcance limitado puede omitir relaciones con el resto de la página. Incluye revisiones de página completa en tus pruebas.</Callout>
    </>,
  },
  {
    id: 'fixes', title: 'Convertir hallazgos en correcciones',
    lead: 'Usa la regla y el nodo reportados para reparar la interfaz y después comprueba su comportamiento.',
    body: <>
      <ol>
        <li>Abre <code>helpUrl</code> para entender la regla y ubica cada <code>target</code> en la página.</li>
        <li>Lee <code>failureSummary</code> y decide qué comportamiento falta para la persona usuaria.</li>
        <li>Corrige el HTML o la interacción. Prefiere un botón real, una etiqueta explícita y texto alternativo significativo cuando corresponda.</li>
        <li>Vuelve a ejecutar axe y prueba la experiencia con teclado y tecnología de asistencia.</li>
      </ol>
      <CodeBlock code={code.markup} caption="nombres y etiquetas claros" lang="plain" />
      <p>En una acción que solo muestra un icono, el nombre del botón describe la acción. Un icono decorativo puede ocultarse del árbol de accesibilidad para no repetir ni confundir ese nombre.</p>
    </>,
  },
  {
    id: 'ci', title: 'Usarlo en CI',
    lead: 'Haz repetibles los recorridos importantes y permite que las infracciones definitivas fallen la prueba.',
    body: <>
      <p>Añade comprobaciones de accesibilidad a las pruebas que ya visitan páginas e interacciones importantes. Espera al estado real de la interfaz antes de analizar, conserva los detalles del fallo y vuelve a probar después de cambiar componentes compartidos.</p>
      <p>Si una página antigua tiene muchos hallazgos, regístralos y corrígelos deliberadamente. Ocultar reglas o filtrar todas las infracciones de menor impacto solo para dejar el build en verde reduce el valor de la prueba.</p>
      <Callout tone="tip">Combina la automatización con una pequeña lista de revisión manual para cada recorrido importante.</Callout>
    </>,
  },
  {
    id: 'limits', title: 'Lo que no detecta la automatización',
    lead: 'Un escaneo aporta evidencia sobre un estado, no una evaluación completa de accesibilidad.',
    body: <>
      <p>Una herramienta no puede juzgar toda interacción ni si el contenido tiene sentido. Revisa el orden y uso del teclado, la gestión del foco, los nombres e instrucciones anunciados, el zoom y la redistribución del contenido, y la realización de tareas con tecnología de asistencia cuando corresponda.</p>
      <p>El W3C explica que las herramientas ayudan, pero se necesita criterio humano para determinar si un sitio es accesible. Trata <code>incomplete</code> como una lista de revisión, no como un resultado aprobado.</p>
      <Callout tone="warn">No describas una aplicación como «conforme a WCAG» solo porque axe no reportó infracciones.</Callout>
    </>,
  },
  {
    id: 'mistakes', title: 'Errores comunes',
    lead: 'La mayoría de las revisiones débiles falla por el momento, el alcance o una lectura demasiado confiada del resultado.',
    body: <ul className="mistakes">{[
      ['Inyectar antes de visitar.', 'cypress-axe necesita que la página exista antes de inyectar axe-core.'],
      ['Revisar solo la primera pantalla.', 'Abre estados interactivos y repite el análisis.'],
      ['Tomar cero infracciones como aprobación total.', 'Revisa elementos incompletos y haz comprobaciones manuales.'],
      ['Analizar solo un componente pequeño.', 'Añade revisiones de página completa para detectar relaciones externas.'],
      ['Desactivar una regla para silenciar CI.', 'Corrige la causa o documenta una excepción concreta y justificada.'],
    ].map(([mistake, why]) => <li key={mistake}><strong>{mistake}</strong> <span>{why}</span></li>)}</ul>,
  },
  {
    id: 'sources', title: 'Fuentes',
    lead: 'Los detalles anteriores salen de los propios proyectos y de guías de accesibilidad.',
    body: <div className="sources">{[
      ['axe-core', [
        ['Proyecto y resumen de reglas', 'https://github.com/dequelabs/axe-core'],
        ['API de JavaScript y campos del resultado', 'https://github.com/dequelabs/axe-core/blob/develop/doc/API.md'],
        ['Descripción de las reglas', 'https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md'],
      ]],
      ['Herramientas y evaluación', [
        ['Instalación y comandos de cypress-axe', 'https://github.com/component-driven/cypress-axe/blob/master/README.md'],
        ['Análisis con axe DevTools', 'https://docs.deque.com/devtools-for-web/4/en/devtools-scanning/'],
        ['W3C: qué pueden y no pueden hacer las herramientas', 'https://www.w3.org/WAI/test-evaluate/tools/selecting/'],
      ]],
    ].map(([group, links]) => <div key={group as string}><h3>{group as string}</h3><ul>{(links as string[][]).map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul></div>)}</div>,
  },
]
