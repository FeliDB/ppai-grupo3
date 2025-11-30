const GestorRegResEventoSismico = require('./GestorRegResEventoSismico');

class PantRegResEventoSismico {
    constructor() {
        this.btnRegResultadoRevisionManual = null;
        this.btnSeleccionEvento = null;
        this.btnVisualizarMapa = null;
        this.btnModificarDatos = null;
        this.btnRechazo = null;
        this.gestor = new GestorRegResEventoSismico();
        this.eventoSeleccionado = null;
    }

    async opcRegResultadoRevisionManual() {
        try {
            this.abrirVentana();
            const eventos = await this.gestor.opcRegResultadoRevisionManual();
            if (Array.isArray(eventos)) {
                this.mostrarEventoSismicoParaSeleccion(eventos);
                return eventos;
            } else {
                console.error('Los eventos no son un array:', eventos);
                return [];
            }
        } catch (error) {
            console.error('Error en opcRegResultadoRevisionManual:', error);
            return [];
        }
    }

    abrirVentana() {
        console.log('Ventana abierta para registro de resultados');
    }

    mostrarEventoSismicoParaSeleccion(eventos) {
        console.log('Eventos sísmicos disponibles:', eventos);
        return eventos;
    }

    async tomarSeleccionEventoSismico(eventoId) {
        this.eventoSeleccionado = eventoId;
        const datos = await this.gestor.tomarSeleccionEventoSismico(eventoId);
        this.mostrarDatosEventoSismicoSeleccionado(datos);
        this.habilitarSeleccionMapa();
        this.habilitarModificacionDatos();
        this.solicitarSeleccionRechazo();
        return datos;
    }

    mostrarDatosEventoSismicoSeleccionado(datos) {
        console.log('Datos del evento seleccionado:', datos);
    }

    habilitarSeleccionMapa() {
        this.btnVisualizarMapa = true;
        console.log('Mapa habilitado');
    }

    habilitarModificacionDatos() {
        this.btnModificarDatos = true;
        console.log('Modificación de datos habilitada');
    }

    solicitarSeleccionRechazo() {
        this.btnRechazo = true;
        console.log('Opción de rechazo habilitada');
    }

    async tomarSeleccionRechazo() {
        if (this.validarDatos()) {
            await this.gestor.rechazarEventoSismico(this.eventoSeleccionado);
            this.gestor.finCU();
            return true;
        }
        return false;
    }

    validarDatos() {
        return this.eventoSeleccionado !== null;
    }
}

module.exports = PantRegResEventoSismico;