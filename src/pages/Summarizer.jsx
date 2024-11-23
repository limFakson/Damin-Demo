import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import PdfImg from '../file/pdf-img-view.png'
// import io from 'socket.io-client';

// const socket = io('http://localhost:8000');

const Summarizer = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");

    const pdfName = useRef(null);

    const pdfs = [0, 2, 2, 2]

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8001/chat/summarize`);

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            console.log("Message received from server:", event.data);
            const botMessage = { text: event.data, type: "received" };
            setMessages((prev) => [...prev, botMessage]);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        setSocket(ws);

        // Cleanup the WebSocket connection when component unmounts
        return () => {
            ws.close();
        };
    }, []);

    // const sendMessage = () => {
    //     if (input.trim() === "") return;

    //     const userMessage = { text: input, type: "sent" };
    //     setMessages((prevMessages) => [...prevMessages, userMessage]);

    //     setTimeout(() => {
    //         const botResponse = { text: "Hello, How are you doing", type: "received" };
    //         setMessages((prevMessages) => [...prevMessages, botResponse]);
    //     }, 500);

    //     setInput("");
    // };

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type: "message", content: input });
            const userMessage = { text: input, type: "sent" };
            socket.send(JSON.stringify(userMessage));
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            console.log("Message sent to server:", message);
            setInput(""); // Clear the input
        } else {
            console.error("WebSocket is not connected");
        }
    };

    const SearchQuery = () => {
        const name = pdfName.current.textContent;
        const newUrl = `${window.location.pathname}?c=${name}`;
        window.history.pushState(null, "", newUrl);
        setQuery(name);
    }

    return (
        <div className="pr-20 mr-16 overflow-auto relative">
            <div className="flex justify-center items-end bg-gray-100">
                <div className="side-nav h-[635px] w-[40%] bg-white pt-6">
                    <div className="side-items pt-10 px-6">
                        <h2 className='pl-2'>Recent</h2>
                        {pdfs.slice(0, 3).map((item, index) => (
                            <div
                                key={index}
                                className="pdf-items is_chat mt-3 pt-5 px-5 flex justify-start items-center gap-2"
                                onClick={SearchQuery}
                            >
                                <div className="img w-[30px]">
                                    <img src={PdfImg} className="w-full h-full" alt="" />
                                </div>
                                <div className="pdf-content" data-details="">
                                    <p ref={pdfName}>{item.name || "Pdf-view-demo.pdf"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full mb-2 rounded-lg shadow-lg ml-14 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        <div
                            className={`max-w-[90%] w-full grid`}
                        >
                            {messages.map((message, index) => (
                                <div key={index} className={`max-w-[70%] w-[70%] px-4 py-2 rounded-lg my-2 ${message.type === "sent"
                                    ? "bg-green-200 self-end text-right justify-self-end"
                                    : "bg-gray-200 self-start"
                                    }`}>
                                    {message.text}
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
        </div>
    );
}

export default Summarizer;
