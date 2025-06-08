import {useState, useRef, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';


export default function Chatbot({onOpenChatbot, isOpen}) {

    const [messages, setMessages] = useState([
        {id: 1, text: "Hello! How can I help you today?", sender: "bot"}
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const chatEndRef = useRef(null);

    // eslint-disable-next-line no-undef
    const API_URL = process.env.NODE_ENV === 'production' ? 'https://cyber-gadgets.onrender.com' : 'http://localhost:5000';

    const [sessionId] = useState(() => {
        // Check if a session ID already exists in localStorage
        const existingSessionId = localStorage.getItem('chatSessionId');
        if (existingSessionId) {
            return existingSessionId;
        }
        // Create new session ID if none exists
        const newSessionId = uuidv4();
        localStorage.setItem('chatSessionId', newSessionId);
        return newSessionId;
    });


    async function fetchResponse() {
        try {
            console.log("En try, antes de lo demás, api_url: " + API_URL + "\n inputValue: " + inputValue + "\n messagesLength: " + messages.length + "\n sessionId: " + sessionId)
            const response = await fetch(`${API_URL}/response?inputValue=${inputValue}&messagesLength=${messages.length}&sessionId=${sessionId}`)
            console.log("Después del fetch, response: " + response)
            const data = await response.json()
            console.log("data: " + data)
            setMessages(prevMessages => [...prevMessages, data])
            console.log("después de setMessages, messages: " + messages)
        } catch (error) {
            console.error("Error fetching the response:", error)
        }
    }


    useEffect(() => {
        const checkDeviceOrientation = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isMobileDevice = width <= 768;
            const isLandscape = width > height;

            setIsMobile(isMobileDevice);
            setIsMobileLandscape(isMobileDevice && isLandscape);
        };

        checkDeviceOrientation();

        // Add event listeners
        window.addEventListener('resize', checkDeviceOrientation);
        window.addEventListener('orientationchange', checkDeviceOrientation);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkDeviceOrientation);
            window.removeEventListener('orientationchange', checkDeviceOrientation);
        };
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // Handle animation timing when opening/closing
    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            // We don't need any timing logic here, as the component needs to remain rendered
        } else {
            // When closing, wait for animation to complete before removing from DOM
            const timer = setTimeout(() => {
                setIsRendered(false);
            }, 700); // Match this to your transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        // Add user message to chat
        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: "user"
        };

        setMessages([...messages, userMessage]);
        fetchResponse(userMessage.text)
        setInputValue("");
    };

    const toggleChat = () => {
        onOpenChatbot(!isOpen);
    };

    // Diferentes estilos según la orientación y dispositivo
    const getChatWindowStyles = () => {
        if (isMobileLandscape) {
            // Landscape móvil: ventana más pequeña y compacta
            return "fixed z-50 bg-white dark:bg-zinc-800 border dark:border-zinc-700 h-[60%] bottom-2 right-2 w-[50%] max-w-md";
        } else if (isMobile) {
            // Portrait móvil: pantalla completa
            return "fixed z-50 bg-white dark:bg-zinc-800 border dark:border-zinc-700 h-[80%] bottom-2 left-2 right-2";
        } else {
            // Desktop: ventana normal
            return "fixed z-50 bottom-6 right-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700 w-96 h-96 origin-bottom-right";
        }
    };

    const getMessagesHeight = () => {
        if (isMobileLandscape) {
            return 'calc(100% - 90px)'; // Más compacto en landscape
        } else if (isMobile) {
            return 'calc(100% - 130px)';
        } else {
            return 'calc(100% - 110px)';
        }
    };

    return (
        <div className={`fixed z-50 ${isMobileLandscape ? 'bottom-2 right-2' : 'bottom-6 right-6'}`}>
            {/* Collapsed chat button - always visible when chat is closed */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className={`bg-primary hover:bg-secondary text-white dark:bg-primary-dark dark:hover:bg-terciary-dark rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
                        isMobileLandscape ? 'p-2' : 'p-4'
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${isMobileLandscape ? 'h-4 w-4' : 'h-6 w-6'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </button>
            )}

            {/* Expanded chat window */}
            {isRendered && (
                <div
                    className={`${getChatWindowStyles()} transition-all duration-700 ease-out rounded-lg ${
                        isOpen
                            ? isMobile
                                ? "opacity-100 translate-y-0"
                                : "opacity-100 scale-100 rotate-0 shadow-2xl"
                            : isMobile
                                ? "opacity-0 translate-y-full"
                                : "opacity-0 scale-75 rotate-3 shadow-none"
                    }`}
                >
                    {/* Chat header */}
                    <div
                        className={`bg-primary text-white dark:bg-primary-dark flex justify-between items-center rounded-t-lg transition-all duration-700 ${
                            isMobileLandscape ? 'px-3 py-1' : 'px-4 py-3'
                        }`}
                        style={{
                            opacity: isOpen ? 1 : 0,
                            transform: `translateY(${isOpen ? '0' : '-10px'})`,
                            transitionDelay: isOpen ? '300ms' : '0ms'
                        }}
                    >
                        <h2 className={`font-semibold ${isMobileLandscape ? 'text-sm' : ''}`}>AI Assistant</h2>
                        <button
                            onClick={toggleChat}
                            className="text-white focus:outline-none transition-transform duration-300"
                            aria-label="Close chat"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`${isMobileLandscape ? 'h-4 w-4' : 'h-5 w-5'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Chat messages */}
                    <div
                        className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-800 transition-all duration-500 ${
                            isMobileLandscape ? 'p-2' : 'p-4'
                        }`}
                        style={{
                            height: getMessagesHeight(),
                            transitionDelay: isOpen ? '200ms' : '0ms'
                        }}
                    >
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`transition-all duration-500 ${
                                    message.sender === "user"
                                        ? "ml-auto bg-zinc-500 text-white"
                                        : "mr-auto bg-zinc-300 text-gray-800"
                                } rounded-lg max-w-xs ${
                                    isMobileLandscape
                                        ? "mb-1 px-2 py-1 text-sm max-w-[200px]"
                                        : "mb-3 px-4 py-2"
                                } ${isMobile && !isMobileLandscape ? "md:max-w-md" : ""}`}
                                style={{
                                    transitionDelay: isOpen ? `${100 + (index * 100)}ms` : '0ms',
                                    opacity: isOpen ? 1 : 0,
                                    transform: `translateY(${isOpen ? '0' : '20px'})`
                                }}
                            >
                                {message.text}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>

                    {/* Chat input */}
                    <form
                        onSubmit={handleSubmit}
                        className={`border-t dark:border-zinc-700 flex absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                            isMobileLandscape ? 'p-2' : 'p-3'
                        }`}
                        style={{
                            transitionDelay: isOpen ? '400ms' : '0ms',
                            opacity: isOpen ? 1 : 0,
                            transform: `translateY(${isOpen ? '0' : '20px'})`
                        }}
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
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
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
