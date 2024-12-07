import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import PdfImg from '../file/pdf-img-view.png';
import { Howl } from 'howler';
import ReactMarkdown from 'react-markdown';

const Listen = () => {
    const ApiUrl = process.env.REACT_APP_API_URL
    const [textInput, setTextInput] = useState("");
    const soundInstanceRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.3);
    const [pitch, setPitch] = useState(1.0);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [slide, setSlide] = useState(null);
    const [isPopoutOpen, setIsPopoutOpen] = useState(false);
    const popoutRef = useRef(null);
    const [selectedValues, setSelectedValues] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [audio, setAudio] = useState("");
    const loadingState = useRef(null);

    // const handleTextChange = (e) => setTextInput(e.target.value);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const getFileAudio = async (values, id) => {
        loadingState.current.style.display = "flex"
        values.sort((a, b) => a - b);
        const pages = JSON.stringify(values)

        try {
            const response = await fetch(`${ApiUrl}/pdf/audio/${id}?pages=${pages}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log("API Response:", result);

                if (result.audio) {
                    setAudio(result.audio); // Corrected property name
                    console.log("Audio URL set:", result.audio);
                    console.log(result.text)
                    setTextInput(
                        result.text
                            .map((text, index) => `Page ${index + 1}: ${text}`)
                            .join("\n\n") // Join with a newline or any delimiter you prefer
                    );

                    // Clear modal state
                    setIsPopoutOpen(false);
                    setSlide(null);
                    setSelectedValues([]);
                    loadingState.current.style.display = "None";
                } else {
                    loadingState.current.style.display = "None";
                    console.error("Audio URL not found in API response.");
                }
            } else {
                loadingState.current.style.display = "None";
                console.error("API Error:", await response.text());
            }

            setSidebarOpen((prevState) => !prevState);
        } catch (error) {
            loadingState.current.style.display = "None";
            console.error("Error fetching audio:", error);
            setSidebarOpen((prevState) => !prevState);
        }

    };

    const handlePlayAudio = () => {
        if (!audio) {
            console.error("No audio URL available to play!");
            return;
        }

        if (soundInstanceRef.current) {
            if (isPlaying) {
                soundInstanceRef.current.pause();
                setIsPlaying(false);
            } else {
                soundInstanceRef.current.play();
                setIsPlaying(true);
            }
            return;
        }

        soundInstanceRef.current = new Howl({
            src: [audio],
            html5: true,
            rate: speed,
            preload: true,
            onload: () => console.log("Audio loaded successfully"),
            onloaderror: (id, err) => console.error("Error loading audio:", err),
            onplayerror: (id, err) => console.error("Error playing audio:", err),
        });

        soundInstanceRef.current.play();
        setIsPlaying(true);

        // Reset playback state when audio ends
        soundInstanceRef.current.on('end', () => {
            setIsPlaying(false);
            console.log("Audio playback ended.");
        });
    };

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed); // Update state
        if (soundInstanceRef.current) {
            soundInstanceRef.current.rate(newSpeed); // Adjust speed dynamically
        }
    };

    const handleDownloadAudio = () => {
        if (!audio) {
            console.error("No audio URL available to download!");
            return;
        }

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = audio; // The audio URL
        link.download = 'audio.mp3'; // Set a default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Audio download initiated!");
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

        loadingState.current.style.display = "flex";
        setTimeout(() => {
            getFilesFromLocalStorage();
            setLoading(false);
            loadingState.current.style.display = "None";
        }, 1000);
    }, []);

    const SearchQuery = (item) => {
        setSlide(null); // Reset previous slide
        setIsPopoutOpen(false);
        setTimeout(() => {
            const name = item.name || "Unknown";
            const newUrl = `${window.location.pathname}?c=${name}`;
            window.history.pushState(null, "", newUrl);
            setQuery(name);
            setSlide(item);
            setIsPopoutOpen(true);
        }, 0);
    };

    const ClosePdfPopOut = () => {
        setIsPopoutOpen(false);
        setSlide(null);
        setSelectedValues([]);
        console.log(query, loading)
    };

    const SelectPage = (e) => {
        const element = e.currentTarget;
        const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
        const value = parseInt(checkbox.value, 10);

        if (selectedValues.includes(value)) {
            setSelectedValues((prev) => prev.filter((v) => v !== value));
            element.style.border = "none";
        } else {
            setSelectedValues((prev) => [...prev, value]);
            element.style.border = "2px solid blue";
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };
    return (
        <div className="flex h-full">
            <div ref={loadingState} className='loading-state absolute top-0 h-screen w-full bg-[#0000004e] items-center justify-center z-20 text-3xl'>Loading....</div>
            <div className='toggle rounded-full bg-[#007bff] w-fit block ml-4 p-3 absolute z-10 sm:hidden' onClick={toggleSidebar}>
                <i class="fa-solid fa-list text-xl text-white"></i>
            </div>
            {/* Sidebar */}
            <div className={`bg-[#0000002d] w-full h-full absolute top-0 left-0 ${isSidebarOpen ? 'block' : 'hidden'}`}></div>
            <div className={`side-nav h-full w-[300px] sm:w-[30%] bg-white pt-6 absolute sm:static ${isSidebarOpen ? 'left-0' : 'left-[-100%]'} transition-left z-0 duration-300`}>
                <div className="side-items pt-10 px-6">
                    <h2 className="pl-2">Recent</h2>
                    {file && file.length > 0 ? (
                        file.map((item, index) => (
                            <div
                                key={index}
                                className="pdf-items is_chat mt-3 pt-5 px-5 flex justify-start items-center gap-2 cursor-pointer"
                                onClick={() => SearchQuery(item)}
                            >
                                <div className="img min-w-[25px] w-[30px]">
                                    <img src={PdfImg} className="w-full h-full" alt="PDF Icon" />
                                </div>
                                <div className="pdf-content truncate-text">
                                    <p>{item.name || "Pdf-view-demo.pdf"}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No recent files found.</p>
                    )}
                </div>
            </div>

            {/* Popout Modal */}
            {isPopoutOpen && slide && (
                <div
                    className="absolute w-full top-0 h-screen bg-gray-800 bg-opacity-75 flex items-center justify-center"
                    ref={popoutRef}
                >
                    <div className="bg-white w-auto max-w-[900px] h-auto p-10 pb-6 rounded-lg relative">
                        <span
                            className="absolute top-4 right-4 text-xl cursor-pointer"
                            onClick={ClosePdfPopOut}
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                        <div className="grid w-full mt-4">
                            <div className="bg-white self-center overflow-y-auto h-full flex">
                                {Array.from({ length: slide.length || 0 }).map((_, index) => (
                                    <div key={index} className="m-4 cursor-pointer p-2" onClick={SelectPage}>
                                        <div className="img w-[60px]">
                                            <img
                                                src={PdfImg}
                                                className="w-full h-full"
                                                alt="PDF Icon"
                                            />
                                        </div>
                                        <div className="pdf-content">
                                            <p>Page {index + 1}</p>
                                        </div>
                                        <div className='absolute'>
                                            <input type="checkbox" name="PdfPage" hidden value={index + 1} checked={selectedValues.includes(index + 1)} id="" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="btn justify-self-center w-auto">
                                <button className='bg-[#007bff] px-3 py-2 text-[#f4f4f4] rounded-2xl' onClick={() => getFileAudio(selectedValues, slide.id)}>Get Audio</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Panel */}
            <div className="listen-page p-6 pb-2 flex flex-col items-center justify-end w-full h-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Listen to Your PDF Document</h1>
                <div className="max-w-full w-full bg-white shadow-md rounded-lg p-6">
                    {/* Text Input Section */}
                    <ReactMarkdown className="border w-full min-h-28 max-h-[19rem] sm:max-h-[26rem] overflow-y-scroll">
                        {textInput}
                    </ReactMarkdown>
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
                            className={`px-3 sm:px-6 py-2 rounded-md ${isPlaying
                                ? "bg-gray-400 text-white"
                                : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                        >
                            {isPlaying ? "Pause Audio" : "Play Audio"}
                        </button>
                        <button
                            onClick={handleDownloadAudio}
                            className="bg-blue-500 text-white px-3 sm:px-6 py-2 rounded-md hover:bg-blue-600"
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
                                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
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
        </div >
    );
};

export default Listen;
