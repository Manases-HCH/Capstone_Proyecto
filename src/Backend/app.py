import docx
import pandas as pd
import numpy as np
from io import BytesIO
from flask import Flask, render_template, request, send_file, redirect, url_for, flash
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app = Flask(__name__)
app.secret_key = "clave_segura"

nota_a_puntos = {"A": 20, "B": 15, "C": 10}

def dar_consejo(promedio):
    if promedio >= 17:
        return "¡Excelente trabajo! Sigue esforzándote y mantén tu ritmo. 🚀"
    elif promedio >= 14:
        return "Vas bien, pero puedes mejorar con un poco más de práctica y constancia. 📘"
    elif promedio >= 12:
        return "Estás en el límite, revisa tus apuntes y organiza un horario de estudio. ⏳"
    else:
        return "Debes enfocarte más: pide apoyo a tu profesor, estudia en grupo y practica más. 💡"

def procesar_docx(file_stream):
    doc = docx.Document(file_stream)
    tabla = doc.tables[0]

    datos = []
    start_row = 2
    for fila in tabla.rows[start_row:]:
        celdas = fila.cells
        if len(celdas) < 2:
            continue
        nombre = celdas[1].text.strip()
        if not nombre:
            continue
        notas_texto = [celdas[i].text.strip().upper() for i in range(2, len(celdas)) if celdas[i].text.strip()]
        notas_num = [nota_a_puntos.get(n, 0) for n in notas_texto if n]
        if notas_num:
            promedio = sum(notas_num) / len(notas_num)
        else:
            promedio = 0
        datos.append({
            "Alumno": nombre,
            "Notas": ", ".join(notas_texto),
            "Promedio": round(promedio, 2),
            "Consejo": dar_consejo(promedio)
        })

    df = pd.DataFrame(datos, columns=["Alumno", "Notas", "Promedio", "Consejo"])
    return df

def entrenar_modelo(df):
    # Aqui puse mi king etiquetas: 1 = riesgo, 0 = no riesgo
    df["Riesgo"] = (df["Promedio"] <= 12).astype(int)

    X = df[["Promedio"]].values
    y = df["Riesgo"].values

    
    reps = 5  # este numero replicara los datos
    X_extra = np.repeat(X, reps, axis=0) + np.random.normal(0, 2, size=(len(X)*reps, 1))
    y_extra = np.repeat(y, reps, axis=0)

    # Los reales (osea datos) + algunos simulados xd
    X_final = np.vstack([X, X_extra])
    y_final = np.concatenate([y, y_extra])

    # Entreno el modelo
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score

    X_train, X_test, y_train, y_test = train_test_split(X_final, y_final, test_size=0.2, random_state=42)
    model = DecisionTreeClassifier(max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))

    return model, acc

@app.route("/", methods=["GET", "POST"])
def index():
    resultado = None
    if request.method == "POST":
        file = request.files.get("file")
        if not file or not file.filename.endswith(".docx"):
            flash("Sube un archivo .docx válido")
            return redirect(request.url)

        df = procesar_docx(file)

        # Entreno la IA, aunque bien basica pipipi
        modelo, acc = entrenar_modelo(df)

        # Predicciones simuladas para cada alumno
        df["Predicción Riesgo"] = modelo.predict(df[["Promedio"]].values)
        df["Predicción Texto"] = df["Predicción Riesgo"].apply(lambda x: "En riesgo" if x==1 else "No en riesgo")

        # Excel
        output = BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Reporte")
        output.seek(0)

        resultado = {
            "tabla_html": df.to_html(classes="table table-striped table-hover", index=False),
            "excel_data": output,
            "accuracy": round(acc*100, 2)
        }
        # descarga
        global excel_buffer
        excel_buffer = output

    return render_template("index.html", resultado=resultado)

@app.route("/descargar")
def descargar():
    global excel_buffer
    if excel_buffer:
        return send_file(excel_buffer, download_name="Reporte_Notas.xlsx", as_attachment=True)
    flash("Primero sube un archivo y genera el reporte.")
    return redirect(url_for("index"))

if __name__ == "__main__":
    excel_buffer = None
    app.run(debug=True)