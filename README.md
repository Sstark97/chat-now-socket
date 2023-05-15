# ChatNow

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

## Tabla de contenidos

- [ChatNow](#ChatNow)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Tecnologías aplicadas](#tecnologías-aplicadas)
  - [Requerimientos](#requerimientos)
  - [Instalación local](#instalación-local)
  - [Uso](#uso)
  - [Licencia](#licencia)
  - [Enlaces](#enlaces)

<div style="display:flex;align-items:center;justify-content:space-between;width=100%;margin-bottom:2rem;">
    <h2>El proyecto</h2>
    <img src="https://i.ibb.co/M5pYPY0/icon-256x256.png">
</div>

<a id="proyecto"></a>

La aplicación consiste en una aplicación web de mensajería instantánea (como Whatsapp), en la que un usuario se podrá registrar, iniciar sesión, agregar contactos y mandar mensajes a estos mismos. 

## Tecnologías aplicadas
<a id="tecnologias"></a>
-  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
-  ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
-  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
-  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
-  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
-  ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![DigitalOcean](https://img.shields.io/badge/DigitalOcean-%230167ff.svg?style=for-the-badge&logo=digitalOcean&logoColor=white)
- ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
- ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

## Requerimientos
<a id="requerimientos"></a>

- Node v18.14.2
- npm 8.19.2

## Instalación local
<a id="instalacion"></a>

Primeramente debemos clonar el repositorio para tenerlo de manera local:

```bash=
$ git clone https://github.com/Sstark97/chat-now-socket.git
```
Debemos tener en cuenta que nuestra aplicación hace uso de variables de entorno, así que para poder usar nuestra Base de Datos de manera local tendremos que crear un fichero <span style="color:#6f11eb">`.env`</span> en el directorio raíz, siguiendo la siguiente estructura:

```js=
DATABASE_URL=
PORT=
```

Una vez lo tengamos listo, tendremos que instalar las dependencias para que nuestra aplicación pueda funcionar, para ello tendremos que ejecutar <span style="color:#6f11eb">`npm`</span>:

```bash=
$ npm install
```

Tras eso, podemos ejecutar nuestra aplicación de la siguiente manera:

```bash=
$ npm run start
```

Con todo esto ya estaríamos listos para usar nuestra aplicación.

--- 

La documentación de la API se encuentra en el endpoint <span style="color:#6f11eb">`/api-docs`</span>

## Licencia
<a id="licencia"></a>

Distribuido bajo licencia MIT.

## Enlaces
<a id="enlaces"></a>

- [Enlace a la web](https://chat-now-socket-server.onrender.com/)
- [Enlace a la documentación](https://chat-now-socket-server.onrender.com/api-docs)
