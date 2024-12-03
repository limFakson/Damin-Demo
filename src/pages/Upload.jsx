import React, { useRef } from 'react'
import { useState } from 'react';
import PdfImg from '../file/pdf-img-view.png'

const Upload = () => {
    const uploadButton = useRef(null);
    const confirmation = useRef(null);

    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (file && file.type === "application/pdf") {
            setUploadedFile(file);
            uploadButton.current.style.display = "block"
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        uploadButton.current.style.display = 'none'
        confirmation.current.textContent = ""
    };

    const saveFileToLocalStorage = (fileName) => {
        const storedFiles = JSON.parse(localStorage.getItem("files")) || [];

        storedFiles.push(fileName);

        localStorage.setItem("files", JSON.stringify(storedFiles));
    };

    const pdfSentUpload = async () => {
        const ApiUrl = "http://localhost:8000/upload/pdf"
        try {
            const formData = new FormData();
            formData.append("file", uploadedFile);
            const response = await fetch(`${ApiUrl}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("API Response:", result);
                confirmation.current.textContent = await result.message;
                saveFileToLocalStorage(result.pdf);
            } else {
                confirmation.current.textContent = response.statusText
                console.error("Error:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 my-4 md:my-8 mx-4 lg:mx-12">
            <div className="upload flex flex-col md:flex-row flex-wrap justify-center items-start">
                {/* Info Section */}
                <div className="form_upload w-full md:w-[50%] mb-8 md:mb-0 pt-6 md:pt-10 pr-0 md:pr-6 lg:pr-10">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Upload a PDF to begin</h1>
                    <div className="page_content mt-4 text-sm sm:text-base text-gray-700">
                        <p>
                            The Damin TTS App is designed to bridge the gap in accessibility for individuals with special educational needs.
                            By leveraging advanced Text-to-Speech technology, our platform converts written PDF documents into clear,
                            natural-sounding audio.
                        </p>
                        <p className="pt-4">
                            Upload a PDF today and let our system transform it into an audio format that empowers every learner, one voice at a time.
                        </p>
                    </div>
                </div>

                {/* Uploader Section */}
                <div className="uploader w-full md:w-[50%] flex flex-col items-center">
                    <div className="view w-full max-w-sm h-auto">
                        {/* Confirmation Text */}
                        <p className="text-center text-green-500 pb-2 text-sm" ref={confirmation}></p>

                        {/* Upload Area */}
                        <div
                            className="upload_pdf flex flex-col justify-center items-center"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                        >
                            {!uploadedFile ? (
                                <div className="drag-drop w-full max-w-[340px] sm:max-w-sm h-[360px] sm:h-[400px] border-[3px] border-dashed border-black flex flex-col justify-center items-center rounded-md">
                                    <div className="drop p-4 sm:p-6 text-center grid">
                                        <div
                                            className="plus mb-4 justify-self-center rounded-full p-4 bg-[#0404043d] flex justify-center items-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
                                            style={{ lineHeight: "0" }}
                                        >
                                            <i className="fa-solid fa-plus text-2xl sm:text-3xl text-[#007bff]"></i>
                                        </div>
                                        <p className="text-sm sm:text-base">
                                            Drop your PDF document here or{" "}
                                            <label
                                                htmlFor="file-input"
                                                className="text-[#007bff] cursor-pointer underline"
                                            >
                                                select here
                                            </label>
                                        </p>
                                        <p className="formats pt-2 text-gray-400 text-xs sm:text-sm">PDF file less than 30MB</p>
                                        <input
                                            type="file"
                                            id="file-input"
                                            accept="application/pdf"
                                            hidden
                                            onChange={handleFileDrop}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="pdf-view w-full max-w-[340px] sm:max-w-sm h-auto border-[3px] border-dashed border-black p-4 flex flex-col items-center justify-between rounded-md">
                                    <div className="pdf-img w-full h-[180px] sm:h-[200px] flex justify-center items-center bg-gray-200 rounded-md">
                                        <img
                                            src={PdfImg}
                                            alt="Uploaded PDF"
                                            className="w-[120px] sm:w-[150px] h-auto object-contain"
                                        />
                                    </div>
                                    <p className="text-center text-gray-600 mt-4 text-sm sm:text-base truncate">{uploadedFile.name}</p>
                                    <button
                                        className="mt-4 bg-[#007bff] hover:bg-blue-600 text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base"
                                        onClick={handleRemoveFile}
                                    >
                                        Remove PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hidden Upload Button */}
                    <button
                        hidden
                        className="bg-[#007bff] mt-3 text-sm sm:text-xl w-24 sm:w-28 text-white h-9 rounded-2xl"
                        ref={uploadButton}
                        onClick={pdfSentUpload}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Upload;
