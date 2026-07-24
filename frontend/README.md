# 🎨 Frontend - Monitor Predictivo de Apagones

Aplicación web interactiva y responsiva desarrollada con **Next.js 16**, **React 19**, **TypeScript** y **Tailwind CSS v4**, organizada estrictamente bajo los principios de **Clean Architecture** (Arquitectura Limpia).

---

## 🎯 Rol de esta Carpeta en el Proyecto

La carpeta `frontend/` representa la **Capa de Presentación e Interacción con el Usuario** del sistema. Sus funciones principales son:
1. Consumir la API REST entregada por el backend en Python (`/api/prediccion_actual` y `/api/reportar_apagon`).
2. Presentar de forma visual e intuitiva la probabilidad predictiva de apagón a nivel municipal e hiperlocal por colonia (16 colonias de Lázaro Cárdenas, Michoacán).
3. Mostrar las variables climáticas actuales (temperatura, humedad, velocidad del viento).
4. Proporcionar un canal de participación ciudadana (*Human-in-the-loop*) para enviar reportes manuales de apagón.
5. Ofrecer soporte offline mediante respaldo automático en caché local (`localStorage`) en caso de fallos de red.

---

## 🛠️ Tecnologías, Lenguajes, Frameworks y Librerías

### 1. Lenguajes
* **TypeScript (v5.x)**: Lenguaje principal de programación con tipado estático estricto.
* **HTML5 / CSS3**: Estructuración semántica de componentes y estilos con Tailwind CSS.

### 2. Frameworks
* **Next.js (v16.2.10)**: Framework de React con soporte para App Router, optimización de fuentes y empaquetador Turbopack.
* **React (v19.2.4)**: Librería para la creación de componentes reactivos basándose en el estado.
* **Tailwind CSS (v4)**: Framework de CSS utility-first para diseño responsivo.

### 3. Librerías
* **`lucide-react`**: Colección de iconos vectoriales para elementos UI (alertas, termómetros, gotas, viento, rayos).
* **`react-dom`**: Renderizado de árbol de componentes en el navegador.
* **`@tailwindcss/postcss` & `postcss`**: Procesadores de CSS para compilación de estilos.
* **`eslint` & `eslint-config-next`**: Análisis estático de código e inspección de calidad.

---

## 🏛️ Estructura de Arquitectura Limpia (`src/`)

```text
src/
├── core/                        # 🟢 DOMINIO Y CASOS DE USO (Lógica pura de negocio)
│   ├── domain/                  # Entidades (DatosAmbientales, DatosPrediccion, ReporteApagonPayload)
│   │   ├── models/
│   │   └── repositories/        # Interfaz IPrediccionRepository
│   └── usecases/                # Casos de uso (ObtenerPrediccionActualUseCase, EnviarReporteApagonUseCase)
│
├── infrastructure/              # 🔵 INFRAESTRUCTURA Y DATOS (APIs y Almacenamiento)
│   ├── api/                     # fetchClient y rutas API REST (apiRoutes.ts)
│   ├── repositories/            # ApagonesRepositoryImpl (Implementación concreta del repositorio)
│   └── storage/                 # cacheStorage (Manejo de caché local en localStorage)
│
├── presentation/                # 🟡 PRESENTACIÓN (Componentes visuales y utilidades UI)
│   ├── components/              # Header, Cards de Riesgo, Modal, Tabla de Colonias, Banners
│   ├── pages/                   # Vista contenedora principal (DashboardPage.tsx)
│   └── utils/                   # Helpers de semáforo y formato de riesgos (riesgoUtils.ts)
│
└── app/                         # 🔴 FRAMEWORK (Next.js App Router)
    ├── layout.tsx               # Raíz HTML y SEO Metadata
    ├── page.tsx                 # Punto de entrada de la página principal
    └── globals.css              # Estilos CSS globales
```

---

## 🚀 Instrucciones de Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
   *Disponible en `http://localhost:3000`.*

3. Compilar para producción:
   ```bash
   npm run build
   ```
