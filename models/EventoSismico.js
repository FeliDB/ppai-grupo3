const { PendienteRevision, BloqueadoEnRevision, Rechazado, Confirmado, DerivadoAExperto } = require('./Estado');
const CambioEstado = require('./CambioEstado');

class EventoSismico {
    constructor(fechaHoraOcurrencia, latitudEpicentro, longitudEpicentro, latitudHipocentro, longitudHipocentro, valorMagnitud) {
        this.fechaHoraOcurrencia = fechaHoraOcurrencia;
        this.latitudEpicentro = latitudEpicentro;
        this.longitudEpicentro = longitudEpicentro;
        this.latitudHipocentro = latitudHipocentro;
        this.longitudHipocentro = longitudHipocentro;
        this.valorMagnitud = valorMagnitud;
        this.estado = null;
        this.cambiosEstado = [];
        this.alcanceSismo = null;
        this.clasificacionSismo = null;
        this.origenGeneracion = null;
        this.seriesTemporales = [];
    }

    esAutodetectado() {
        return this.estado && this.estado.nombreEstado === 'Autodetectado';
    }

    esPendienteDeRevision() {
        return this.estado && this.estado.nombreEstado === 'PendienteRevision';
    }

    getDatosPrincipales() {
        return {
            fechaHoraOcurrencia: this.getFechaHoraOcurrencia(),
            latitudEpicentro: this.getLatitudEpicentro(),
            longitudEpicentro: this.getLongitudEpicentro(),
            latitudHipocentro: this.getLatitudHipocentro(),
            longitudHipocentro: this.getLongitudHipocentro(),
            magnitud: this.getMagnitud()
        };
    }

    getFechaHoraOcurrencia() {
        return this.fechaHoraOcurrencia;
    }

    getLatitudEpicentro() {
        return this.latitudEpicentro;
    }

    getLongitudEpicentro() {
        return this.longitudEpicentro;
    }

    getLatitudHipocentro() {
        return this.latitudHipocentro;
    }

    getLongitudHipocentro() {
        return this.longitudHipocentro;
    }

    getMagnitud() {
        return this.valorMagnitud;
    }

    bloquear() {
        // Paso 28: EventoSismico.bloquear() delega al estado
        const cambioActual = this.buscarUltimoCambioEstado();
        if (cambioActual) {
            cambioActual.setFechaHoraFin(); // Paso 30
        }
        
        const nuevoEstado = this.estado.crearEstadoSiguiente(); // Paso 31
        const nuevoCambio = this.estado.crearCambioEstado(); // Paso 33
        
        this.agregarCambioEstado(nuevoCambio); // Paso 35
        this.setEstadoActual(nuevoEstado); // Paso 36
    }

    rechazar() {
        // Paso 64: EventoSismico.rechazar() delega al estado
        const cambioActual = this.buscarUltimoCambioEstado();
        if (cambioActual) {
            cambioActual.setFechaHoraFin(); // Paso 66
        }
        
        const nuevoEstado = this.estado.crearEstadoSiguiente(); // Paso 67
        const nuevoCambio = this.estado.crearCambioEstado(); // Paso 69
        
        this.agregarCambioEstado(nuevoCambio); // Paso 71
        this.setEstadoActual(nuevoEstado); // Paso 72
    }

    buscarUltimoCambioEstado() {
        return this.cambiosEstado.find(cambio => cambio.esActual()) || null;
    }

    agregarCambioEstado(cambioEstado) {
        this.cambiosEstado.push(cambioEstado);
    }

    setEstadoActual(estado) {
        this.estado = estado;
    }

    buscarDatosSismicos() {
        return {
            alcance: this.alcanceSismo ? this.alcanceSismo.getNombre() : null,
            clasificacion: this.clasificacionSismo ? this.clasificacionSismo.getNombre() : null,
            origen: this.origenGeneracion ? this.origenGeneracion.getNombre() : null
        };
    }

    buscarSeriesTemporales() {
        return this.seriesTemporales;
    }

    clasificarPorEstacion() {
        // Implementación de clasificación por estación
    }
}

module.exports = EventoSismico;