# Aplicación de Grupo de Predicación

## Descripción

Esta aplicación web está diseñada para ayudar en la gestión de personas de un grupo de predicación. Permite registrar información detallada de cada persona, asignar textos bíblicos según sus necesidades, programar visitas de pastoreo y mantener un seguimiento organizado.

## Características

- **Gestión de Personas**: Añadir, editar y eliminar personas con información detallada.
- **Textos Bíblicos**: Biblioteca de textos bíblicos categorizados por temas (Ánimo, Consuelo, Fe, etc.).
- **Visitas Programadas**: Calendario para visualizar y programar visitas de pastoreo.
- **Almacenamiento Local**: Todos los datos se guardan en el dispositivo.
- **Integración con WhatsApp**: Contacto directo a través de WhatsApp.
- **Diseño Responsivo**: Funciona en dispositivos móviles y de escritorio.
- **Modo Oscuro**: Opción para cambiar entre tema claro y oscuro.
- **Exportación/Importación**: Respaldo y restauración de datos.

## Categorías de Textos Bíblicos

- Ánimo
- Consuelo
- Confianza
- Fe
- Esperanza
- Paz
- Predicación
- Amor
- Ansiedad
- Enfermedad
- Pérdida
- Temor
- Agradecimiento

## Cómo Usar

### Gestión de Personas

1. Haz clic en "Añadir" en la sección de Personas para registrar una nueva persona.
2. Completa la información requerida y opcional.
3. Asigna textos bíblicos según las necesidades de la persona.
4. Guarda los cambios.

### Asignación de Textos Bíblicos

1. En el formulario de persona, haz clic en "Asignar Texto".
2. Busca textos por referencia o contenido, o filtra por categoría.
3. Selecciona los textos relevantes y haz clic en "Asignar Seleccionados".

### Programación de Visitas

1. Al añadir o editar una persona, establece la fecha de la próxima visita.
2. Las visitas programadas aparecerán en el calendario y en la lista de próximas visitas.

### Exportación/Importación de Datos

1. Ve a la sección de Ajustes.
2. Haz clic en "Exportar" para guardar todos los datos en un archivo JSON.
3. Haz clic en "Importar" para cargar datos desde un archivo previamente exportado.

## Despliegue como Página Web

Esta aplicación ahora puede ser desplegada como una página web en un servidor. Sigue estos pasos para configurarla:

1. Asegúrate de tener Node.js instalado en tu servidor.
2. Clona o copia todos los archivos del proyecto a tu servidor.
3. Abre una terminal en la carpeta del proyecto.
4. Ejecuta `npm install` para instalar las dependencias.
5. Ejecuta `npm start` para iniciar el servidor.
6. Accede a la aplicación a través de `http://tu-dominio:3000` o `http://localhost:3000` si es local.

### Opciones de Despliegue

- **Servidor Local**: Ideal para uso en una red local o intranet.
- **Hosting Web**: Puedes desplegar la aplicación en servicios como Heroku, Vercel, Netlify, etc.
- **Servidor Propio**: Si tienes un servidor con Node.js, puedes alojar la aplicación allí.

## Uso en Dispositivos iOS

Para usar esta aplicación en tu dispositivo iOS:

1. Abre la aplicación en Safari visitando la URL del servidor.
2. Toca el icono de compartir.
3. Selecciona "Añadir a la pantalla de inicio".
4. Ahora podrás acceder a la aplicación como si fuera una app nativa.

## Notas

- La aplicación sigue funcionando con almacenamiento local en el navegador.
- Todos los datos se almacenan localmente en el dispositivo del usuario.
- Para mantener los datos seguros, recomienda a los usuarios realizar exportaciones periódicas.
- Si deseas implementar almacenamiento en servidor, necesitarás modificar el código para usar una base de datos.

---

Desarrollado para ayudar en la organización y seguimiento del grupo de predicación.