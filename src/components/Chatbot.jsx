import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

function Chatbot({ change }) {
  const searchBox = useRef(null);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    searchBox.current.style.height = "auto";
    searchBox.current.style.height = searchBox.current.scrollHeight + "px";
  }, [text]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        change();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [change]);

  const handleSearch = () => {
    setIsResponding(true);
    setText("");
    const search = {
      from: "user",
      message: searchBox.current.value,
    };

    setChats([
      ...chats,
      search,
      {
        from: "bot",
        message: "...",
      },
    ]);

    fetchResponse().then((res) => {
      setChats((prev) => {
        if (
          prev[prev.length - 1].message === "..." &&
          prev[prev.length - 1].from === "bot"
        )
          prev.pop();
        return [...prev, res];
      });
      setIsResponding(false);
    });
  };

  const fetchResponse = () => {
    return new Promise((resolve, reject) => {
      const success = true;
      const delay = 2000;

      setTimeout(() => {
        if (success) {
          resolve({
            from: "bot",
            message: "indeed",
          });
        } else {
          reject("Error: Failed to fetch data.");
        }
      }, delay);
    });
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition)
      return alert(
        "Speech Recognition is not supported in your browser. Please use Chrome or Edge."
      );

    const recognition = new SpeechRecognition();
    setIsRecording(true);
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      searchBox.current.value = speechToText;
      console.log(searchBox.current.value);
      setText(speechToText);
      setIsRecording(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);
    };
  };

  return (
    <div ref={chatbotRef}>
      <section className="chatbot">
        <button
          onClick={() => {
            change();
            console.log("clicked");
          }}
          className="cb-close__button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            {" "}
            <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292968 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>{" "}
          </svg>
        </button>
        <div className="chatbot__container">
        <video
            // ref={videoElement}
            className="chatbot--video"
            autoPlay={true}
          />
        </div>

        <h1 className="chatbot__title">Ask Buddy</h1>
      </section>
      <div className="cb__main">
        <section className="chatbox">
          <div className="chat__window">
            {chats.map((chat, index) => {
              if (chat.from === "user") {
                return (
                  <div key={index} className="message">
                    <span className="user-message">{chat.message}</span>
                  </div>
                );
              } else if (chat.from === "bot") {
                return (
                  <div key={index} className="message">
                    <span className="bot-message">{chat.message}</span>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} aria-hidden={true} />
          </div>
        </section>
      </div>
      <section className="chat__main">
        <div className="input__container">
          <input
            tabIndex={0}
            ref={searchBox}
            placeholder={isRecording ? "Listening..." : "Ask me anything..."}
            className="searchbox"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isResponding) handleSearch();
            }}
            value={text}
            maxLength={100}
            rows={1}
          />
          <button
            tabIndex={0}
            disabled={text.length === 0 || isResponding || isRecording}
            className="control--send"
            onClick={() => handleSearch()}
          >
            {text.length === 0 || isResponding || isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.694 12 2.299 3.27c-.236-.607.356-1.188.942-.981l.093.039 18 9a.75.75 0 0 1 .097 1.284l-.097.058-18 9c-.583.291-1.217-.245-1.065-.848l.03-.095L5.694 12 2.299 3.27 5.694 12ZM4.402 4.54l2.61 6.71h6.627a.75.75 0 0 1 .743.648l.007.102a.75.75 0 0 1-.649.743l-.101.007H7.01l-2.609 6.71L19.322 12 4.401 4.54Z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="m12.815 12.197-7.532 1.255a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.942l18-9a.75.75 0 0 0 0-1.341l-18-9c-.614-.307-1.283.303-1.035.942l2.598 6.958a.5.5 0 0 0 .386.318l7.532 1.255a.2.2 0 0 1 0 .395Z"></path>
              </svg>
            )}
          </button>
        </div>
        <button
          tabIndex={0}
          disabled={isResponding}
          className={`${isRecording ? "recording" : ""} control--mic`}
          onClick={() => handleSpeechRecognition()}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isResponding) handleSearch();
          }}
        >
          <img
            draggable="false"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nO2UTQrCMBCFPxe6cm3xNv4cQfQyrkTBehkRpBfQpVK9ROuyXkAigaeU2grR4MZ+MItMXua1EzLwL7SAFZACCRAq540QMIWwOW+kJQYXnwamImqDJ3WLXtgAB6CpdVLSJptDmiOwxoGzivTePLSl9gZan1wMFjoUAQ2NhVBfXRwVkbQzF4MucNXBeYXGGk+lyYAARybATQW2QB9oK4bATntWM+JDxrk/KYvsm+IPAvU3zhWOlevgGeN7yP3cYK/LrcEbd22kaWbj45q9AAAAAElFTkSuQmCC"
          />
        </button>
        {/* <div
          className={`${text.length >= 100 ? "exceeding" : ""} word__counter`}
        >
          {text === "" ? 0 : text.length}/100
        </div> */}
      </section>
    </div>
  );
}

export default Chatbot;
