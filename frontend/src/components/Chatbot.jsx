import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
        // For now, we'll just add a placeholder response
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
        <div className="fixed bottom-6 right-6 z-50">
            {/* Collapsed chat button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-primary hover:bg-secondary text-white  dark:bg-primary-dark dark:hover:bg-terciary-dark rounded-full p-4 shadow-lg flex items-center justify-center"
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
            {isOpen && (
                <div className="flex flex-col w-80 h-96 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border dark:border-zinc-700">
                    {/* Chat header */}
                    <div className="px-4 py-3 bg-primary text-white dark:bg-primary-dark rounded-t-lg flex justify-between items-center">
                        <h2 className="font-semibold">AI Assistant</h2>
                        <button
                            onClick={toggleChat}
                            className="text-white focus:outline-none"
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
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-zinc-800">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`mb-3 ${
                                    message.sender === "user"
                                        ? "ml-auto bg-zinc-500 text-white"
                                        : "mr-auto bg-zinc-300 text-gray-800"
                                } px-4 py-2 rounded-lg max-w-xs`}
                            >
                                {message.text}
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>


                    {/* Chat input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t flex">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-secondary dark:bg-primary-dark dark:text-white dark:hover:bg-terciary-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
