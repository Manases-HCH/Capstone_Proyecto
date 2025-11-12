from fastapi import FastAPI, HTTPException, APIRouter, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.db import get_connection
from utils.ai import generar_plan_ia
import hashlib

app = FastAPI(title="SWIAAPE Backend API")

# Routers
auth_router = APIRouter(prefix="/auth", tags=["Auth"])
docente_router = APIRouter(prefix="/docente", tags=["Docente"])
planes_router = APIRouter(prefix="/planes", tags=["Planes de Estudio"])

# ===========================
# 🔹 CORS
# ===========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# 🔹 MODELOS
# ===========================
class LoginRequest(BaseModel):
    correo: str
    password: str

class NotaUpdate(BaseModel):
    idEstudiante: int
    idCurso: int
    nota1: float | None
    nota2: float | None
    nota3: float | None


# ===========================
# 🔹 ENDPOINT RAÍZ
# ===========================
@app.get("/")
def root():
    return {"message": "SWIAAPE API funcionando 🚀"}


# ===========================
# 🔹 LOGIN
# ===========================
@auth_router.post("/login")
def login(request: LoginRequest):
    """
    Autenticación del usuario (docente o admin)
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Si usas hash en la BD, descomenta esta línea:
        # password_hash = hashlib.sha256(request.password.encode()).hexdigest()
        cursor.execute("""
            SELECT idUsuario, nombres, apellidos, correo, rol
            FROM Usuario
            WHERE correo = ? AND passwordHash = ?
        """, (request.correo, request.password))

        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        return {
            "idUsuario": user[0],
            "nombre": f"{user[1]} {user[2]}",
            "correo": user[3],
            "rol": user[4]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en login: {e}")
    finally:
        cursor.close()
        conn.close()


# ===========================
# 🔹 CURSOS DEL DOCENTE
# ===========================
@docente_router.get("/cursos/{id_usuario}")
def get_cursos_docente(id_usuario: int):
    """
    Devuelve los cursos asignados al docente con sus estudiantes y promedios.
    Compatible con la estructura real de la BD SWIAAPE.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                C.idCurso,
                C.nombre,
                C.area,
                C.horasSemanales,
                C.grado,
                C.seccion
            FROM Curso C
            JOIN Docente D ON C.idDocente = D.idDocente
            JOIN Usuario U ON D.idUsuario = U.idUsuario
            WHERE U.idUsuario = ?
        """, (id_usuario,))
        cursos = cursor.fetchall()

        resultado = []

        for curso in cursos:
            id_curso, nombre, area, horas, grado, seccion = curso

            cursor.execute("""
                SELECT 
                    E.idEstudiante,
                    U.nombres + ' ' + U.apellidos AS nombre,
                    E.dni,
                    ISNULL(AVG(
                        CASE 
                            WHEN EV.calificacion = 'A' THEN 20
                            WHEN EV.calificacion = 'B' THEN 14a
                            WHEN EV.calificacion = 'C' THEN 10
                            ELSE NULL
                        END
                    ), 0) AS promedio
                FROM Estudiante E
                JOIN Usuario U ON E.idUsuario = U.idUsuario
                LEFT JOIN Evaluacion EV ON E.idEstudiante = EV.idEstudiante
                WHERE E.grado = ? AND E.seccion = ?
                GROUP BY E.idEstudiante, U.nombres, U.apellidos, E.dni
            """, (grado, seccion))
            estudiantes = cursor.fetchall()

            lista_estudiantes = [
                {
                    "id": e[0],
                    "name": e[1],
                    "dni": e[2],
                    "average": float(e[3])
                }
                for e in estudiantes
            ]

            resultado.append({
                "id": id_curso,
                "name": nombre,
                "area": area,
                "hours": horas,
                "grade": grado,
                "section": seccion,
                "status": "Abierto",
                "students": lista_estudiantes
            })

        return resultado

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener cursos: {e}")
    finally:
        cursor.close()
        conn.close()


# ===========================
# 🔹 ACTUALIZAR NOTAS
# ===========================
@docente_router.post("/actualizar-notas")
def actualizar_notas(data: list[NotaUpdate]):
    """
    Actualiza las notas de los estudiantes en la tabla Evaluacion.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        for registro in data:
            # Borrar evaluaciones previas para ese curso-estudiante
            cursor.execute("""
                DELETE FROM Evaluacion WHERE idEstudiante = ? AND idCurso = ?
            """, (registro.idEstudiante, registro.idCurso))

            # Insertar nuevas notas (solo si existen)
            notas = [registro.nota1, registro.nota2, registro.nota3]
            for i, nota in enumerate(notas, start=1):
                if nota is not None:
                    cursor.execute("""
                        INSERT INTO Evaluacion (idEstudiante, idCurso, calificacion, periodo, fecha)
                        VALUES (?, ?, ?, ?, GETDATE())
                    """, (registro.idEstudiante, registro.idCurso, nota, f"Periodo {i}"))

        conn.commit()
        return {"message": "Notas actualizadas correctamente"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar notas: {e}")
    finally:
        cursor.close()
        conn.close()


# ===========================
# 🔹 CONSULTAR ESTUDIANTE POR DNI
# ===========================
@app.get("/estudiantes/by-dni/{dni}")
def obtener_estudiante_por_dni(dni: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                e.idEstudiante,
                u.nombres,
                u.apellidos,
                u.correo,
                u.rol,
                e.DNI,
                e.grado,
                e.seccion,
                e.rendimiento
            FROM Estudiante e
            JOIN Usuario u ON e.idUsuario = u.idUsuario
            WHERE e.DNI = ?
        """, (dni,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

        estudiante = {
            "idEstudiante": row[0],
            "name": f"{row[1]} {row[2]}",
            "email": row[3],
            "role": row[4],
            "dni": row[5],
            "grade": row[6],
            "section": row[7],
            "performance": float(row[8]) if row[8] else None,
            "evaluations": []
        }

        # Traer evaluaciones
        cursor.execute("""
            SELECT 
                c.nombre AS curso,
                comp.nombre AS competencia,
                ev.calificacion,
                ev.periodo,
                ev.fecha
            FROM Evaluacion ev
            JOIN Curso c ON ev.idCurso = c.idCurso
            JOIN Competencia comp ON ev.idCompetencia = comp.idCompetencia
            WHERE ev.idEstudiante = ?
        """, (row[0],))
        rows = cursor.fetchall()

        for ev in rows:
            estudiante["evaluations"].append({
                "courseName": ev[0],
                "competencyName": ev[1],
                "grade": ev[2],
                "period": ev[3],
                "date": ev[4].strftime("%Y-%m-%d") if ev[4] else None
            })

        return estudiante

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en consulta: {e}")
    finally:
        cursor.close()
        conn.close()


# ===========================
# 🔹 PLANES IA
# ===========================
@planes_router.get("/docente/{id_usuario}")
def obtener_planes_ia_docente(id_usuario: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                p.idPlanIA,
                p.nombre,
                p.curso,
                p.grado,
                p.version,
                p.fechaGeneracion,
                p.precisionIA,
                p.estado
            FROM PlanIA p
            JOIN Docente d ON p.idDocente = d.idDocente
            WHERE d.idUsuario = ?
        """, (id_usuario,))
        rows = cursor.fetchall()

        planes = []
        for r in rows:
            planes.append({
                "id": r[0],
                "name": r[1],
                "course": r[2],
                "grade": r[3],
                "version": r[4],
                "generationDate": r[5].strftime("%Y-%m-%d") if r[5] else None,
                "accuracy": r[6],
                "status": r[7]
            })
        return planes

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener planes IA: {e}")
    finally:
        cursor.close()
        conn.close()


# ===========================
# 🔹 TEST BD
# ===========================
@app.get("/test-db")
def test_db():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        conn.close()
        return {"db": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error conexión BD: {e}")


# ===========================
# 🔹 REGISTRO DE ROUTERS
# ===========================
app.include_router(auth_router)
app.include_router(docente_router)
app.include_router(planes_router)
