class SerieTemporal {
    constructor(frecuenciaMuestreo, fechaHoraRegistroMuestras, fechaHoraRegistro) {
        this.frecuenciaMuestreo = frecuenciaMuestreo;
        this.fechaHoraRegistroMuestras = fechaHoraRegistroMuestras;
        this.fechaHoraRegistro = fechaHoraRegistro;
        this.muestrasSismicas = [];
        this.sismografo = null;
    }

    getSerieTemporal() {
        return this;
    }

    getMuestraSismica() {
        return this.muestrasSismicas;
    }
}

module.exports = SerieTemporal;