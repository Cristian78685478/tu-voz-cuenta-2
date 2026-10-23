-- Ejecuta una vez en Neon SQL Editor.
CREATE TABLE IF NOT EXISTS casos (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 titulo VARCHAR(100) NOT NULL,
 categoria VARCHAR(50) NOT NULL,
 ubicacion VARCHAR(60) DEFAULT '',
 historia VARCHAR(1500) NOT NULL,
 anonimo BOOLEAN NOT NULL DEFAULT TRUE,
 estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','publicado','rechazado')),
 creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 revisado_en TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS casos_estado_creado_idx ON casos(estado,creado_en DESC);