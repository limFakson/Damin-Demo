import React, { useRef, useState, useEffect } from 'react';
import PdfImg from '../file/pdf-img-view.png';
import ReactMarkdown from 'react-markdown';
import Logo from "../file/Asset 3figma2.png";

const Summarizer = () => {
    const WSApiUrl = process.env.REACT_APP_WS_URL
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const pdfName = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const apiCall = async (id) => {
        const ws = new WebSocket(`${WSApiUrl}/chat/summarize?pdf_id=${id}`);

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (Array.isArray(data)) {
                    console.log(data.map((item) => ({ text: item.text, type: item.type })))
                    const botMessages = data.map((item) => ({ text: item.text, type: item.type }));
                    setMessages((prev) => [...prev, ...botMessages]);
                } else {
                    const botMessage = { text: data, type: "received" };
                    setMessages((prev) => [...prev, botMessage]);
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
                const botMessage = { text: event.data, type: "received" };
                setMessages((prev) => [...prev, botMessage]);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    };

    useEffect(() => {
        const getFilesFromLocalStorage = () => {
            try {
                const files = JSON.parse(localStorage.getItem("files")) || [];
                setFile(files);
            } catch (error) {
                console.error("Error parsing localStorage data:", error);
                setFile([]);
            }
        };

        setTimeout(() => {
            getFilesFromLocalStorage();
            setLoading(false);
        }, 1000);
    }, []);

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const userMessage = { text: input, type: "sent" };
            const updatedMessages = [...messages, userMessage];

            socket.send(JSON.stringify(userMessage));
            setMessages(updatedMessages);

            setInput("");
        } else {
            console.error("WebSocket is not connected");
        }
    };

    const SearchQuery = (id) => {
        const name = pdfName.current.textContent;
        const newUrl = `${window.location.pathname}?c=${name}`;
        window.history.pushState(null, "", newUrl);
        setQuery(id);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
        setMessages([])

        apiCall(id);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage()
        }
    };


    const toggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };

    return (
        <div className="pr-4 sm:mr-16 relative h-full" key={query}>
            <div className='toggle rounded-full bg-[#007bff] w-fit block ml-4 p-3 absolute z-10 sm:hidden' onClick={toggleSidebar}>
                <i class="fa-solid fa-list text-xl text-white"></i>
            </div>
            <div className="flex justify-center items-start bg-gray-100 h-full">
                <div className={`bg-[#0000002d] w-full h-full absolute top-0 left-0 ${isSidebarOpen ? 'block' : 'hidden'}`}></div>
                <div className={`side-nav h-full w-[300px] sm:w-[30%] bg-white pt-6 absolute sm:static ${isSidebarOpen ? 'left-0' : 'left-[-100%]'} transition-left z-0 duration-300`}>
                    {loading ? (
                        <p>Loading.....</p>
                    ) : (
                        <div className="side-items pt-10 px-6">
                            <h2 className="pl-2">Recent</h2>
                            {file?.length > 0 ? (
                                file.map((item, index) => (
                                    <div
                                        key={index}
                                        className="pdf-items is_chat mt-3 pt-5 px-5 flex justify-start items-center gap-2"
                                        onClick={() => SearchQuery(item.id)}
                                    >
                                        <div className="img min-w-[25px] w-[30px]">
                                            <img src={PdfImg} className="w-full h-full" alt="PDF Icon" />
                                        </div>
                                        <div className="pdf-content" data-details="">
                                            <p ref={pdfName} className="truncate-text">{item.name || "Pdf-view-demo.pdf"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No recent files found.</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="w-full mb-2 rounded-lg shadow-lg ml-6 flex flex-col h-full">
                    <div className="flex-1 p-4 overflow-y-scroll space-y-3">
                        <div
                            className={`w-full grid`}
                        >
                            {messages.map((message, index) => (
                                <div key={index} className='grid'>
                                    {message.type !== "sent" ? (
                                        <div className='self-start flex items-start justify-start px-4 py-2 rounded-lg my-2 w-[80%]'>
                                            <img src={Logo} className='w-[40px] h-[35px]' alt="" />
                                            <div className='pl-4 pt-2'>
                                                <ReactMarkdown>
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    ) : (
                                        <ReactMarkdown className={`px-4 py-2 rounded-lg my-2 max-w-[60%] w-auto bg-gray-500 text-[#f4f4f4] self-end text-left justify-self-end`}>
                                            {message.text}
                                        </ReactMarkdown>
                                    )}
                                    <div ref={messagesEndRef}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Chat Input */}
                    <div className="flex items-center p-3 border-t border-gray-300 bg-gray-100">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type='submit'
                            onClick={sendMessage}
                            className="ml-3 py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Summarizer;
