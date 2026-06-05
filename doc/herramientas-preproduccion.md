
 Para ejecutar herramientas sin instalarlas globalmente: npx
El comando npx (Node Package Executor) sirve para ejecutar herramientas directamente desde internet o de tu carpeta local sin tener que instalarlas de forma permanente en tu computadora. Por ejemplo:

npx eslint resources/js/ (para correr el detector de errores a mano).
npx prettier --write . (para formatear todo tu código automáticamente).


Para buscar errores o vulnerabilidades en las librerías: npm audit
Si quieres revisar si las librerías que estás usando tienen problemas de seguridad o están obsoletas, puedes ejecutar en la terminal:

npm audit (para JavaScript): Te dice qué librerías del package.json tienen riesgos de seguridad y cómo solucionarlos.
composer audit (para PHP): Hace lo mismo para las dependencias de Laravel.