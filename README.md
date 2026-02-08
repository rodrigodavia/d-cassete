# D-Cassete

> Digital format for music consumption

## Prompt Architect
El proyecto consistente una plataforma para escuchar música simulando el consumo de música de décadas anteriores con cintas de cassete.
Para ello se ha definido un formato de archivos llamado DGC (Digital Cassete) que consiste en un archivo ZIP con la siguiente estructura:
```
tape
|-- metadata.json  # Objeto JSON con las propiedades de cada cinta
|-- audios/        # Directorio con los archivos .mp3 para reproducir las canciones
|   # track1.mp3
|   # ...
|-- cover.png      # Cada cinta puede contener una imagen de portada
```
Por ahora las cintas están directamente subidas con dicho formato a un backet S3 determinado de AWS, la forma de acceder a estas es mediante un endpoint generado en dicha cuenta AWS que genera una *Presign URL* de una archivo determinado del bucket pasado como QueryParameter para dicho endpoint.
El proyecto tiene dos fases:
- **Vista previa web**: cada cinta se puede compartir en función a un enlace web, el cual constará del futuro nombre de dominio de la plataforma (ej, d-cassete.tech) y el nombre del archivo de cinta en cuestión como QueryParameter. Una vez se carga este y se obtiene dicho archivo desde el bucket S3, se carga una interfaz web Vue para reproducir la cinta simulando como era antes, con cada cinta existirá un botón de `Guardar cinta` el cual almacenará esta en el dispositivo de destino en una ruta concreta (ej, /d-cassete).
- **App móvil**: el objetivo de esta plataforma es tener una App nativa que actue como biblioteca de cintas, sin conexión a internet ni nada, únicamente deberá listar y reproducir los archivos DGC guardados en una ruta determinada del dispositivo de destino (ej, /d-cassete). Desde la aplicación para cada cinta existirá un botón de compartir, el cual subirá la cinta al bucket S3 y compartirá un enlace que sea `https://d-cassete.com?tape=cinta.dgc`, dicho enlace será el que se comparta por cualquier vía y reproducirá la cinta de mediante la vista previa Web. Dicho aplicación deberá estar hecha en Flutter.
Una vez clara la estructura del proyecto y como proceder, observarás el directorio @client/web donde se ha comenzado el desarrollo de la vista previa web Vue, para que puedas observar como deberá ser el diseño de la aplicación.
Resume le propósito y estructura del proyecto, sugiere mejoras tecnológicas para este y de UX, y realiza un plan de ejecución step-by-step para comenzar a proceder con el desarrollo de la plataforma, esperando autorización del usuario para proceder con cada paso.
Además almacena este input que te proporciono en memoria para tener claro el proyecto con cada chat que se comience en este directorio.
