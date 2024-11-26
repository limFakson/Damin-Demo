import React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { useState } from 'react';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';


import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';

const Slide = ({ file }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    
    return (
        <Worker workerUrl={workerSrc}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Viewer fileUrl={file.url} plugins={[thumbnailPluginInstance]} />
            </div>
        </Worker>
    );
}

export default Slide
