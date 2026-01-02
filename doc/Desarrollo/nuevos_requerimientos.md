# Nuevos requerimientos

## 1 Rediseño Mapa

Se requiere que el mapa tenga una mejor interfas para que los usuarios puedan interactuar con el mapa de manera más intuitiva.
http://127.0.0.1:8000/mapa

### 1.1 

Cuando achico el zom al 80% del navegador, el mapa se ve mucho mejor, con mejor espacio,

LA columna dle costado que es la que se encarga de buscar y filtrar los establecimientos a ese 80% gana mejor espacio y es más intuitiva.

El mapa en genral se aprecia más y se ve más claro.

y cuando hago click en el mapa, en un establecimiento, el recuadro que sale, se aprecia muchisimo mejor, ya que hay edificios que pueden tener varios establecimientos, y la proporcion de tamaña se vuelve legible y comodo, ademas es una necesidad para poder agregar mas informacion sobre los establecimientos que me solicitario

### 1.2 

a modo ejemplo, 

QUINTO CUARTEL
📍 CHACABUCO Y 8 S/N

Establecimientos (4):

GRAL. MARTÍN MIGUEL DE GUEMES

CUE: 700034500

ESCUELA SECUNDARIA GRAL. MARTIN MIGUEL DE GUEMES

CUE: 700101200

J.I.N.Z. Nº 28 GRAL. MARTIN MIGUEL DE GÜEMES ANEXO

CUE: 700104202

ANEXO NOCTURNA ING. DOMINGO KRAUSE

CUE: 700032601


Esta vista me pidieron salga el Radio, el tipo de modalidad educativa, la categoría, y el Departamento o Zona.

### 2

Panel administrativos

http://127.0.0.1:8000/administrativos/Panel

Necesito un dashboard mas intuitivo y claro, en donde se pueda tomar todas las graficas que pueda servir para mostar a autoridades, por ejemplo, Modalidades educativas, Categorias, Departamentos o Zonas, radios, ect. instalar graficas de que puedas instuir que son necesarias, esto lo podemos debatir en el para el roadmap

### 3

En la vista de los establecimientos de Gestión de modalidad http://127.0.0.1:8000/administrativos/modalidades, necesito que en el filtro salga todos los campos, por ejemplo, Radio, tipo de modalidad educativa, categoría, departamento o zona, etc. porque necesito evaluar todo, recuerda que antes usaba un excel, y esto me tiene poder permitir evaluar todo

### 4

En esta seccion http://127.0.0.1:8000/administrativos/, auditorias. el concepto es diferente el diseñado al que tengo pensado

### 4.1

La idea es la siguiente, es que la tabla traiga todos los datos de http://127.0.0.1:8000/administrativos/modalidades, y que pueda filtrar por Ambito (Privado o Público), que pueda filtrar por modalidad, departamento o zona, y nombre de establecimiento, o cue.

Si yo como auditor encuentro que escuela X cargada en EDUGE, esos datos coinciden con los de la base de datos, entonces el estado es correcto, si no coinciden, debo corregirlo, entonces el estado será corregido, pero si no tengo forma de corregirlo en el momento, entonces el estado es pendiente, hasta que yo cerciore que desde dirección de area me rectifique los datos de la base de datos están bien, porque puede pasar que EDUGE esta bien y el mio  no, pero no son casos comunes, por lo que tengo que tener previsto, tambien debo tener el estado de eleminado a un establecimiento que no va

eso significa, que los cambios deben tener estados, 

- correcto, 
- corregido 
- pendiente, 
- eliminado
etc.

### 4.1.1

    Esto implicara hacer un rediseño de la tabla de auditorias, para que pueda filtrar por estado, y que pueda ordenar por fecha, y que pueda buscar por nombre de establecimiento, o cue. y generar los estados, modificar los estados, ect.

### 4.2

Cada estado generado, significa que debe tener un registro de fecha, eso me permitirá generar un informe pdf,con los distintos establecimientos generados por estado, tambien se debería visualizar una especie de dashboard, con los estados generados, evaluar como hacer si hacer un enlace distintos, ruta nueva, como hacer un dashboard, etc.

## TODO ESTO NECESITO QUE SE GENERE UN ROADMAP. EN DOC/ROADMAP/

PARA PODER SER IMPLEMENTADO