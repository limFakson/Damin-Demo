import React from 'react'
import { useState, useEffect } from 'react';
import PdfImg from '../file/pdf-img-view.png'
// import io from 'socket.io-client';

// const socket = io('http://localhost:8000');

const Summarizer = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const pdfs = [0, 2, 2, 2]

    const sendMessage = () => {
        if (input.trim() === "") return;

        const userMessage = { text: input, type: "sent" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setTimeout(() => {
            const botResponse = { text: "Hello, How are you doing", type: "received" };
            setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 500);

        setInput("");
    };

    return (
        <div className="pr-20 mr-16">
            <div className="flex justify-center items-center bg-gray-100">
                <div className="side-nav h-svh w-[40%] bg-white pt-6">
                    <div className="side-items pt-10 px-6">
                        <h2 className='pl-2'>Recent</h2>
                        {pdfs.slice(0, 3).map((item, index) => (
                            <div
                                key={index}
                                className="pdf-items is_chat mt-3 pt-5 px-5 flex justify-start items-center gap-2"
                            >
                                <div className="img w-[30px]">
                                    <img src={PdfImg} className="w-full h-full" alt="" />
                                </div>
                                <div className="pdf-content" data-details="">
                                    <p>{item.name || "Pdf-view-demo.pdf"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full bg-white rounded-lg shadow-lg ml-14 flex flex-col">
                    {/* Chat Header */}
                    {/* <div className="bg-blue-500 text-white py-3 px-4 text-lg font-semibold">
                        Chat
                    </div> */}
                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`max-w-[70%] px-4 py-2 rounded-lg ${message.type === "sent"
                                    ? "bg-green-200 self-end"
                                    : "bg-gray-200 self-start"
                                    }`}
                            >
                                {message.text}
                            </div>
                        ))}
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
