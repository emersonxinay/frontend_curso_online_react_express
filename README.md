# Plataforma de Cursos - Frontend

Plataforma de aprendizaje en línea desarrollada con React y Tailwind CSS.

## Características

- 📚 Catálogo de cursos con filtros y búsqueda
- 👤 Sistema de autenticación de usuarios
- 🎓 Panel de instructor para gestión de cursos
- 📝 Sistema de seguimiento de progreso
- 🏆 Generación de certificados
- 💳 Integración de pagos
- 📱 Diseño responsive

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Conexión a Internet

## Instalación

1. Instalar dependencias:
```bash
npm install
```
2. Configurar variables de entorno:
```bash
cp .env.example .env
 ```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
 ```

## Estructura del Proyecto
```plaintext
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── context/       # Contextos de React
│   ├── hooks/         # Hooks personalizados
│   ├── config/        # Configuraciones
│   ├── assets/        # Recursos estáticos
│   └── utils/         # Utilidades y helpers
├── public/            # Archivos públicos
└── index.html         # Punto de entrada HTML
 ```

## Scripts Disponibles
- npm run dev : Inicia el servidor de desarrollo
- npm run build : Construye la aplicación para producción
- npm run preview : Vista previa de la versión de producción
- npm run lint : Ejecuta el linter
- npm test : Ejecuta las pruebas
## Tecnologías Principales
- React
- React Router
- Tailwind CSS
- Axios
- jsPDF
- html2canvas
## Características de Desarrollo
- 🎨 Diseño moderno con Tailwind CSS
- 🔒 Manejo seguro de autenticación
- 📱 Interfaces responsivas
- 🔄 Estado global con Context API
- 🎯 Rutas protegidas
- 📄 Generación de PDF para certificados
## Convenciones de Código
- Componentes en PascalCase
- Hooks personalizados con prefijo 'use'
- Archivos de utilidades en camelCase
- Estilos con Tailwind CSS
## Contribución
1. Fork del repositorio
2. Crear rama para nueva característica
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request