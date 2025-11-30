# Sistema de Registro de Eventos Sísmicos

Sistema desarrollado en Node.js puro siguiendo los diagramas de clase y secuencia proporcionados.

## Estructura del Proyecto

```
ppai-grupo3/
├── models/                     # Clases del dominio
│   ├── Estado.js              # Estados y sus subclases
│   ├── EventoSismico.js       # Clase principal de eventos
│   ├── GestorRegResEventoSismico.js  # Controlador principal
│   ├── PantRegResEventoSismico.js    # Interfaz de usuario
│   └── [otras clases...]
├── public/
│   └── index.html             # Interfaz web
├── server.js                  # Servidor HTTP
├── database.sql               # Esquema de base de datos
├── instancias.js             # Ejemplos de uso
└── package.json
```

## Instalación con Docker

1. Iniciar contenedor MySQL:
```bash
docker-compose up -d
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor:
```bash
npm start
```

4. Abrir navegador en: http://localhost:3000

### Inicio rápido (Windows):
```bash
start.bat
```

### Comandos Docker útiles:
```bash
# Ver logs del contenedor
docker-compose logs mysql

# Detener contenedor
docker-compose down

# Reiniciar contenedor
docker-compose restart
```

## Flujo de Secuencia Implementado

1. **opcRegResultadoRevisionManual()** - Inicia el proceso
2. **buscarEventosSismicosAutoDetectados()** - Busca eventos pendientes
3. **tomarSeleccionEventoSismico()** - Selecciona evento específico
4. **bloquearEventoSismico()** - Cambia estado a "BloqueadoEnRevision"
5. **buscarDatosSismicos()** - Obtiene datos del evento
6. **rechazarEventoSismico()** - Cambia estado a "Rechazado"

## Clases Implementadas

- **EventoSismico**: Entidad principal con datos sísmicos
- **Estado**: Jerarquía de estados (Pendiente, Bloqueado, Rechazado, etc.)
- **GestorRegResEventoSismico**: Lógica de negocio
- **PantRegResEventoSismico**: Interfaz de usuario
- **Usuario/Sesion**: Manejo de autenticación
- **SerieTemporal/MuestraSismica**: Datos de medición
- **AlcanceSismo/ClasificacionSismo**: Metadatos

## Uso

```javascript
// Ejecutar instancias de ejemplo
node instancias.js

// Iniciar servidor web
node server.js
```