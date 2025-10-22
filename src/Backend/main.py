    # main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.db import get_connection
from utils.ai import generar_plan_ia
from fastapi import FastAPI, HTTPException, Form


app = FastAPI(title="SWIAPPE Chatbot API")

    # Permitir CORS (para pruebas locales)
app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],   # en producción restringir a orígenes confiables
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/")
def root():
        return {"message": "SWIAPPE Chatbot API running"}

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

@app.post("/login")
def login(correo: str = Form(...), contraseña: str = Form(...)):
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        SELECT idUsuario, nombres, apellidos, rol
        FROM Usuario
        WHERE correo = ? AND contraseña = ?
        """
        cursor.execute(query, (correo, contraseña))
        row = cursor.fetchone()

        cursor.close()
        if not row:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        return {
            "idUsuario": row[0],
            "nombre": f"{row[1]} {row[2]}",
            "rol": row[3]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")
    finally:
        if conn:
            try:
                conn.close()
            except:
                pass

@app.get("/docente/estudiantes")
def listar_estudiantes():
    """Lista todos los estudiantes con su sección y notas"""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.idEstudiante, u.nombres, u.apellidos, e.seccion, e.rendimiento
            FROM Estudiante e
            JOIN Usuario u ON e.idUsuario = u.idUsuario
        """)
        rows = cursor.fetchall()
        cursor.close()
        return [
            {
                "id": r[0],
                "nombre": f"{r[1]} {r[2]}",
                "seccion": r[3],
                "nota": r[4]
            }
            for r in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar estudiantes: {e}")
    finally:
        if conn:
            conn.close()


@app.post("/docente/actualizar-nota/{id_estudiante}")
def actualizar_nota(id_estudiante: int, nota: float = Form(...)):
    """Actualizar la nota/rendimiento de un estudiante"""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Estudiante
            SET rendimiento = ?
            WHERE idEstudiante = ?
        """, (nota, id_estudiante))
        conn.commit()
        cursor.close()
        return {"mensaje": "Nota actualizada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo actualizar la nota: {e}")
    finally:
        if conn:
            conn.close()

@app.get("/docente/competencias/{id_estudiante}")
def competencias_estudiante(id_estudiante: int):
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.nombre, e.calificacion
            FROM Evaluacion e
            JOIN Competencia c ON e.idCompetencia = c.idCompetencia
            WHERE e.idEstudiante = ?
        """, (id_estudiante,))
        rows = cursor.fetchall()
        cursor.close()

        return [{"competencia": r[0], "calificacion": r[1]} for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener competencias: {e}")
    finally:
        if conn:
            conn.close()