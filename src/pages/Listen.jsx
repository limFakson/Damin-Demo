import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import PdfImg from '../file/pdf-img-view.png';
import Slide from './Slide';

const Listen = () => {
    const [textInput, setTextInput] = useState("");
    const [file, setFile] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [pitch, setPitch] = useState(1.0);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true)
    const [slide, setSlide] = useState(null)


    const handleTextChange = (e) => setTextInput(e.target.value);

    const handleFileChange = (e) => setFile(e.target.files[0]);

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

    const handlePlayAudio = () => {
        if (textInput.trim()) {
            // Simulate playing audio
            setIsPlaying(true);
            setTimeout(() => setIsPlaying(false), 3000); // Example duration
        }
    };

    const handleDownloadAudio = () => {
        alert("Audio download initiated! (Placeholder functionality)");
    };

    const pdfName = useRef(null);
    const SearchQuery = (item) => {
        const name = pdfName.current.textContent;
        const newUrl = `${window.location.pathname}?c=${name}`;
        window.history.pushState(null, "", newUrl);
        setQuery(name);
        setSlide(item)
    }
    return (
        <div className="flex">
            <div className="absolute left-0 top-0 h-screen w-50% ">
                {slide && (<Slide file={slide} />)}
            </div>
            <div className="side-nav h-[635px] w-[30%] bg-white pt-6">
                {loading ? (
                    <p>Loading.....</p>
                ) : (
                    <div className="side-items pt-10 px-6">
                        <h2 className="pl-2">Recent</h2>
                        {file.length > 0 ? (
                            file.map((item, index) => (
                                <div
                                    key={index}
                                    className="pdf-items is_chat mt-3 pt-5 px-5 flex justify-start items-center gap-2"
                                    onClick={() => SearchQuery(item)}
                                >
                                    <div className="img w-[30px]">
                                        <img src={PdfImg} className="w-full h-full" alt="PDF Icon" />
                                    </div>
                                    <div className="pdf-content" data-details="">
                                        <p ref={pdfName}>{item.name || "Pdf-view-demo.pdf"}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No recent files found.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="listen-page p-6 pb-2 flex flex-col items-center justify-between w-[65%]">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Listen to Your PDF Document</h1>
                <div className="w-full bg-white shadow-md rounded-lg p-6">
                    {/* Text Input Section */}
                    <textarea
                        disabled
                        value={textInput}
                        onChange={handleTextChange}
                        className="w-full h-40 border border-gray-300 rounded-md p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    ></textarea>
                    {/* File Upload Section */}
                    <div className="file-upload mb-4 flex items-center">
                        <input
                            type="file"
                            accept=".txt,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                    </div>
                    {/* Audio Controls */}
                    <div className="controls flex justify-between items-center mb-4">
                        <button
                            onClick={handlePlayAudio}
                            className={`px-6 py-2 rounded-md ${isPlaying
                                ? "bg-gray-400 text-white"
                                : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                            disabled={isPlaying}
                        >
                            {isPlaying ? "Playing..." : "Play Audio"}
                        </button>
                        <button
                            onClick={handleDownloadAudio}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        >
                            Download Audio
                        </button>
                    </div>
                    {/* Speed and Pitch Sliders */}
                    <div className="sliders flex flex-col gap-4">
                        <div className="flex items-center">
                            <label htmlFor="speed" className="text-gray-700 mr-4">
                                Speed:
                            </label>
                            <input
                                id="speed"
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={speed}
                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <span className="ml-4 text-gray-700">{speed.toFixed(1)}x</span>
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="pitch" className="text-gray-700 mr-4">
                                Pitch:
                            </label>
                            <input
                                id="pitch"
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <span className="ml-4 text-gray-700">{pitch.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listen
