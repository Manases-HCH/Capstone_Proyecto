# utils/chatbot.py
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Modelo en español
# utils/chatbot.py
MODEL_NAME = "mrm8488/spanish-gpt2"  # mucho más coherente en español

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def generar_respuesta(prompt: str) -> str:
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=300,       # más espacio para un plan completo
        do_sample=True,
        temperature=0.6,          # más baja → menos inventiva, más coherente
        top_k=40,                  # limita la selección de palabras
        top_p=0.95,                # nuclear sampling para diversidad controlada
        no_repeat_ngram_size=4,    # evita repeticiones más largas
        pad_token_id=tokenizer.eos_token_id
    )


    text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Limpieza: quitar el prompt inicial
    if text.startswith(prompt):
        text = text[len(prompt):]

    text = " ".join(text.split())
    return text.strip()
