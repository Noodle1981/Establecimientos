---
description: Refuncionalización y refactorizacón
---

en el proyecto tengo dos rol, Admin y Administrativos, cada uno con su ruta

Admin http://127.0.0.1:8000/admin
Administrativos http://127.0.0.1:8000/administrativos/

El problema es que estaba usando las mistmas vistas para los dos cuando no debería ser así.

necesito cambiar la vista de http://127.0.0.1:8000/admin, con contenido que le compete a un admin, el crud para crear usuarios, un log de cambios que se hagan del rol de Administrativos, una tabla de usuario. La parte de administrativos la dejamos como está.