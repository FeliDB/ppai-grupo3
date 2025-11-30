const mysql = require('mysql2/promise');
const EventoSismico = require('./EventoSismico');
const { PendienteRevision, Autodetectado, BloqueadoEnRevision, Rechazado, SinRevision, DerivadoAExperto, Confirmado } = require('./Estado');
const Sesion = require('./Sesion');
const Usuario = require('./Usuario');

class GestorRegResEventoSismico {
    constructor() {
        this.eventoSismico = null;
        this.estado = null;
        this.fechaHoraActual = null;
        this.usuarioLogueado = null;
        this.serieTemporal = null;
        this.sesion = new Sesion('sesion_actual');
        this.db = null;
        this.eventoSeleccionado = null;
    }

    async conectarDB() {
        try {
            this.db = await mysql.createConnection({
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: 'root123',
                database: 'sistema_sismico'
            });
            console.log('Conexión a MySQL exitosa');
        } catch (error) {
            console.error('Error conectando a MySQL:', error);
            throw error;
        }
    }

    async opcRegResultadoRevisionManual() {
        await this.conectarDB();
        return await this.buscarEventosSismicosAutoDetectados();
    }

    async buscarEventosSismicosAutoDetectados() {
        try {
            console.log('Buscando eventos autodetectados y pendientes...');
            const [rows] = await this.db.execute(`
                SELECT e.*, est.nombreEstado, a.nombre as alcance, c.nombre as clasificacion, o.nombre as origen
                FROM eventos_sismicos e 
                JOIN estados est ON e.estado_id = est.id 
                LEFT JOIN alcance_sismo a ON e.alcance_id = a.id
                LEFT JOIN clasificacion_sismo c ON e.clasificacion_id = c.id
                LEFT JOIN origen_generacion o ON e.origen_id = o.id
                WHERE est.nombreEstado IN ('Autodetectado', 'PendienteRevision')
                ORDER BY e.fechaHoraOcurrencia DESC
            `);
            
            console.log(`Encontrados ${rows.length} eventos en BD:`);
            rows.forEach(row => console.log(`ID: ${row.id}, Estado: ${row.nombreEstado}`));
            
            const eventos = [];
            for (const row of rows) {
                const evento = new EventoSismico(
                    row.fechaHoraOcurrencia,
                    row.latitudEpicentro,
                    row.longitudEpicentro,
                    row.latitudHipocentro,
                    row.longitudHipocentro,
                    row.valorMagnitud
                );
                
                // Asignar datos relacionados
                const AlcanceSismo = require('./AlcanceSismo');
                const ClasificacionSismo = require('./ClasificacionSismo');
                const OrigenDeGeneracion = require('./OrigenDeGeneracion');
                
                if (row.alcance) evento.alcanceSismo = new AlcanceSismo(row.alcance, '');
                if (row.clasificacion) evento.clasificacionSismo = new ClasificacionSismo(row.clasificacion, 0, 0);
                if (row.origen) evento.origenGeneracion = new OrigenDeGeneracion(row.origen, '');
                
                if (row.nombreEstado === 'Autodetectado') {
                    evento.estado = new Autodetectado();
                } else {
                    evento.estado = new PendienteRevision();
                }
                
                if (evento.esAutodetectado() || evento.esPendienteDeRevision()) {
                    const datosPrincipales = evento.getDatosPrincipales();
                    datosPrincipales.id = row.id;
                    eventos.push(datosPrincipales);
                }
            }
            
            console.log(`Eventos procesados para mostrar: ${eventos.length}`);
            return this.ordenarEventosSismicos(eventos);
        } catch (error) {
            console.error('Error en buscarEventosSismicosAutoDetectados:', error);
            return [];
        }
    }

    ordenarEventosSismicos(eventos) {
        return eventos.sort((a, b) => new Date(b.fechaHoraOcurrencia) - new Date(a.fechaHoraOcurrencia));
    }

    async tomarSeleccionEventoSismico(eventoId) {
        this.tomarFechaHoraActual();
        await this.buscarEmpleadoLogueado();
        await this.bloquearEventoSismico(eventoId);
        return await this.buscarDatosSismicos(eventoId);
    }

    tomarFechaHoraActual() {
        this.fechaHoraActual = new Date();
    }

    async buscarEmpleadoLogueado() {
        const usuario = this.sesion.obtenerUsuarioLogueado();
        if (!usuario) {
            const [rows] = await this.db.execute('SELECT * FROM usuarios LIMIT 1');
            const nuevoUsuario = new Usuario(rows[0].nombreUsuario, rows[0].contrasena);
            this.sesion.setUsuario(nuevoUsuario);
        }
        this.usuarioLogueado = this.sesion.obtenerUsuarioLogueado().getEmpleado();
    }

