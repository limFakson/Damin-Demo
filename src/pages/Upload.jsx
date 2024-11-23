import React from 'react'
import { useState } from 'react';
import PdfImg from '../file/pdf-img-view.png'

const Upload = () => {

    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (file && file.type === "application/pdf") {
            setUploadedFile(file);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    return (
        <div className='p-8 my-8 mr-16 ml-12'>
            <div className="upload flex justify-center items-start">
                <div className="form_upload w-[50%] pt-14 pr-20">
                    <h1>Upload a PDF to begin</h1>
                    <div className="page_content mt-4">
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
                <div className="view w-[420px] h-[480px] pt-4">
                    <div
                        className="upload_pdf flex flex-col justify-center items-center"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                    >
                        {/* PDF Upload Area */}
                        {!uploadedFile ? (
                            <div className="drag-drop w-[380px] h-[440px] border-[3px] border-dashed border-black flex flex-col justify-center items-center">
                                <div className="drop p-6 grid text-center">
                                    <div
                                        className="plus mb-4 justify-self-center rounded-full p-4 bg-[#0404043d] flex justify-center items-center w-[60px] h-[60px]"
                                        style={{ lineHeight: "0" }}
                                    >
                                        <i className="fa-solid fa-plus text-3xl text-[#007bff]"></i>
                                    </div>
                                    <p>
                                        Drop your PDF document here or{" "}
                                        <label
                                            htmlFor="file-input"
                                            className="text-[#007bff] cursor-pointer"
                                        >
                                            select here
                                        </label>
                                    </p>
                                    <p className="formats pt-2 text-gray-400">PDF file less than 30MB</p>
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
                            // PDF View Area
                            <div className="pdf-view w-[350px] h-[420px] border-[3px] border-dashed border-black p-4 flex flex-col items-center justify-between">
                                <div className="pdf-img w-full h-full flex justify-center items-center bg-gray-200">
                                    <img
                                        src={PdfImg}
                                        alt="Uploaded PDF"
                                        className="w-[200px] h-[220px] object-contain"
                                    />
                                </div>
                                <p className="text-center text-gray-600 mt-4">{uploadedFile.name}</p>
                                <button
                                    className="mt-4 bg-[#007bff] rounded-lg text-white px-4 py-2"
                                    onClick={handleRemoveFile}
                                >
                                    Remove PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Upload;