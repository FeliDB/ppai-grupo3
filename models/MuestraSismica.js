class MuestraSismica {
    constructor(fechaHoraMuestra, tipoDato) {
        this.fechaHoraMuestra = fechaHoraMuestra;
        this.tipoDato = tipoDato;
        this.detallesMuestra = [];
    }

    getMuestraSismica() {
        return this;
    }

    getDetalleMuestraSismica() {
        return this.detallesMuestra;
    }
}

module.exports = MuestraSismica;