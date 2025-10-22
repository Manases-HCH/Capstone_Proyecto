// Necesitarás importar 'createPortal'
import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";

interface AIChatModalProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // ¡YA NO NECESITAMOS modalRef!

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      chatArea.scrollTop += e.deltaY;
    };
    chatArea.addEventListener('wheel', handleWheel, { passive: false });
    return () => chatArea.removeEventListener('wheel', handleWheel);
  }, []);

  // --- EFECTO SIMPLIFICADO ---
  // Este efecto ahora solo controla el 'overflow' del body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Limpieza
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Agregar estilos (esto está bien como está)
  useEffect(() => {
    if (typeof document !== "undefined" && !document.getElementById("ai-modal-styles")) {
      const style = document.createElement("style");
      style.id = "ai-modal-styles";
      style.innerHTML = `
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slideIn { animation: slideIn 0.25s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #800020, #a00030); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #600018, #800028); }
        .ai-modal-root {
          position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
          width: 100vw !important; height: 100vh !important; z-index: 999999999 !important; pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const sendMessage = async () => {
    // ... (Tu lógica de 'sendMessage' es perfecta, no necesita cambios)
    if (!input.trim()) return;
    const msg = input.trim();
    addMessage(msg, "user");
    setInput("");
    setIsLoading(true);
    try {
      let res, data;
      if (msg.toLowerCase().startsWith("plan")) {
        const id = msg.split(" ")[1];
        if (!id) {
          addMessage("⚠️ Escribe un ID de estudiante. Ejemplo: plan 3", "bot");
          setIsLoading(false);
          return;
        }
        res = await fetch(`http://127.0.0.1:8000/chatbot/plan-ia/${id}`);
        data = await res.json();
        if (data.plan_estudio) {
          const nombre = data.nombre || `Estudiante ${id}`;
          const calificacion = data.calificacion ?? "Sin calificación";
          const debilidades =
            data.debilidades?.length > 0
              ? data.debilidades
                  .map((d: any) => `📌 ${d.competencia} (nota: ${d.nota})`)
                  .join("\n")
              : "✅ No tiene debilidades registradas.";
          addMessage(
            `📘 Plan de estudio para ${nombre}\n🧾 Calificación: ${calificacion}\n⚠️ Debilidades:\n${debilidades}\n\n${data.plan_estudio}`,
            "bot"
          );
        } else {
          addMessage(data.mensaje || "❌ Estudiante no encontrado.", "bot");
        }
      } else {
        res = await fetch(`http://127.0.0.1:8000/chatbot/?msg=${encodeURIComponent(msg)}`);
        data = await res.json();
        addMessage(data.respuesta || "🤖 No entendí el mensaje.", "bot");
      }
    } catch (error) {
      addMessage("⚠️ Error al conectar con la API", "bot");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- AQUÍ EMPIEZA LA MAGIA ---

  // 1. Si no está abierto, no renderices nada (ni el portal)
  if (!open) return null;

  // 2. Si está abierto, crea un portal y renderiza todo el modal DENTRO de document.body
  return ReactDOM.createPortal(
    <div
      // Ya no necesitas 'ref={modalRef}'
      className="ai-modal-root"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative', width: '90vw', maxWidth: '480px',
          height: '85vh', maxHeight: '700px', zIndex: 999999999,
        }}
        className="bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-100 animate-scaleIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#800020] to-[#a00030] shadow-lg">
          {/* ... (Tu JSX de Header, sin cambios) ... */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Asistente IA</h2>
              <p className="text-xs text-white/80">Generador de planes de estudio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* CHAT AREA */}
        <div
          ref={chatAreaRef}
          className="flex-1 bg-gradient-to-b from-gray-50 to-white p-4 space-y-3 overflow-y-auto custom-scrollbar"
        >
          {/* ... (Tu JSX de Mensajes, sin cambios) ... */}
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <div className="inline-block p-3 bg-gradient-to-br from-[#800020] to-[#a00030] rounded-2xl mb-3 shadow-lg">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                ¡Bienvenido!
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 max-w-xs mx-auto px-4">
                Escribe <span className="font-bold text-[#800020] bg-red-50 px-2 py-0.5 rounded">plan [ID]</span> para generar un plan personalizado.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Ejemplo: <code className="text-[#800020] font-semibold bg-red-50 px-2 py-0.5 rounded">plan 3</code>
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              } animate-slideIn`}
            >
              {m.sender === "bot" && (
                <div className="p-1.5 bg-gradient-to-br from-[#800020] to-[#a00030] rounded-lg shadow-sm flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-xl max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <div className="p-1.5 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-sm flex-shrink-0">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2 animate-slideIn">
              <div className="p-1.5 bg-gradient-to-br from-[#800020] to-[#a00030] rounded-lg shadow-sm flex-shrink-0">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="px-3 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-2 p-4 border-t bg-white shadow-inner">
          {/* ... (Tu JSX de Input, sin cambios) ... */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none bg-gray-50 transition-all duration-200 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center bg-gradient-to-r from-[#800020] to-[#a00030] hover:from-[#600018] hover:to-[#800028] text-white p-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    // El segundo argumento de createPortal es el nodo del DOM destino
    document.body 
  );
};  