# Project Damin - UI Documentation

This document outlines the user interface (UI) structure and functionality of **Project Damin**, focusing on the components and interactions we've implemented over the last week. This will serve as a comprehensive guide for developers and contributors.

---

## Table of Contents

1. [Overview](#overview)
2. [Components](#components)
    - [Audio Controls](#audio-controls)
    - [Speed and Pitch Sliders](#slider-properties)
    - [Popout Navigation](#popout-navigation)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Features](#features)
6. [Future Improvements](#future-improvements)

---

## Overview

The UI for **Project Damin** is designed to deliver a smooth user experience for interacting with text and audio files. It features:
- **Dynamic page-based text rendering** for PDFs.
- **Audio playback controls** with speed and pitch adjustment.
- **Popout navigation** for quick interaction.
- **Responsive design** for usability on both desktop and mobile devices.

---

## Components

### Audio Controls

The audio controls allow users to play, pause, and download audio files generated from PDF text.

- **Buttons**:
  - `Play Audio`: Starts audio playback.
  - `Pause Audio`: Pauses ongoing playback.
  - `Download Audio`: Triggers a download of the current audio file.

### Slider Properties

#### Speed
- **Range**: `0.5x` to `2.0x`
- **Step**: `0.1`

#### Pitch
- **Range**: `0.5x` to `2.0x`
- **Step**: `0.1`

---

## State Management

The application uses **React state hooks** to manage interactions dynamically. Key state variables include:

- **`audio`**: Stores the audio file URL for playback.
- **`speed`**: Controls the playback speed of audio.
- **`pitch`**: Adjusts the pitch for audio playback.
- **`isPlaying`**: Tracks whether audio is currently playing.
- **`textInput`**: Stores the formatted text from the PDF.

---

## API Integration

The UI interacts with a backend API for the following operations:

### Fetching PDF Text
- **Endpoint**: `/pdf/text/:id`
- **Response**: Returns an array of strings representing page content.

### Generating Audio
- **Endpoint**: `/pdf/audio/:id`
- **Parameters**: `pages` (array of page numbers)
- **Response**: Returns a URL for the audio file.

---

## Features

### Live Audio Playback
- Supports **dynamic speed and pitch adjustments**.
- Allows **pausing and resuming** audio playback.

### PDF Page Navigation
- Enables users to view text content with appropriate **page labeling**.

### Audio Download
- Provides direct **audio file download** functionality.


### Key Features of This Documentation:
- **Pure Markdown**: Includes headings, code snippets, and lists for clarity.
- **Component Focused**: Documents each UI component separately.
- **Developer-Friendly**: Provides code examples to quickly understand the implementation.
- **Future-Oriented**: Suggests improvements for future development.

You can adapt this template as your project grows! 🚀
