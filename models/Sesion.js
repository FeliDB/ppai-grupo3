class Sesion {
    constructor(nombre) {
        this.nombre = nombre;
        this.usuario = null;
    }

    obtenerUsuarioLogueado() {
        return this.usuario;
    }

    setUsuario(usuario) {
        this.usuario = usuario;
    }
}

module.exports = Sesion;