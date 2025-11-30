CREATE DATABASE IF NOT EXISTS sistema_sismico;
USE sistema_sismico;

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombreUsuario VARCHAR(50),
    contrasena VARCHAR(100)
);

CREATE TABLE estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombreEstado VARCHAR(50),
    ambito VARCHAR(100)
);

CREATE TABLE alcance_sismo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT
);

CREATE TABLE clasificacion_sismo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    kmProfundidadDesde DECIMAL(10,2),
    kmProfundidadHasta DECIMAL(10,2)
);

CREATE TABLE origen_generacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT
);

CREATE TABLE estacion_sismologica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE sismografo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificadorSismografo VARCHAR(50),
    nroSerie VARCHAR(50),
    estacion_id INT,
    FOREIGN KEY (estacion_id) REFERENCES estacion_sismologica(id)
);

CREATE TABLE eventos_sismicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fechaHoraOcurrencia DATETIME,
    latitudEpicentro DECIMAL(10,6),
    longitudEpicentro DECIMAL(10,6),
    latitudHipocentro DECIMAL(10,6),
    longitudHipocentro DECIMAL(10,6),
    valorMagnitud DECIMAL(4,2),
    estado_id INT,
    clasificacion_id INT,
    origen_id INT,
    alcance_id INT,
    analista_id INT,
    FOREIGN KEY (estado_id) REFERENCES estados(id),
    FOREIGN KEY (clasificacion_id) REFERENCES clasificacion_sismo(id),
    FOREIGN KEY (origen_id) REFERENCES origen_generacion(id),
    FOREIGN KEY (alcance_id) REFERENCES alcance_sismo(id),
    FOREIGN KEY (analista_id) REFERENCES usuarios(id)
);

CREATE TABLE cambio_estado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fechaHoraInicio DATETIME,
    fechaHoraFin DATETIME,
    evento_id INT,
    estado_id INT,
    FOREIGN KEY (evento_id) REFERENCES eventos_sismicos(id),
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

CREATE TABLE tipo_dato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    valorUmbral DECIMAL(10,4)
);

CREATE TABLE serie_temporal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    frecuenciaMuestreo DECIMAL(10,2),
    fechaHoraRegistroMuestras DATETIME,
    fechaHoraRegistro DATETIME,
    evento_id INT,
    sismografo_id INT,
    FOREIGN KEY (evento_id) REFERENCES eventos_sismicos(id),
    FOREIGN KEY (sismografo_id) REFERENCES sismografo(id)
);

CREATE TABLE muestra_sismica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fechaHoraMuestra DATETIME,
    serie_id INT,
    tipo_dato_id INT,
    FOREIGN KEY (serie_id) REFERENCES serie_temporal(id),
    FOREIGN KEY (tipo_dato_id) REFERENCES tipo_dato(id)
);

CREATE TABLE detalle_muestra_sismica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    valor DECIMAL(15,6),
    muestra_id INT,
    FOREIGN KEY (muestra_id) REFERENCES muestra_sismica(id)
);

-- Datos iniciales
INSERT INTO estados (nombreEstado, ambito) VALUES 
('Autodetectado', 'Sistema'),
('PendienteRevision', 'Revision'),
('BloqueadoEnRevision', 'Revision'),
('Rechazado', 'Revision'),
('SinRevision', 'Sistema'),
('DerivadoAExperto', 'Experto'),
('Confirmado', 'Final');

INSERT INTO usuarios (nombreUsuario, contrasena) VALUES ('analista1', 'pass123');

INSERT INTO alcance_sismo (nombre, descripcion) VALUES 
('Regional', 'Alcance regional'),
('Local', 'Alcance local'),
('Nacional', 'Alcance nacional');

INSERT INTO clasificacion_sismo (nombre, kmProfundidadDesde, kmProfundidadHasta) VALUES 
('Superficial', 0, 70),
('Intermedio', 70, 300),
('Profundo', 300, 700);

INSERT INTO origen_generacion (nombre, descripcion) VALUES 
('Tectónico', 'Origen tectónico'),
('Volcánico', 'Origen volcánico'),
('Artificial', 'Origen artificial');

INSERT INTO estacion_sismologica (nombre) VALUES 
('Estación Central'),
('Estación Norte'),
('Estación Sur');

INSERT INTO sismografo (identificadorSismografo, nroSerie, estacion_id) VALUES 
('SIS001', 'S12345', 1),
('SIS002', 'S12346', 2),
('SIS003', 'S12347', 3);

INSERT INTO tipo_dato (valorUmbral) VALUES (0.5), (1.0), (2.0);

-- Eventos sísmicos de ejemplo
INSERT INTO eventos_sismicos (fechaHoraOcurrencia, latitudEpicentro, longitudEpicentro, latitudHipocentro, longitudHipocentro, valorMagnitud, estado_id, clasificacion_id, origen_id, alcance_id, analista_id) VALUES 
('2024-01-15 10:30:00', -34.6037, -58.3816, -34.6037, -58.3816, 5.2, 1, 1, 1, 1, 1),
('2024-01-16 14:20:00', -32.8895, -68.8458, -32.8895, -68.8458, 4.8, 2, 1, 1, 2, 1),
('2024-01-17 08:45:00', -38.9516, -68.0591, -38.9516, -68.0591, 6.1, 1, 2, 1, 1, 1);

-- Cambios de estado
INSERT INTO cambio_estado (fechaHoraInicio, fechaHoraFin, evento_id, estado_id) VALUES 
('2024-01-15 10:30:00', NULL, 1, 1),
('2024-01-16 14:20:00', NULL, 2, 2),
('2024-01-17 08:45:00', NULL, 3, 1);

-- Series temporales
INSERT INTO serie_temporal (frecuenciaMuestreo, fechaHoraRegistroMuestras, fechaHoraRegistro, evento_id, sismografo_id) VALUES 
(100.0, '2024-01-15 10:30:00', '2024-01-15 10:29:00', 1, 1),
(100.0, '2024-01-16 14:20:00', '2024-01-16 14:19:00', 2, 2),
(100.0, '2024-01-17 08:45:00', '2024-01-17 08:44:00', 3, 3);

-- Muestras sísmicas
INSERT INTO muestra_sismica (fechaHoraMuestra, serie_id, tipo_dato_id) VALUES 
('2024-01-15 10:30:01', 1, 1),
('2024-01-15 10:30:02', 1, 1),
('2024-01-16 14:20:01', 2, 2),
('2024-01-17 08:45:01', 3, 3);

-- Detalles de muestras
INSERT INTO detalle_muestra_sismica (valor, muestra_id) VALUES 
(2.3, 1),
(2.8, 2),
(1.9, 3),
(3.2, 4);