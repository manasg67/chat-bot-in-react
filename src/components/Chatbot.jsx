import { useEffect, useRef, useState } from "react";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import "./Chatbot.css";
 import DID_API from './api.json';

import idle from "../assets/idle.mp4";

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
          change(); // Call the change function to close the chatbot module
        }
      };
    
      window.addEventListener("mousedown", handleClickOutside);
    
      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
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
  
  //do not change
let peerConnection;
let streamId;
let sessionId;
let sessionClientAnswer;
let statsIntervalId;
let videoIsPlaying;
let lastBytesReceived;
let agentId="agt_yWfO_ERv";
let chatId="cht_HEZ2ZYhoyQSHwKbJCbuwK";



  const videoElement = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (DID_API.key === '🤫') {
      alert('Please put your API key inside ./api.json and restart.');
    }
  }, []);

  useEffect(() => {
    // Play idle video on component mount
    playIdleVideo();
  
  }, [agentId, chatId]);
  function onIceGatheringStateChange() {
  }
  function onIceCandidate(event) {
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
  
      // WEBRTC API CALL 3 - Submit network information
      console.log("This is streamid",streamId)
      fetch(`${DID_API.url}/${DID_API.service}/streams/${streamId}/ice`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${DID_API.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate,
          sdpMid,
          sdpMLineIndex,
          session_id: sessionId,
        }),
      }).then(res=>{
        console.log(res)

      }).catch(e=>{
        console.log("error occured ",e)
      });
    }
  }
  function onIceConnectionStateChange() {
    if (peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'closed') {

      stopAllStreams();
      closePC();
    }
  }
  function onConnectionStateChange() {
    console.log("Connection state change")

  }
  function onSignalingStateChange() {
    console.log("Signaling state change")

  }
  function onTrack(event) {
    /**
     * The following code is designed to provide information about wether currently there is data
     * that's being streamed - It does so by periodically looking for changes in total stream data size
     *
     * This information in our case is used in order to show idle video while no video is streaming.
     * To create this idle video use the POST https://api.d-id.com/talks (or clips) endpoint with a silent audio file or a text script with only ssml breaks
     * https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html#break-tag
     * for seamless results use `config.fluent: true` and provide the same configuration as the streaming video
     */
  
    if (!event.track) return;
  
    const statsIntervalId = setInterval(async () => {
      let stats = await peerConnection.getStats(event.track);
      stats.forEach((report) => {
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
  
          const videoStatusChanged = videoIsPlaying !== report.bytesReceived > lastBytesReceived;
  
          if (videoStatusChanged) {
            videoIsPlaying = report.bytesReceived > lastBytesReceived;
            onVideoStatusChange(videoIsPlaying, event.streams[0]);
          }
          lastBytesReceived = report.bytesReceived;
        }
      });
    }, 500);
  }
  function setVideoElement(stream) {
    if (!stream) return;
    // Add Animation Class
    videoElement.current.classList.add("animated")
  
    // Removing browsers' autoplay's 'Mute' Requirement
    videoElement.muted = false;
    console.log("Inside streaam")
    videoElement.current.srcObject = stream;
    videoElement.current.loop = false;
  
    // Remove Animation Class after it's completed
    setTimeout(() => {
      videoElement.current.classList.remove("animated")
    }, 1000);
  
    // safari hotfix
    if (videoElement.paused) {
      videoElement
        .play()
        .then((_) => { })
        .catch((e) => { });
    }
    console.log(peerConnection)
  }
  function onVideoStatusChange(videoIsPlaying, stream) {
    let status;
    if (videoIsPlaying) {
      status = 'streaming';
  
      const remoteStream = stream;
      setVideoElement(remoteStream);
    } else {
      status = 'empty';
      playIdleVideo();
    }
    // streamingStatusLabel.innerText = status;
    // streamingStatusLabel.className = 'streamingState-' + status;
  }
 
  function closePC(pc = peerConnection) {
    if (!pc) return;
    console.log('stopping peer connection');
    pc.close();
    pc.removeEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
    pc.removeEventListener('icecandidate', onIceCandidate, true);
    pc.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
    pc.removeEventListener('connectionstatechange', onConnectionStateChange, true);
    pc.removeEventListener('signalingstatechange', onSignalingStateChange, true);
    pc.removeEventListener('track', onTrack, true);
    clearInterval(statsIntervalId);
    // iceGatheringStatusLabel.innerText = '';
    // signalingStatusLabel.innerText = '';
    // iceStatusLabel.innerText = '';
    // peerStatusLabel.innerText = '';
    console.log('stopped peer connection');
    if (pc === peerConnection) {
      peerConnection = null;
    }
  }

  const playIdleVideo = () => {
    videoElement.current.classList.toggle("animated");
    videoElement.current.srcObject = undefined;
    videoElement.current.src = idle;
    videoElement.current.loop = true;

    setTimeout(() => {
      videoElement.current.classList.remove("animated");
    }, 1000);
  };


  function stopAllStreams() {
    if (videoElement.srcObject) {
      console.log('stopping video streams');
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }
  async function fetchWithRetries(url, options, retries = 1) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (retries <= maxRetryCount) {
        const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) * 1000;
  
        await new Promise((resolve) => setTimeout(resolve, delay));
  
        console.log(`Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`);
        return fetchWithRetries(url, options, retries + 1);
      } else {
        throw new Error(`Max retries exceeded. error: ${err}`);
      }
    }
  }
  async function createPeerConnection(offer, iceServers) {
    if (!peerConnection) {
      peerConnection = new RTCPeerConnection({ iceServers });
      peerConnection.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
      peerConnection.addEventListener('icecandidate', onIceCandidate, true);
      peerConnection.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
      peerConnection.addEventListener('connectionstatechange', onConnectionStateChange, true);
      peerConnection.addEventListener('signalingstatechange', onSignalingStateChange, true);
      peerConnection.addEventListener('track', onTrack, true);
      console.log(peerConnection, " this is peer")
    }
  
    await peerConnection.setRemoteDescription(offer);
    console.log('set remote sdp OK');
  
     sessionClientAnswer = await peerConnection.createAnswer();
    console.log('create local sdp OK');
  
    await peerConnection.setLocalDescription(sessionClientAnswer);
    console.log('set local sdp OK');
  
  
    // Data Channel creation (for dispalying the Agent's responses as text)
    let dc = await peerConnection.createDataChannel("JanusDataChannel");
    console.log("datachannel peer", peerConnection)
    dc.onopen = () => {
      console.log("datachannel open");
    };
    console.log("datachannel ",dc)
  
    let decodedMsg;
    // Agent Text Responses - Decoding the responses, pasting to the HTML element
    dc.onmessage = (event) => {
      let msg = event.data
      let msgType = "chat/answer:"
      if (msg.includes(msgType)) {
        msg = decodeURIComponent(msg.replace(msgType, ""))
        console.log(msg)
        decodedMsg = msg
        return decodedMsg
      }
      if (msg.includes("stream/started")) {
        console.log(msg)
        // document.getElementById("msgHistory").innerHTML += `<span>${decodedMsg}</span><br><br>`
      }
      else {
        console.log(msg, peerConnection)
      }
    };
  
    dc.onclose = () => {
      console.log("datachannel close");
    };
   
    return sessionClientAnswer;
  }

  const connectButtononclick = async () => {
    if (agentId == "" || agentId === undefined) {
      return alert("1. Click on the 'Create new Agent with Knowledge' button\n2. Open the Console and wait for the process to complete\n3. Press on the 'Connect' button\n4. Type and send a message to the chat\nNOTE: You can store the created 'agentID' and 'chatId' variables at the bottom of the JS file for future chats")
    }
  
    if (peerConnection && peerConnection.connectionState === 'connected') {
      return;
    }
    stopAllStreams();
    closePC();
    // WEBRTC API CALL 1 - Create a new stream
    const sessionResponse = await fetchWithRetries(`${DID_API.url}/${DID_API.service}/streams`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Emma_f/v1_image.jpeg'
      }),
    });
  
  
    const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json();
  
    streamId = newStreamId;
    sessionId = newSessionId;
    // const format = await sessionResponse.json()
    // console.log(format)
  
  
    // const format= await sessionResponse.json();
    // setStreamId(newStreamId)

    // console.log("here is format",format)
    // setStreamId(format?.id)
    // setSessionId(format?.session_id)

    
    // sessionId = newSessionId;
    try {
      let temp = await createPeerConnection(offer, iceServers);
      console.log(" peer final", peerConnection)
      console.log("Here is temp ",temp)
    } catch (e) {
      console.log('error during streaming setup', e);
      stopAllStreams();
      closePC();
      return;
    }
  
    // WEBRTC API CALL 2 - Start a stream
    const sdpResponse = await fetch(`${DID_API.url}/${DID_API.service}/streams/${streamId}/sdp`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API.key}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        answer: sessionClientAnswer,
        session_id: sessionId,
      }),

    }).then(res=>{
      console.log(sessionClientAnswer, " final sessionClient ans")
      console.log(res.json(), " final res")

    }).catch(e=>{
      console.log("error occured ",e)
    });
   
  };

  const startButtononclick = async () => {
    // connectionState not supported in firefox
    console.log(peerConnection)
    if (peerConnection?.signalingState === 'stable' || peerConnection?.iceConnectionState === 'connected') {
      
      // Pasting the user's message to the Chat History element
      // document.getElementById("msgHistory").innerHTML += `<span style='opacity:0.5'><u>User:</u> ${textArea.value}</span><br>`
  
      // Storing the Text Area value
      // let txtAreaValue = document.getElementById("textArea").value
  
      // Clearing the text-box element
      // document.getElementById("textArea").value = ""
  
  
      // Agents Overview - Step 3: Send a Message to a Chat session - Send a message to a Chat
      const playResponse = await fetchWithRetries(`${DID_API.url}/agents/agt_yWfO_ERv/chat/cht_HEZ2ZYhoyQSHwKbJCbuwK`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${DID_API.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "streamId": streamId,
          "sessionId": sessionId,
          "messages": [
            {
              "role": "user",
              "content": "What is fullform of RAG",
              "created_at": new Date().toString()
            }
          ]
        }),
      });
    }
  };
  //dont change



  return (
    <div ref={chatbotRef}
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
      <section className="chatbot"
    style={{
      position: "absolute",
      zIndex: 200,
      width: "100%",
      top: "0%",
      left: "50%",
      transform: "translate(-50%, 0)",
            }}>
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
              ref={videoElement}
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
        <h1 className="chatbot__title">Ask Buddy</h1>
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
            maxHeight: "60%",
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

          <div className="chat__main">
            <div className="input__container">
              <input
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
                disabled={isResponding || text.length === 0}
                className="control--send"
                onClick={() => handleSearch()}
              >
                {text.length === 0 ? (
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isResponding) handleSearch();
              }}

            >
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nO2UTQrCMBCFPxe6cm3xNv4cQfQyrkTBehkRpBfQpVK9ROuyXkAigaeU2grR4MZ+MItMXua1EzLwL7SAFZACCRAq540QMIWwOW+kJQYXnwamImqDJ3WLXtgAB6CpdVLSJptDmiOwxoGzivTePLSl9gZan1wMFjoUAQ2NhVBfXRwVkbQzF4MucNXBeYXGGk+lyYAARybATQW2QB9oK4bATntWM+JDxrk/KYvsm+IPAvU3zhWOlevgGeN7yP3cYK/LrcEbd22kaWbj45q9AAAAAElFTkSuQmCC" />
            </button>
          </div>
        </section>
      </div>
  );
}

export default Chatbot;
