import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
    const [userInput, setUserInput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return true;
    });

  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordInterval = useRef(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

    useEffect(() => {
        textAreaRef.current.focus();
    }, [messages]);

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, [messages]);

    const handleInput = () => {
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
            el.scrollTop = el.scrollHeight;
        }
    };

    useEffect(() => {
        handleInput();

        window.addEventListener("resize", handleInput);
        return () => {
            window.removeEventListener("resize", handleInput);
        };
    }, []);

    const handleError = () => {
        setMessages((prevMessages) => [...prevMessages, {
            "message": "Oops! There seems to be an error. Please try again.",
            "type": "apiMessage"
        }]);
        setLoading(false);
        setUserInput("");
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.rows = 1;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userInput.trim() === "") {
            return;
        }

        setLoading(true);
        setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: userInput, history: history }),
        });

    if (!response.ok) {
      handleError();
      return;
    }

        setUserInput("");
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.rows = 1;
        }

        const data = await response.json();

        if (data.result.error === "Unauthorized") {
            handleError();
            return;
        }

    setMessages((prevMessages) => [...prevMessages, { "message": data.result.success, "type": "apiMessage" }]);
    setLoading(false);
  };

    const handleEnter = (e) => {
        if (e.key === "Enter" && userInput) {
            if (!e.shiftKey && userInput) {
                handleSubmit(e);
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
        }
    };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
    }
  }, [messages]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
      clearInterval(recordInterval.current);
    };
  }, []);

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      clearInterval(recordInterval.current);
      setIsRecording(false);
      setRecordTime(0);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        
        // Add the audio message to the conversation
        setMessages(prev => [...prev, {
          "message": audioUrl,
          "type": "userMessage",
          "isAudio": true
        }]);
        
        // Clean up the stream
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      });

      // Start timer
      setIsRecording(true);
      setRecordTime(0);
      recordInterval.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);

        } catch (error) {
            console.error("Microphone access error:", error);
            setIsRecording(false);
            setMessages(prev => [...prev, {
              "message": "Failed to access microphone. Please check permissions.",
              "type": "apiMessage"
            }]);
        }
    };
    return (
    <>
      <Head>
        <title>FiiHelp</title>
      </Head>
      <div className={isDarkMode ? styles.dark : styles.light}>
        <div className={styles.topnav}>
            <div className={styles.navlogo}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Image src="/logo.png" alt="UAIC Logo" width={48} height={48} />
                    <span>FiiHelp</span>
                </a>
            </div>
          <div className = {styles.navlinks}>
            <label className={styles["theme-toggle"]}>
                              <input
                                  type="checkbox"
                                  checked={!isDarkMode}
                                  onChange={() => {
                                      setIsDarkMode((prev) => {
                                          const newTheme = !prev;
                                          localStorage.setItem("theme", newTheme ? "dark" : "light");
                                          return newTheme;
                                      });
                                  }}
                              />
                              <span className={styles.slider}>
        <span className={`${styles.icon} ${styles.sun}`}>☀️</span>
        <span className={`${styles.icon} ${styles.moon}`}>🌙</span>
      </span>
                          </label>
          </div>
        </div>
        <main className={styles.main}>
          <div className = {styles.cloud}>
            <div ref={messageListRef} className = {styles.messagelist}>
              {messages.map((message, index) => (
            // The latest message sent by the user will be animated while waiting for a response
            <div
            key={index}
            className={message.type === "apiMessage" ? styles.botText : styles.userBubble}>
              <div className = {styles.markdownanswer}>
                {message.isAudio ? (
                        <audio controls src={message.message} className='styles.audioPlayer' />
                      ) : (
                  <ReactMarkdown linkTarget = {"_blank"}>{message.message}</ReactMarkdown>
                )}
                </div>
              </div>
          ))}
        </div>
            </div>
           <div className={styles.center}>

               <div className={styles.cloudform}>
                   <form onSubmit={handleSubmit} className={styles.inputArea}>
                       <div className={styles.inputWrap}>
    <textarea
        disabled={loading}
        onKeyDown={handleEnter}
        ref={textAreaRef}
        rows={1}
        onInput={handleInput}
        type="text"
        id="userInput"
        name="userInput"
        placeholder={loading ? "Waiting for response..." : "Type your question..."}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className={styles.textarea}
    />

                           <button
                               type="button"
                               disabled={loading}
                               onClick={handleRecord}
                               className={styles.recordButton}
                           >
                               {isRecording ? "⏹ Stop" : "🎤 Record"}
                           </button>


                           <button
                               type="submit"
                               disabled={loading}
                               className={styles.generatebutton}
                           >
                               {loading ? (
                                   <div className={styles.loadingwheel}>
                                       <CircularProgress color="inherit" size={20}/>
                                   </div>
                               ) : (
                                   <svg viewBox="0 0 20 20" className={styles.svgicon}
                                        xmlns="http://www.w3.org/2000/svg">
                                       <path
                                           d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                   </svg>
                               )}
                           </button>
                       </div>
                   </form>
                   {isRecording && (
                      <div className={styles.recordingIndicator}>
                    <div className={styles.recordingDot}></div>
                           ⏱️ Recording: {recordTime}s
                       </div>
                   )}
               </div>
           </div>
      </main>
      </div>
    </>
    );
}