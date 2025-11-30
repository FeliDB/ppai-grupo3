class Sismografo {
    constructor(identificadorSismografo, nroSerie) {
        this.identificadorSismografo = identificadorSismografo;
        this.nroSerie = nroSerie;
        this.estacionSismologica = null;
    }

    getEstacionSismologica() {
        return this.estacionSismologica;
    }
}

module.exports = Sismografo;