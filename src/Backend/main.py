from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.db import get_connection
from utils.ai import generar_plan_ia
from fastapi import APIRouter
from pydantic import BaseModel
import hashlib
from fastapi import FastAPI, HTTPException, Form

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
docente_router = APIRouter(prefix="/docente", tags=["Docente"])

@docente_router.get("/cursos/{id_usuario}")
def get_cursos_docente(id_usuario: int):
    """
    Devuelve los cursos asignados al docente según su usuario.
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
                G.grado,
                G.seccion
            FROM Curso C
            JOIN Docente D ON C.idDocente = D.idDocente
            JOIN Usuario U ON D.idUsuario = U.idUsuario
            JOIN GradoSeccion G ON C.idGradoSeccion = G.idGradoSeccion
            WHERE U.idUsuario = ?
        """, (id_usuario,))
        rows = cursor.fetchall()

        cursos = []
        for row in rows:
            cursos.append({
                "id": row[0],
                "name": row[1],
                "area": row[2],
                "hours": row[3],
                "grade": row[4],
                "section": row[5]
            })
        return cursos

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener cursos: {e}")
    finally:
        cursor.close()
        conn.close()


@docente_router.get("/curso/{id_curso}/estudiantes")
def get_estudiantes_curso(id_curso: int):
    """
    Devuelve la lista de estudiantes matriculados en un curso.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                E.idEstudiante,
                U.nombres + ' ' + U.apellidos AS nombre,
                E.DNI,
                ISNULL(AVG(
                    CASE 
                        WHEN EV.calificacion IN ('A','AD') THEN 20
                        WHEN EV.calificacion = 'B' THEN 14
                        WHEN EV.calificacion = 'C' THEN 10
                        ELSE NULL
                    END
                ), 0) AS promedio
            FROM Matricula M
            JOIN Estudiante E ON M.idEstudiante = E.idEstudiante
            JOIN Usuario U ON E.idUsuario = U.idUsuario
            LEFT JOIN Evaluacion EV ON E.idEstudiante = EV.idEstudiante AND M.idCurso = EV.idCurso
            WHERE M.idCurso = ?
            GROUP BY E.idEstudiante, U.nombres, U.apellidos, E.DNI
        """, (id_curso,))
        rows = cursor.fetchall()

        estudiantes = []
        for row in rows:
            estudiantes.append({
                "id": row[0],
                "name": row[1],
                "dni": row[2],
                "average": float(row[3])
            })
        return estudiantes

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estudiantes: {e}")
    finally:
        cursor.close()
        conn.close()


# ==========================================================
# 🤖 RUTAS PLANES DE ESTUDIO (AIStudyPlans)
# ==========================================================
planes_router = APIRouter(prefix="/planes", tags=["Planes de Estudio"])

@app.get("/docente/{id_usuario}/cursos")
def obtener_cursos_docente(id_usuario: int):
    """
    Devuelve los cursos asignados a un docente con sus estudiantes.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                c.idCurso, 
                c.nombre AS nombreCurso, 
                c.grado, 
                c.seccion, 
                c.estado
            FROM Curso c
            JOIN Docente d ON c.idDocente = d.idDocente
            WHERE d.idUsuario = ?
        """, (id_usuario,))
        cursos = cursor.fetchall()

        result = []
        for c in cursos:
            curso_data = {
                "id": c[0],
                "name": c[1],
                "grade": c[2],
                "section": c[3],
                "status": c[4],
                "students": []
            }

            # Traer estudiantes por curso
            cursor.execute("""
                SELECT e.idEstudiante, u.nombres, u.apellidos, e.DNI
                FROM Estudiante e
                JOIN Usuario u ON e.idUsuario = u.idUsuario
                WHERE e.idCurso = ?
            """, (c[0],))
            estudiantes = cursor.fetchall()

            for e in estudiantes:
                curso_data["students"].append({
                    "id": e[0],
                    "name": f"{e[1]} {e[2]}",
                    "dni": e[3]
                })
            
            result.append(curso_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener cursos: {e}")
    finally:
        cursor.close()
        conn.close()


@app.get("/docente/{id_usuario}/planes-ia")
def obtener_planes_ia_docente(id_usuario: int):
    """
    Devuelve los planes de estudio IA generados o asociados a un docente.
    """
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

        plans = []
        for r in rows:
            plans.append({
                "id": r[0],
                "name": r[1],
                "course": r[2],
                "grade": r[3],
                "version": r[4],
                "generationDate": r[5].strftime("%Y-%m-%d") if r[5] else None,
                "accuracy": r[6],
                "status": r[7]
            })
        return plans
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener planes IA: {e}")
    finally:
        cursor.close()
        conn.close()
        
@planes_router.get("/")
def get_planes_estudio():
    """
    Devuelve todos los planes de estudio disponibles.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                P.idPlan,
                P.añoEscolar,
                P.descripcion,
                C.nombre AS curso
            FROM PlanEstudio P
            JOIN CursoPlan CP ON P.idPlan = CP.idPlan
            JOIN Curso C ON C.idCurso = CP.idCurso
            ORDER BY P.añoEscolar DESC
        """)
        rows = cursor.fetchall()

        planes = []
        for row in rows:
            planes.append({
                "id": row[0],
                "year": row[1],
                "description": row[2],
                "course": row[3]
            })
        return planes

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener planes: {e}")
    finally:
        cursor.close()
        conn.close()

@app.get("/test-db")
def test_db():
        """Endpoint para validar conexión a BD rápidamente."""
        conn = None
        try:
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1")
            _ = cur.fetchone()
            cur.close()
            return {"db": "ok"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"DB connection error: {e}")
        finally:
            if conn:
                conn.close()

@app.get("/chatbot/plan-ia/{id_estudiante}")
def get_plan_ia(id_estudiante: int):
        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor()

            # Traer nombre, apellido y rendimiento
            cursor.execute("""
            SELECT u.nombres, u.apellidos, e.rendimiento
            FROM Estudiante e
            JOIN Usuario u ON e.idUsuario = u.idUsuario
            WHERE e.idEstudiante = ?
            """, (id_estudiante,)) 
            estudiante_info = cursor.fetchone()
            if not estudiante_info:
                return {"mensaje": "Estudiante no encontrado."}

            nombre_completo = f"{estudiante_info[0]} {estudiante_info[1]}"
            calificacion = float(estudiante_info[2]) if estudiante_info[2] is not None else None

            # Traer debilidades según calificaciones B o C
            cursor.execute("""
            SELECT c.nombre, e.calificacion
            FROM Evaluacion e
            JOIN Competencia c ON e.idCompetencia = c.idCompetencia
            WHERE e.idEstudiante = ? AND e.calificacion IN ('B','C')
            """, (id_estudiante,))
            rows = cursor.fetchall()
            debilidades = [{"competencia": r[0], "nota": r[1]} for r in rows]

            # Generar plan de estudio
            nombres_debilidades = [d["competencia"] for d in debilidades]
            plan = generar_plan_ia(nombre_completo, nombres_debilidades)

            return {
                "nombre": nombre_completo,
                "calificacion": calificacion,
                "debilidades": debilidades,
                "plan_estudio": plan
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Server error: {e}")
        finally:
            if conn:
                try:
                    conn.close()
                except:
                    pass
@router.post("/login")
def login(request: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # 💡 Ya no calculamos hash
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

    except HTTPException:
        raise
    except Exception as e:
        print("🔥 ERROR en login:", e)
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
app.include_router(docente_router)
app.include_router(planes_router)
