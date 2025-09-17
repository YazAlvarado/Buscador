# Buscador de Artículos Académicos

Este proyecto es un buscador de artículos académicos que obtiene información de varias fuentes científicas (OpenAlex, PubMed, Google Scholar, Semantic Scholar). Permite filtrar por fuente y año, paginar resultados y exportarlos a Excel.

---

## Requisitos

- Node.js v18+  
- npm (v8+ recomendada)  
- Navegador moderno (Chrome, Edge, Firefox)

---

## Instalación y Ejecución

### 1. Clonar el repositorio


git clone https://github.com/YazAlvarado/Buscador.git
cd buscador-articulos
2. Crear la rama de trabajo
bash

git checkout -b propuesta1
Backend
Entrar a la carpeta del backend:


cd backend
Instalar dependencias:


npm install express axios cors nodemon dotenv
express → servidor backend.

axios → realizar peticiones HTTP a APIs externas.

cors → habilitar solicitudes desde el frontend.

nodemon → reinicio automático del servidor al cambiar archivos.

dotenv → manejo de variables de entorno.

Ejecutar el backend:
npm run dev
El backend correrá en http://localhost:4000

Frontend
Entrar a la carpeta del frontend:

cd ../frontend
Instalar dependencias:

npm install react react-dom axios xlsx file-saver tailwindcss postcss autoprefixer vite
react, react-dom → librería principal de React.

axios → para hacer peticiones HTTP al backend.

xlsx → generar archivos Excel.

file-saver → descargar archivos desde el navegador.

tailwindcss, postcss, autoprefixer → estilos y utilidades CSS.

vite → servidor de desarrollo rápido para React.

Inicializar Tailwind (si aún no lo has hecho):
npx tailwindcss init -p
Ejecutar el frontend:

npm run dev
El frontend correrá en http://localhost:5173

Uso
Por default, el buscador inicia con el término:
"Hospital Regional de Alta Especialidad de Ixtapaluca"

Puedes filtrar por fuente y año.

Los resultados se muestran en tabla paginada.

Exporta los resultados a Excel usando el botón "Exportar a Excel".

# Estructura de carpetas

buscador-articulos/
├─ backend/
│  ├─ src/
│  │  ├─ servidor.js
│  │  ├─ rutas/busqueda.js
│  │  └─ ...
├─ frontend/
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  ├─ componentes/
│  │  │  ├─ FormularioBusqueda.jsx
│  │  │  └─ TablaResultados.jsx
│  │  └─ ...
├─ .gitignore
└─ README.md
Notas---------------------
Asegúrate de que el backend esté corriendo antes de abrir el frontend.
Semantic Scholar puede limitar las solicitudes; si sale error 429, espera un momento.
Personaliza el título, subtítulo y colores en App.jsx según tus preferencias.

Personaliza el título, subtítulo y colores en App.jsx según tus preferencias.