    async bloquearEventoSismico(eventoId) {
        console.log(`Bloqueando evento ID: ${eventoId}`);
        
        // Asegurar que tenemos fechaHoraActual
        if (!this.fechaHoraActual) {
            this.tomarFechaHoraActual();
        }
        
        const [rows] = await this.db.execute(`
            SELECT e.*, a.nombre as alcance, c.nombre as clasificacion, o.nombre as origen
            FROM eventos_sismicos e
            LEFT JOIN alcance_sismo a ON e.alcance_id = a.id
            LEFT JOIN clasificacion_sismo c ON e.clasificacion_id = c.id
            LEFT JOIN origen_generacion o ON e.origen_id = o.id
            WHERE e.id = ?
        `, [eventoId]);
        
        if (rows.length === 0) {
            throw new Error(`Evento con ID ${eventoId} no encontrado`);
        }
        
        console.log(`Estado actual del evento: ${rows[0].estado_id}`);
        
        const evento = new EventoSismico(
            rows[0].fechaHoraOcurrencia,
            rows[0].latitudEpicentro,
            rows[0].longitudEpicentro,
            rows[0].latitudHipocentro,
            rows[0].longitudHipocentro,
            rows[0].valorMagnitud
        );
        evento.estado = new PendienteRevision();
        
        // Obtener ID del estado BloqueadoEnRevision
        const [estadoRows] = await this.db.execute(
            'SELECT id FROM estados WHERE nombreEstado = "BloqueadoEnRevision"'
        );
        
        if (estadoRows.length === 0) {
            throw new Error('Estado BloqueadoEnRevision no encontrado en la base de datos');
        }
        
        const estadoBloqueadoId = estadoRows[0].id;
        console.log(`ID estado BloqueadoEnRevision: ${estadoBloqueadoId}`);
        
        // Actualizar estado del evento
        console.log('Actualizando estado del evento...');
        const result2 = await this.db.execute(
            'UPDATE eventos_sismicos SET estado_id = ? WHERE id = ?', 
            [estadoBloqueadoId, eventoId]
        );
        console.log(`Filas afectadas en eventos_sismicos: ${result2[0].affectedRows}`);
        
        // Ejecutar transición de estado en el objeto
        evento.bloquear();
        
        // Guardar datos relacionados
        this.eventoSeleccionado = {
            alcance: rows[0].alcance,
            clasificacion: rows[0].clasificacion,
            origen: rows[0].origen
        };
        
        this.eventoSismico = evento;
        console.log('Evento bloqueado exitosamente');
    }

    async buscarDatosSismicos(eventoId) {
        // Usar los datos ya cargados del evento seleccionado
        if (this.eventoSeleccionado) {
            return {
                alcance: this.eventoSeleccionado.alcance || 'Regional',
                clasificacion: this.eventoSeleccionado.clasificacion || 'Superficial', 
                origen: this.eventoSeleccionado.origen || 'Tectónico'
            };
        }
        
        // Fallback: consultar base de datos
        const [rows] = await this.db.execute(`
            SELECT a.nombre as alcance, c.nombre as clasificacion, o.nombre as origen
            FROM eventos_sismicos e
            LEFT JOIN alcance_sismo a ON e.alcance_id = a.id
            LEFT JOIN clasificacion_sismo c ON e.clasificacion_id = c.id
            LEFT JOIN origen_generacion o ON e.origen_id = o.id
            WHERE e.id = ?
        `, [eventoId]);
        
        return {
            alcance: rows[0]?.alcance || 'Regional',
            clasificacion: rows[0]?.clasificacion || 'Superficial',
            origen: rows[0]?.origen || 'Tectónico'
        };
    }

    async buscarSeriesTemporales(eventoId) {
        const [rows] = await this.db.execute(`
            SELECT st.*, s.identificadorSismografo, es.nombre as estacion
            FROM serie_temporal st
            JOIN sismografo s ON st.sismografo_id = s.id
            JOIN estacion_sismologica es ON s.estacion_id = es.id
            WHERE st.evento_id = ?
        `, [eventoId]);
        
        return this.ordenarSeriesTemporales(rows);
    }

    ordenarSeriesTemporales(series) {
        return series.sort((a, b) => a.estacion.localeCompare(b.estacion));
    }

    async rechazarEventoSismico(eventoId) {
        this.tomarFechaHoraActual();
        if (this.eventoSismico) {
            // Finalizar cambio de estado actual
            await this.db.execute(
                'UPDATE cambio_estado SET fechaHoraFin = ? WHERE evento_id = ? AND fechaHoraFin IS NULL', 
                [this.fechaHoraActual, eventoId]
            );
            
            // Ejecutar transición de estado en el objeto
            this.eventoSismico.rechazar();
            
            // Obtener ID del estado Rechazado
            const [estadoRows] = await this.db.execute(
                'SELECT id FROM estados WHERE nombreEstado = "Rechazado"'
            );
            const estadoRechazadoId = estadoRows[0].id;
            
            // Actualizar estado del evento
            await this.db.execute(
                'UPDATE eventos_sismicos SET estado_id = ? WHERE id = ?', 
                [estadoRechazadoId, eventoId]
            );
            
            // Crear nuevo cambio de estado
            await this.db.execute(
                'INSERT INTO cambio_estado (fechaHoraInicio, fechaHoraFin, evento_id, estado_id) VALUES (?, NULL, ?, ?)',
                [this.fechaHoraActual, eventoId, estadoRechazadoId]
            );
        }
    }

    finCU() {
        if (this.db) {
            this.db.end();
        }
    }
}

module.exports = GestorRegResEventoSismico;