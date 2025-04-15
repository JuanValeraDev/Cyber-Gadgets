import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const chatEndRef = useRef(null);

    // Check if viewport is mobile size and update state
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        setInputValue("");

        // Here you would integrate with your AI service
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                text: "This is where the AI response will appear once you integrate your service.",
                sender: "bot"
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        }, 1000);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 ">
            {/* Collapsed chat button - always visible when chat is closed */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-primary hover:bg-secondary text-white dark:bg-primary-dark dark:hover:bg-terciary-dark rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    className={`fixed z-50 transition-all duration-700 ease-out rounded-lg ${
                        isMobile
                            ? " bg-white dark:bg-zinc-800 border dark:border-zinc-700 h-[80%] bottom-2 left-2 right-2"
                            : "bottom-6 right-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700  w-80 h-96 origin-bottom-right"
                    } ${
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
                        className={`px-4 py-3 bg-primary text-white dark:bg-primary-dark flex justify-between items-center rounded-t-lg transition-all duration-700`}
                        style={{
                            opacity: isOpen ? 1 : 0,
                            transform: `translateY(${isOpen ? '0' : '-10px'})`,
                            transitionDelay: isOpen ? '300ms' : '0ms'
                        }}
                    >
                        <h2 className="font-semibold">AI Assistant</h2>
                        <button
                            onClick={toggleChat}
                            className="text-white focus:outline-none transition-transform duration-300 "
                            aria-label="Close chat"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                        className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-zinc-800 transition-all duration-500"
                        style={{
                            height: isMobile ? 'calc(100% - 130px)' : 'calc(100% - 110px)',
                            transitionDelay: isOpen ? '200ms' : '0ms'
                        }}
                    >
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`mb-3 transition-all duration-500 ${
                                    message.sender === "user"
                                        ? "ml-auto bg-zinc-500 text-white"
                                        : "mr-auto bg-zinc-300 text-gray-800"
                                } px-4 py-2 rounded-lg max-w-xs ${isMobile ? "md:max-w-md" : ""}`}
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
                        className="p-3 border-t dark:border-zinc-700 flex absolute bottom-0 left-0 right-0 transition-all duration-500"
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
                            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white transition-all duration-300"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary dark:bg-primary-dark dark:text-white dark:hover:bg-terciary-dark focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
