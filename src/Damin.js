import React, { useEffect } from 'react'
import Logo from "./file/Asset 3figma2.png";
import './index.css';
import './css/App.css'
import { useState } from "react";
import Upload from "./pages/Upload";
import Summarizer from "./pages/Summarizer";
import Listen from "./pages/Listen";
import History from "./pages/History";


const App = () => {
  const ApiUrl = process.env.REACT_APP_API_URL
  console.log(ApiUrl)
  const [activePage, setActivePage] = useState("upload");

  const handleNavClick = (pageName) => {
    setActivePage(pageName);

    const urlWithoutQuery = window.location.origin + window.location.pathname;
    window.history.pushState({}, '', urlWithoutQuery);
  };

  useEffect(() => {
    const startApi = async () => {
      const Starter = `${ApiUrl}/home`
      try {
        const response = await fetch(`${Starter}`, {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
          }
        })
        if (response.ok) {
          const result = await response.json()
          console.log(result)
        }
      } catch {
        console.log("Unable to connect")
      }
    }
    startApi()
  })

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
      <main className='h-screen'>
        <header className='h-[18%] bg-[#fff]'>
          <div className='pt-2 px-4 flex justify-start items-center'>
            <img src={Logo} alt='damin logo' className='w-[80px] pr-3' />
            <h1 className='text-2xl'>Damin TTS App</h1>
          </div>
          <nav className='py-2 px-2 pr-0 sm:px-4 md:pl-20 mt-5'>
            <ul className='navs'>
              <li
                data-name="upload"
                className={`inline-block sm:p-2 mx-1 sm:mx-3 max-md:text-sm ${activePage === "upload" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("upload")}
              >
                Upload
              </li>
              <li
                data-name="summarizer"
                className={`inline-block sm:p-2 mx-1 sm:mx-3 max-md:text-sm ${activePage === "summarizer" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("summarizer")}
              >
                Summarizer
              </li>
              <li
                data-name="listen"
                className={`inline-block sm:p-2 mx-1 sm:mx-3 max-md:text-sm ${activePage === "listen" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("listen")}
              >
                Listen
              </li>
              {/* <li
                data-name="history"
                className={`inline-block p-4 mx-3 ${activePage === "history" ? "is_active" : ""
                  }`}
                onClick={() => handleNavClick("history")}
              >
                History
              </li> */}
            </ul>
          </nav>
        </header>
        <main className="body h-[80%]">{renderPage()}</main>
      </main>
    </div>
  )
}

export default App;

