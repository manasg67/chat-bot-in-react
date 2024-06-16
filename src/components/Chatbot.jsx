import { useEffect, useRef, useState } from "react";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import "./Chatbot.css"; 

import idle from "../assets/idle.mp4";

function Chatbot({ onClose }) {
  const searchBox = useRef(null);
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

const handleClose = () => {
  console.log("Closing modal");
  onClose(); // Call onClose function passed from parent (App)
};


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
        if (prev[prev.length - 1].message === "...") prev.pop();
        return [...prev, res];
      });
      setIsResponding(false);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const fetchResponse = () => {
    return new Promise((resolve, reject) => {
      const success = true;
      const delay = 1000;

      setTimeout(() => {
        if (success) {
          resolve({
            from: "bot",
            message: "Hello! Welcome to OHA. How can I help you today ?",
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
    console.log(SpeechRecognition);
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
      setText((prev) => [...prev, speechToText]);
      setIsRecording(false);
    };
    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);
    };
  };

 

  return (
    <div
    className="cb__main"
    style={{
      height: "55%",
      width: "29%",
      left: "85%",
      top:'40%',
      borderRadius: "1vw",
      position: "relative",
      backgroundColor: "white",
      transform: "translate(-50%, 0)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#ddd",
    }}
  >
    <button
      className="control--close"
      onClick={handleClose}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "transparent",
        border: "none",
        fontSize: "1.5rem",
        cursor: "pointer",
      }}
      >
        x
      </button>
      <section
        className="chatbot"
        style={{
          position: "absolute",
          zIndex: 200,
          width: "100%",
          top: "0%",
          left: "50%",
          transform: "translate(-50%, 0)",
          height: "44%"
                }}
      >
        <div
          className="chatbot__container"
          style={{
            position: "relative",
            margin: "auto",
            display: "grid",
            placeContent: "center",
            height: "16rem",
            aspectRatio: "1",
            borderRadius: "100vw",
          }}
        >
          <video
            className="chatbot--video"
            muted
            src={idle}
            autoPlay={true}
            loop={false}
            style={{
              opacity: 1,
              position: "relative",
              display: "block",
              height: "10rem",
              aspectRatio: "1",
              maxWidth: "100%",
              borderRadius: "inherit",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              objectFit: "cover",
              zIndex: 1000,
            }}
          />
          <h2 style={{ position: "relative", left: "13%",color:'#ff7d08' }}>Ask Buddy</h2>
        </div>
      </section>
      <section
        className="chatbox"
        style={{
          position: "absolute",
          bottom: "3%",
          left: "50%",
          transform: "translate(-50%, 0)",
          zIndex: 1,
          maxHeight: "50%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          justifyContent: "flex-end",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <div
          className="chat__window"
          style={{
            width: "97%",
            marginInline: "auto",
            overflowY: "scroll",
          }}
        >
          {chats.map((chat, index) => {
            if (chat.from === "user") {
              return (
                <div key={index} className="message" style={{ textAlign: "right" }}>
                  <span
                    className="user-message"
                    style={{
                      backgroundColor: "#f1f3f4",
                      color: "#222",
                      fontSize: "1.125rem",
                      borderRadius: "16px 4px 16px 16px",
                      padding: "0.6em 0.8em",
                      height: "max-content",
                      display: "inline-block",
                      maxWidth: "80%",
                    }}
                  >
                    {chat.message}
                  </span>
                </div>
              );
            } else if (chat.from === "bot") {
              return (
                <div key={index} className="message" style={{ textAlign: "left" }}>
                  <span
                    className="bot-message"
                    style={{
                      backgroundColor: "#ffe8d6",
                      color: "#222",
                      fontSize: "1.125rem",
                      borderRadius: "1em 1em 1em 0.22em",
                      padding: "0.6em 0.8em",
                      height: "max-content",
                      display: "inline-block",
                      maxWidth: "50%",
                    }}
                  >
                    {chat.message}
                  </span>
                </div>
              );
            }
          })}
          <div ref={messagesEndRef} aria-hidden={true} />
        </div>

        <div
          className="chat__main" 
         >
          <div
            className="input__container"
           >
            <textarea
              ref={searchBox}
              placeholder={isRecording ? "Listening..." : "Ask me anything..."}
              className="searchbox"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              value={text}
              maxLength={100}
              rows={1}
              
            ></textarea>
            <button
              disabled={isResponding || text.length == 0}
              className="control--send"
              onClick={() => handleSearch()}
         
            >
              {text.length == 0 ? (
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
            disabled={isResponding}
            className={`${isRecording ? "recording" : ""} control--mic`}
            onClick={() => handleSpeechRecognition()}
          >
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nO2UTQrCMBCFPxe6cm3xNv4cQfQyrkTBehkRpBfQpVK9ROuyXkAigaeU2grR4MZ+MItMXua1EzLwL7SAFZACCRAq540QMIWwOW+kJQYXnwamImqDJ3WLXtgAB6CpdVLSJptDmiOwxoGzivTePLSl9gZan1wMFjoUAQ2NhVBfXRwVkbQzF4MucNXBeYXGGk+lyYAARybATQW2QB9oK4bATntWM+JDxrk/KYvsm+IPAvU3zhWOlevgGeN7yP3cYK/LrcEbd22kaWbj45q9AAAAAElFTkSuQmCC" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Chatbot;
