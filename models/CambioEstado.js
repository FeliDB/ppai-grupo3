class CambioEstado {
    constructor() {
        this.fechaHoraInicio = new Date();
        this.fechaHoraFin = null;
    }

    esActual() {
        return this.fechaHoraFin === null;
    }

    setFechaHoraFin() {
        this.fechaHoraFin = new Date();
    }
}

module.exports = CambioEstado;