# Agrozalcoalt

Aplicación web desarrollada como proyecto del Parcial 3 de la cátedra **Desarrollo de Aplicaciones Web**.

Agrozalcoalt permite conectar a usuarios interesados en productos agrícolas con agricultores que publican sus productos. Utiliza Angular y Firebase para administrar la autenticación, los perfiles y las publicaciones.

## Funciones principales

- Registro e inicio de sesión de usuarios.
- Diferenciación de roles y protección de rutas para agricultores.
- Publicación de productos agrícolas.
- Consulta de un catálogo de productos.
- Visualización y administración de publicaciones propias.
- Edición y eliminación de productos.
- Administración de información de perfil.
- Organización de la aplicación mediante rutas y carga diferida de componentes.

## Tecnologías utilizadas

- Angular 22
- TypeScript 6
- RxJS 7
- Angular Router
- Firebase Authentication
- Cloud Firestore
- Tailwind CSS 4
- PostCSS
- Material Icons
- SunCalc
- Vitest
- Angular CLI
- Firebase Hosting
- Netlify

## Requisitos

Antes de iniciar el proyecto necesita:

- Node.js 20 o una versión compatible con Angular 22.
- npm 11.
- Angular CLI 22.
- Una cuenta de Firebase.
- Un proyecto creado en Firebase con Authentication y Firestore habilitados.

## Instalación

1. Clone el repositorio:

```bash
git clone https://github.com/angel00333/Agrozalcoalt.git
cd Agrozalcoalt
```

2. Instale las dependencias:

```bash
npm install
```

3. Configure Firebase.

El proyecto utiliza implementaciones de Firebase ubicadas dentro de `src/app/core/infrastructure/repositories`. La conexión debe declararse en el módulo de configuración correspondiente y exportar las instancias de Authentication y Firestore utilizadas por los repositorios.

## Configuración de Firebase

En la consola de Firebase:

1. Active **Authentication**.
2. Seleccione el método de inicio de sesión por correo electrónico y contraseña.
3. Cree una base de datos de **Cloud Firestore**.
4. Configure las siguientes colecciones:

- `usuarios`: información de los usuarios y sus roles.
- `productos`: publicaciones agrícolas.

Ejemplo de documento en `usuarios`:

```json
{
  "nombre": "Usuario ejemplo",
  "correo": "usuario@example.com",
  "telefono": "0000-0000",
  "departamento": "San Salvador",
  "direccion": "Dirección de ejemplo",
  "rol": "agricultor",
  "estadoPerfil": "activo"
}
```

Ejemplo de documento en `productos`:

```json
{
  "nombre": "Producto agrícola",
  "descripcion": "Descripción del producto",
  "precio": 10,
  "cantidad": 20,
  "unidad": "unidades",
  "usuarioId": "ID_DEL_USUARIO"
}
```

Antes de publicar la aplicación en Internet, configure las reglas de seguridad de Authentication y Firestore en lugar de utilizar permisos abiertos.

## Ejecución local

Inicie el servidor de desarrollo:

```bash
npm start
```

O utilice directamente Angular CLI:

```bash
ng serve
```

Acceda desde el navegador a:

```text
http://localhost:4200
```

## Construcción de producción

Genere los archivos optimizados:

```bash
npm run build
```

Los archivos se guardarán en:

```text
dist/Agrozalcoalt/browser
```

## Despliegue

### Firebase Hosting

Antes del despliegue, tenga instalado Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

El archivo `firebase.json` está configurado para publicar el contenido de `dist/Agrozalcoalt/browser`.

### Netlify

El archivo `netlify.toml` define:

- Comando de construcción: `npm run build -- --configuration production`
- Directorio público: `dist/Agrozalcoalt/browser`
- Redirección de rutas hacia `index.html`

## Pruebas

Ejecute las pruebas unitarias con:

```bash
npm test
```

Las pruebas utilizan Vitest a través de Angular CLI.

## Integrantes del proyecto

- geovani-moran
- angel0033
- rodrigo-valentin
- aida-patricia
