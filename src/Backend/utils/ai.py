# utils/ai.py
from utils.chatbot import generar_respuesta

# Función auxiliar para limpiar y validar la respuesta del modelo
def limpiar_y_validar(texto, sugerencias):
    texto = " ".join(texto.split())
    # Validar que tenga al menos 3 puntos
    if texto.count("📌") < 3:
        # Combinar respuesta generada con sugerencias
        texto = "\n".join(list(texto.split("📌")[1:]) + sugerencias)
    return texto.strip()


def generar_plan_ia(nombres: str, debilidades: list) -> str:
    if not debilidades:
        return f"✅ El estudiante {nombres} no presenta debilidades. Continúe con el plan actual. 🚀"

    prompt = (
        f"Plan de estudio para { nombres}.\n"
        f"Debilidades detectadas: {', '.join(debilidades)}.\n"
        "Por favor, genera un plan breve, en español, con puntos claros que incluyan:\n"
        "1. Estrategias de mejora.\n"
        "2. Ejercicios o prácticas sugeridas.\n"
        "3. Frecuencia de estudio.\n"
        "4. Recomendaciones adicionales.\n"
        "Usa un tono motivador y práctico."
    )
    
    texto = generar_respuesta(prompt)
    sugerencias = [
        "📌 Reforzar la práctica diaria en las competencias más débiles.",
        "📌 Dedicar 20-30 minutos extra a resolver ejercicios prácticos.",
        "📌 Formar grupos de estudio para mejorar la cooperación.",
        "📌 Solicitar tutorías semanales con el docente.",
        "📌 Usar recursos digitales interactivos para afianzar conocimientos."
    ]

    # Limpiar y validar la respuesta del modelo
    texto = limpiar_y_validar(texto, sugerencias)


    

    return texto
