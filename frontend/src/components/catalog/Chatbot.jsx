import {useState, useRef, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';


export default function Chatbot({onOpenChatbot, isOpen}) {

    // Estado para almacenar los mensajes del chat
    const [messages, setMessages] = useState([
        {id: 1, text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: "bot"}
    ]);
    // Estado para el valor del input de mensaje
    const [inputValue, setInputValue] = useState("");
    // Estados para detectar si es móvil y si está en orientación horizontal
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    // Estado para controlar el renderizado del chatbot (para animaciones)
    const [isRendered, setIsRendered] = useState(false);
    // Referencia para hacer scroll automático al final del chat
    const chatEndRef = useRef(null);

    // URL de la API del chatbot (diferente para producción y desarrollo)
    // eslint-disable-next-line no-undef
    const API_URL = process.env.NODE_ENV === 'production' ? 'https://cyber-gadgets.onrender.com' : 'http://localhost:5000';

    // Obtiene o crea un ID de sesión único para el chat
    const [sessionId] = useState(() => {
        const existingSessionId = localStorage.getItem('chatSessionId');
        if (existingSessionId) {
            return existingSessionId;
        }
        const newSessionId = uuidv4();
        localStorage.setItem('chatSessionId', newSessionId);
        return newSessionId;
    });

    // Función para enviar el mensaje del usuario y obtener la respuesta del bot
    async function fetchResponse() {
        try {
            // Envía la solicitud al backend del chatbot
            const response = await fetch(`${API_URL}/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: inputValue,
                    sessionId: sessionId,
                    messagesLength: messages.length // Envía la longitud de los mensajes para contexto
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Agrega la respuesta del bot a los mensajes
            setMessages((prevMessages) => [
                ...prevMessages,
                {id: uuidv4(), text: data.response, sender: "bot"},
            ]);
        } catch (error) {
            console.error("Error al obtener la respuesta del chatbot:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {id: uuidv4(), text: "Lo siento, tengo problemas para responder en este momento.", sender: "bot"},
            ]);
        }
    }

    // Maneja el envío del formulario del chat
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;

        // Agrega el mensaje del usuario a los mensajes
        setMessages((prevMessages) => [
            ...prevMessages,
            {id: uuidv4(), text: inputValue, sender: "user"},
        ]);
        setInputValue(""); // Limpia el input

        await fetchResponse(); // Obtiene la respuesta del bot
    };

    // Efecto para controlar la visibilidad del chatbot con un retraso
    useEffect(() => {
        if (isOpen) {
            // Renderiza el contenido después de un pequeño retraso
            const timer = setTimeout(() => setIsRendered(true), 300);
            return () => clearTimeout(timer);
        } else {
            setIsRendered(false); // Oculta el contenido inmediatamente
        }
    }, [isOpen]);

    // Efecto para hacer scroll al final del chat cada vez que los mensajes cambian
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    // Efecto para detectar cambios en el tamaño de la ventana y la orientación del dispositivo móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Asume que 768px es el breakpoint para móvil
            setIsMobileLandscape(window.innerWidth < 768 && window.innerHeight < window.innerWidth);
        };

        checkMobile(); // Comprueba al montar
        window.addEventListener('resize', checkMobile); // Escucha cambios de tamaño
        return () => window.removeEventListener('resize', checkMobile); // Limpia el listener
    }, []);


    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${
                isMobileLandscape ? 'w-full h-full inset-0 rounded-none' : 'w-80 h-96 rounded-lg'
            } ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{
                transformOrigin: 'bottom right', // Anima desde la esquina inferior derecha
                transitionDelay: isOpen ? '0ms' : '200ms', // Retraso al cerrar para que la animación se complete
            }}
        >
            {/* Cabecera del Chatbot */}
            <div className={`bg-primary text-white p-3 rounded-t-lg flex items-center justify-between
                            ${isMobileLandscape ? 'rounded-b-none' : ''} transition-all duration-300
                            dark:bg-primary-dark`}
                 onClick={onOpenChatbot}>
                <h3 className={`font-semibold ${isMobileLandscape ? 'text-base' : 'text-lg'}`}>CyberGadgets Chatbot</h3>
                <button className="text-white hover:text-gray-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            {/* Contenido del Chatbot (mensajes e input) */}
            {isRendered && ( // Solo renderiza el contenido si isRendered es true
                <div
                    className={`bg-white dark:bg-zinc-800 flex flex-col h-full ${isMobileLandscape ? '' : 'rounded-b-lg'} shadow-xl transition-all duration-300 ease-in-out`}
                    style={{
                        transitionDelay: isOpen ? '400ms' : '0ms',
                        opacity: isOpen ? 1 : 0,
                        transform: `translateY(${isOpen ? '0' : '20px'})`
                    }}
                >
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-[80%] ${
                                        message.sender === "user"
                                            ? "bg-primary text-white dark:bg-primary-dark"
                                            : "bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200"
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}/> {/* Elemento para el scroll */}
                    </div>

                    {/* Formulario de entrada de mensaje */}
                    <form onSubmit={handleSendMessage} className={`p-3 border-t dark:border-zinc-700 flex gap-2`}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            className={`flex-1 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white transition-all duration-300 ${
                                isMobileLandscape ? 'px-2 py-1 text-sm' : 'px-3 py-2'
                            }`}
                        />
                        <button
                            type="submit"
                            className={`bg-primary text-white rounded-r-lg hover:bg-secondary dark:bg-primary-dark dark:text-white dark:hover:bg-terciary-dark focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg ${
                                isMobileLandscape ? 'px-3 py-1 text-sm' : 'px-4 py-2'
                            }`}
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
