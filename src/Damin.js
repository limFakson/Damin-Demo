import React from 'react'
import Logo from "./file/Asset 3figma2.png";
import './index.css';
import './css/App.css'
import { useState } from "react";
import Upload from "./pages/Upload";
import Summarizer from "./pages/Summarizer";
import Listen from "./pages/Listen";
import History from "./pages/History";


const App = () => {
  const [activePage, setActivePage] = useState("upload");

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
  };

  const renderPage = () => {
    switch (activePage) {
      case "upload":
        return <Upload />;
      case "summarizer":
        return <Summarizer />;
      case "listen":
        return <Listen />;
      case "history":
        return <History />;
      default:
        return <Upload />;
    }
  };

  return (
    <div>
      <main>
        <header>
          <div className='pt-2 px-4 flex justify-start items-center'>
            <img src={Logo} alt='damin-logo' className='w-[80px] pr-3' />
            <h1>Damin TTS App</h1>
          </div>
          <nav className='py-2 px-4 pl-20'>
            <ul className='navs'>
              <li
                data-name="upload"
                className={`inline-block p-2 mx-3 ${activePage === "upload" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("upload")}
              >
                Upload
              </li>
              <li
                data-name="summarizer"
                className={`inline-block p-4 mx-3 ${activePage === "summarizer" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("summarizer")}
              >
                Summarizer
              </li>
              <li
                data-name="listen"
                className={`inline-block p-4 mx-3 ${activePage === "listen" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("listen")}
              >
                Listen
              </li>
              <li
                data-name="history"
                className={`inline-block p-4 mx-3 ${activePage === "history" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("history")}
              >
                History
              </li>
            </ul>
          </nav>
        </header>
        <main className="body">{renderPage()}</main>
      </main>
    </div>
  )
}

export default App;

