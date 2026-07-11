# Plantilla de Base de Datos - Google Sheets

Este documento detalla la estructura y columnas exactas que deben crearse en el Google Sheet oficial bajo la cuenta **`Paunova.co@gmail.com`** durante la **Fase 4**.

El archivo de Google Sheets debe contener **6 pestañas (hojas)** con las siguientes columnas en la primera fila:

---

## 1. Pestaña: `Pacientes`
Registra la información de contacto y detalles personales de los pacientes.

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador único del paciente | `p1` |
| `name` | Texto | Nombre completo del paciente | `Sofía Rodríguez` |
| `phone` | Texto | Número de teléfono / WhatsApp | `+57 315 789 4512` |
| `email` | Texto | Correo electrónico | `sofia.rod@gmail.com` |
| `birthday` | Fecha (YYYY-MM-DD) | Fecha de nacimiento | `1994-08-14` |
| `notes` | Texto | Notas o consideraciones de registro | `Piel mixta con tendencia a rosácea leve.` |
| `createdAt` | Fecha y Hora ISO | Timestamp de registro | `2026-05-10T12:00:00.000Z` |

---

## 2. Pestaña: `Citas`
Registra la agenda de valoraciones y tratamientos programados.

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador único de la cita | `a1` |
| `patientId` | Texto | ID del paciente (relación con `Pacientes.id`) | `p1` |
| `patientName` | Texto | Nombre del paciente | `Sofía Rodríguez` |
| `date` | Fecha (YYYY-MM-DD) | Fecha de la cita | `2026-07-09` |
| `time` | Texto (HH:MM) | Hora de la cita | `16:30` |
| `treatment` | Texto | Tratamiento solicitado | `Toxina Botulínica` |
| `status` | Texto | Estado de la cita (`Programada`, `Completada`, `Cancelada`) | `Programada` |
| `notes` | Texto | Notas clínicas o motivos de consulta | `Retoque en tercio superior facial.` |

---

## 3. Pestaña: `Inventario`
Control central del stock de insumos clínicos de la clínica.

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador único del producto | `i2` |
| `name` | Texto | Nombre del insumo o producto | `Toxina Botulínica (Dysport 500U)` |
| `category` | Texto | Categoría del producto | `Inyectable` |
| `units` | Número | Unidades disponibles en stock real | `180` |
| `minUnits` | Número | Nivel mínimo antes de disparar alerta crítica | `50` |
| `unitName` | Texto | Nombre de la unidad de medida | `unidades` |

---

## 4. Pestaña: `Fichas_Medicas`
Registra los datos clínicos generales del paciente (ficha técnica estática).

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `patientId` | Texto | ID del paciente (relación con `Pacientes.id`) | `p1` |
| `allergies` | Texto | Alergias o contraindicaciones del paciente | `Ninguna conocida` |
| `skinType` | Texto | Tipo de piel o diagnósticos basales | `Mixta y Sensible` |
| `notes` | Texto | Antecedentes familiares o diagnósticos generales | `Paciente busca atenuar líneas de expresión finas.` |

---

## 5. Pestaña: `Tratamientos_Aplicados`
Historial de procedimientos médicos realizados a los pacientes (con descuento de insumos).

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Identificador del procedimiento | `t1` |
| `patientId` | Texto | ID del paciente (relación con `Pacientes.id`) | `p1` |
| `treatmentName` | Texto | Nombre del tratamiento aplicado | `Toxina Botulínica` |
| `productUsedId` | Texto | ID del producto de inventario descontado | `i2` |
| `productNameUsed` | Texto | Nombre del producto descontado | `Toxina Botulínica (Dysport 500U)` |
| `productQuantityUsed` | Número | Cantidad descontada del stock | `50` |
| `details` | Texto | Notas clínicas de la aplicación y dosis | `Aplicación de 50U en frente y zona glabelar.` |
| `date` | Fecha (YYYY-MM-DD) | Fecha del procedimiento | `2026-07-09` |

---

## 6. Pestaña: `Claves_Acceso`
Registro de credenciales de acceso para el equipo de la clínica (en texto plano inicial para fase de diseño).

| Columna | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `username` | Texto | Nombre de usuario o correo | `carolina` |
| `password` | Texto | Contraseña de acceso | `paunova2026` |
| `role` | Texto | Rol del usuario (`doctor`, `admin`) | `doctor` |
