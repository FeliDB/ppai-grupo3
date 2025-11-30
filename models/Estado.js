class Estado {
    constructor(nombreEstado, ambito) {
        this.nombreEstado = nombreEstado;
        this.ambito = ambito;
    }

    setFechaHoraFin() {
        // Implementación base
    }

    crearEstadoSiguiente() {
        // Implementación base
    }
}

class PendienteRevision extends Estado {
    constructor() {
        super('PendienteRevision', 'Revision');
    }

    bloquear() {
        return new BloqueadoEnRevision();
    }

    crearEstadoSiguiente() {
        return new BloqueadoEnRevision();
    }

    crearCambioEstado() {
        const CambioEstado = require('./CambioEstado');
        return new CambioEstado();
    }
}
 
class BloqueadoEnRevision extends Estado {
    constructor() {
        super('BloqueadoEnRevision', 'Revision');
    }

    rechazar() {
        return new Rechazado();
    }

    crearEstadoSiguiente() {
        return new Rechazado();
    }

    crearCambioEstado() {
        const CambioEstado = require('./CambioEstado');
        return new CambioEstado();
    }
}

class Rechazado extends Estado {
    constructor() {
        super('Rechazado', 'Revision');
    }
}

class Autodetectado extends Estado {
    constructor() {
        super('Autodetectado', 'Sistema');
    }
}

module.exports = { Estado, PendienteRevision, BloqueadoEnRevision, Rechazado, Autodetectado };