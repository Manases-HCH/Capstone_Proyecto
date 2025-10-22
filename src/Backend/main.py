from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.db import get_connection
from fastapi import APIRouter
from pydantic import BaseModel
import hashlib

app = FastAPI(title="SWIAAPE Backend API")
router = APIRouter(prefix="/auth", tags=["auth"])

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SWIAAPE API funcionando"}

class LoginRequest(BaseModel):
    correo: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        password_hash = hashlib.sha256(request.password.encode()).hexdigest()

        cursor.execute("""
            SELECT idUsuario, nombres, apellidos, correo, rol
            FROM Usuario
            WHERE correo = ? AND passwordHash = ?
        """, (request.correo, password_hash))

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
            raise HTTPException(status_code=404, detail="DNI no encontrado")

        estudiante = {
            "idEstudiante": row[0],
            "name": f"{row[1]} {row[2]}",
            "dni": row[3],
            "grade": row[4],
            "section": row[5],
            "performance": row[6],
            "evaluations": []
        }

        cursor.execute("""
            SELECT 
                c.nombre AS curso,
                comp.nombre AS competencia,
                e.calificacion,
                e.periodo,
                e.fecha
            FROM Evaluacion e
            JOIN Curso c ON e.idCurso = c.idCurso
            JOIN Competencia comp ON e.idCompetencia = comp.idCompetencia
            WHERE e.idEstudiante = ?
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

# 🔹 Registrar router
app.include_router(router)
