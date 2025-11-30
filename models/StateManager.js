const { 
    Autodetectado, 
    PendienteRevision, 
    BloqueadoEnRevision, 
    Rechazado, 
    SinRevision, 
    DerivadoAExperto, 
    Confirmado 
} = require('./Estado');

/**
 * Gestor de estados que implementa el patrón State
 * Maneja las transiciones válidas entre estados
 */
class StateManager {
    static crearEstado(nombreEstado) {
        switch (nombreEstado) {
            case 'Autodetectado':
                return new Autodetectado();
            case 'PendienteRevision':
                return new PendienteRevision();
            case 'BloqueadoEnRevision':
                return new BloqueadoEnRevision();
            case 'Rechazado':
                return new Rechazado();
            case 'SinRevision':
                return new SinRevision();
            case 'DerivadoAExperto':
                return new DerivadoAExperto();
            case 'Confirmado':
                return new Confirmado();
            default:
                throw new Error(`Estado desconocido: ${nombreEstado}`);
        }
    }

    static obtenerTransicionesValidas(estado) {
        const transiciones = {
            'Autodetectado': ['PendienteRevision'],
            'PendienteRevision': ['BloqueadoEnRevision'],
            'BloqueadoEnRevision': ['Rechazado', 'Confirmado', 'DerivadoAExperto'],
            'SinRevision': ['Confirmado'],
            'DerivadoAExperto': ['Confirmado', 'Rechazado'],
            'Rechazado': [], // Estado final
            'Confirmado': [] // Estado final
        };

        return transiciones[estado.nombreEstado] || [];
    }

    static esTransicionValida(estadoActual, estadoDestino) {
        const transicionesValidas = this.obtenerTransicionesValidas(estadoActual);
        return transicionesValidas.includes(estadoDestino);
    }

    static obtenerEstadosFinales() {
        return ['Rechazado', 'Confirmado'];
    }

    static esEstadoFinal(estado) {
        return this.obtenerEstadosFinales().includes(estado.nombreEstado);
    }
}

module.exports = StateManager;