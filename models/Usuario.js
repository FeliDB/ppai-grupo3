class Usuario {
    constructor(nombreUsuario, contrasena) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
    }

    getEmpleado() {
        return this;
    }
}

module.exports = Usuario;