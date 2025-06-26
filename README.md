![image](https://github.com/user-attachments/assets/ffaf4b0e-d99d-4ea0-b4aa-2de6eebfd607)

### 🎬 Actividad Práctica - Gestión de Alquiler de Películas (CAP + UI5 Freestyle)
🎯 Objetivo
Crear una aplicación completa utilizando SAP Cloud Application Programming Model (CAP) en el backend y SAPUI5 freestyle en el frontend para gestionar un videoclub ficticio. La aplicación permitirá:

Visualizar el catálogo de películas


Registrar alquileres


Devolver películas


Controlar el stock disponible


🧰 Requisitos previos
SAP Business Application Studio (BAS)


Node.js


Extensión de CAP instalada


Conocimientos básicos de SAPUI5 y CDS


🗂️ Modelado de Datos
Crear las correspondientes entidades en db/schema.cds. 

📦 Datos iniciales (CSV)
Cargar datos de prueba con extensión .csv en db/data/ 

🔌 Servicios
Crear las correspondientes proyecciones en srv/catalog-service.cds

🔁 Lógica de negocio en srv/catalog-service.js
1. Antes de crear un Rental:
Verificar que haya stock suficiente


Descontar del stock


Incrementar rentedCount


2. En returnRental:
Recuperar el alquiler


Reponer el stock


Eliminar (o marcar) el alquiler como devuelto

🎨 Frontend UI5 Freestyle
Vistas y componentes sugeridos:
1. Vista de Películas
Tabla con:


Título


Género


Stock disponible


Total de veces alquilada


2. Formulario de Alquiler
Selección de película


Nombre del cliente


Cantidad


Botón "Alquilar"


3. Vista de Alquileres
Tabla con:


Cliente


Película


Cantidad


Fecha


Botón "Devolver"

✅ Reglas funcionales
No se puede alquilar más películas que el stock disponible.


Al alquilar, el stock baja y se suma al rentedCount.


Al devolver, el stock aumenta y el alquiler se elimina o marca como devuelto.

🌟 Extensiones opcionales
Filtro por género


Gráfico de películas más alquiladas


Asociación a entidad Customers con historial de alquileres

🎓 Resultado esperado
Una app funcional que muestre en el navegador:

Catálogo actualizado de películas


Alquileres registrados


Cambios reflejados en tiempo real con el backend CAP

