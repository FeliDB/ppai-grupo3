// Instancias concretas de todas las clases del sistema
const EventoSismico = require('./models/EventoSismico');
const { PendienteRevision, BloqueadoEnRevision, Rechazado, Autodetectado, SinRevision, DerivadoAExperto, Confirmado } = require('./models/Estado');
const CambioEstado = require('./models/CambioEstado');
const Usuario = require('./models/Usuario');
const Sesion = require('./models/Sesion');
const AlcanceSismo = require('./models/AlcanceSismo');
const ClasificacionSismo = require('./models/ClasificacionSismo');
const OrigenDeGeneracion = require('./models/OrigenDeGeneracion');
const SerieTemporal = require('./models/SerieTemporal');
const MuestraSismica = require('./models/MuestraSismica');
const DetalleMuestraSismica = require('./models/DetalleMuestraSismica');
const TipoDato = require('./models/TipoDato');
const Sismografo = require('./models/Sismografo');
const EstacionSismologica = require('./models/EstacionSismologica');
const GestorRegResEventoSismico = require('./models/GestorRegResEventoSismico');
const PantRegResEventoSismico = require('./models/PantRegResEventoSismico');

// Crear instancias concretas
console.log('=== CREANDO INSTANCIAS CONCRETAS ===');

// 1. Estados - Patrón State completo
const estadoAutodetectado = new Autodetectado();
const estadoPendiente = new PendienteRevision();
const estadoBloqueado = new BloqueadoEnRevision();
const estadoRechazado = new Rechazado();
const estadoSinRevision = new SinRevision();
const estadoDerivadoAExperto = new DerivadoAExperto();
const estadoConfirmado = new Confirmado();

console.log('Estados creados (Patrón State):', {
    autodetectado: estadoAutodetectado.nombreEstado,
    pendiente: estadoPendiente.nombreEstado,
    bloqueado: estadoBloqueado.nombreEstado,
    rechazado: estadoRechazado.nombreEstado,
    sinRevision: estadoSinRevision.nombreEstado,
    derivadoAExperto: estadoDerivadoAExperto.nombreEstado,
    confirmado: estadoConfirmado.nombreEstado
});

// 2. Usuario y Sesión
const usuario1 = new Usuario('analista1', 'pass123');
const sesion = new Sesion('sesion_principal');
sesion.setUsuario(usuario1);
console.log('Usuario creado:', usuario1.nombreUsuario);

// 3. Clasificaciones sísmicas
const alcanceRegional = new AlcanceSismo('Regional', 'Sismo de alcance regional');
const clasificacionSuperficial = new ClasificacionSismo('Superficial', 0, 70);
const origenTectonico = new OrigenDeGeneracion('Tectónico', 'Origen tectónico natural');
console.log('Clasificaciones creadas:', {
    alcance: alcanceRegional.getNombre(),
    clasificacion: clasificacionSuperficial.getNombre(),
    origen: origenTectonico.getNombre()
});

// 4. Estación y Sismógrafo
const estacionCentral = new EstacionSismologica('Estación Central');
const sismografo1 = new Sismografo('SIS001', 'S12345');
sismografo1.estacionSismologica = estacionCentral;
console.log('Estación creada:', estacionCentral.getNombre());

// 5. Datos sísmicos
const tipoDato1 = new TipoDato(0.5);
const detalleMuestra1 = new DetalleMuestraSismica(2.3);
const muestraSismica1 = new MuestraSismica(new Date(), tipoDato1);
muestraSismica1.detallesMuestra.push(detalleMuestra1);

const serieTemporal1 = new SerieTemporal(100, new Date(), new Date());
serieTemporal1.muestrasSismicas.push(muestraSismica1);
serieTemporal1.sismografo = sismografo1;
console.log('Serie temporal creada con', serieTemporal1.muestrasSismicas.length, 'muestras');

// 6. Evento Sísmico
const eventoSismico1 = new EventoSismico(
    new Date('2024-01-15T10:30:00'),
    -34.6037,
    -58.3816,
    -34.6037,
    -58.3816,
    5.2
);
eventoSismico1.estado = estadoPendiente;
eventoSismico1.alcanceSismo = alcanceRegional;
eventoSismico1.clasificacionSismo = clasificacionSuperficial;
eventoSismico1.origenGeneracion = origenTectonico;
eventoSismico1.seriesTemporales.push(serieTemporal1);

// 7. Cambio de Estado
const cambioEstado1 = new CambioEstado();
eventoSismico1.agregarCambioEstado(cambioEstado1);
console.log('Evento sísmico creado:', eventoSismico1.getDatosPrincipales());

// 8. Gestor y Pantalla
const gestor = new GestorRegResEventoSismico();
const pantalla = new PantRegResEventoSismico();
console.log('Gestor y pantalla creados');

// 9. Demostrar flujo de estados - Patrón State
console.log('\n=== DEMOSTRANDO PATRÓN STATE ===');
console.log('Estado inicial:', eventoSismico1.estado.nombreEstado);

// Flujo principal: PendienteRevision -> BloqueadoEnRevision -> Rechazado
eventoSismico1.bloquear();
console.log('Después de bloquear:', eventoSismico1.estado.nombreEstado);

eventoSismico1.rechazar();
console.log('Después de rechazar:', eventoSismico1.estado.nombreEstado);

// Crear otro evento para demostrar otras transiciones
const eventoSismico2 = new EventoSismico(
    new Date('2024-01-16T14:20:00'),
    -32.8895,
    -68.8458,
    -32.8895,
    -68.8458,
    4.8
);
eventoSismico2.estado = new PendienteRevision();
eventoSismico2.agregarCambioEstado(new CambioEstado());

console.log('\nEvento 2 - Estado inicial:', eventoSismico2.estado.nombreEstado);
eventoSismico2.bloquear();
console.log('Evento 2 - Después de bloquear:', eventoSismico2.estado.nombreEstado);
eventoSismico2.confirmar();
console.log('Evento 2 - Después de confirmar:', eventoSismico2.estado.nombreEstado);

// Demostrar transición inválida
console.log('\n=== DEMOSTRANDO TRANSICIONES INVÁLIDAS ===');
try {
    estadoRechazado.bloquear(); // Esto debe fallar
} catch (error) {
    console.log('Error esperado:', error.message);
}

console.log('\n=== INSTANCIAS CREADAS EXITOSAMENTE ===');