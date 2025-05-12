import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';

const KEYWORD_URLS = [
  { phrase: "Orar", url: "https://edu.info.uaic.ro/orar/" },
  { phrase: "Webmail", url: "https://webmail.info.uaic.ro/" },
  { phrase: "Edu Resources", url: "https://edu.info.uaic.ro/" },
  { phrase: "Noutati", url: "https://www.info.uaic.ro/noutati/" },
  { phrase: "Contact", url: "https://www.info.uaic.ro/contact/" },
  { phrase: "Admitere", url: "https://www.info.uaic.ro/admitere/" },
  { phrase: "Burse", url: "https://www.uaic.ro/studenti/burse/" },
  { phrase: "Cazare", url: "https://www.uaic.ro/studenti/cazare/" },
  { phrase: "Cantine", url: "https://www.uaic.ro/studenti/cantinele-universitatii-alexandru-ioan-cuza/" },
  { phrase: "Taxe", url: "https://plati-taxe.uaic.ro/" },
  { phrase: "Facilitati", url: "https://www.info.uaic.ro/facilitati/" },
  { phrase: "Admitere studii de licenta", url: "https://www.info.uaic.ro/admitere-studii-de-licenta/" },
  { phrase: "Admitere studii de master", url: "https://www.info.uaic.ro/admitere-studii-de-master/" },
  { phrase: "Programe de studii de licenta", url: "https://www.info.uaic.ro/programs/informatica-ro-en/" },
  { phrase: "Programe de studii de master", url: "https://www.info.uaic.ro/studii-de-master/" },
  { phrase: "Scoala doctorala", url: "https://scdoc.info.uaic.ro/" },
  { phrase: "Personal Academic", url: "https://www.info.uaic.ro/personal-academic/" },
  { phrase: "Personal Asociat", url: "https://www.info.uaic.ro/personal-asociat/" },
  { phrase: "Conducere", url: "https://www.info.uaic.ro/conducere/" },
  { phrase: "Personal tehnic si administrativ", url: "https://www.info.uaic.ro/personal-tehnic-administrativ/" },
  { phrase: "Emeriti", url: "https://www.info.uaic.ro/emeriti/" },
  { phrase: "Cercetare la Fii", url: "https://www.info.uaic.ro/cercetare/" },
  { phrase: "Activitatea de cercetare a studenţilor Facultăţii de Informatică", url: "https://www.info.uaic.ro/activitate-cercetare-studenti/" },
  { phrase: "Ghidul studentului uaic", url: "https://www.uaic.ro/studenti/ghidul-studentului-uaic/" },
  { phrase: "Documente si formulare pentru studenti", url: "https://www.info.uaic.ro/documente-formulare-studenti/" },
  { phrase: "Regulamente", url: "https://www.info.uaic.ro/regulamente/" },
  { phrase: "Practica anul 3", url: "https://www.info.uaic.ro/practica-anul-iii/" },
  { phrase: "Absolvire", url: "https://absolvire.info.uaic.ro/" },
  { phrase: "Serviciul pentru Studenți, Orientare în Carieră și Inserție Profesională și Alumni", url: "https://www.uaic.ro/studenti/cariera/" },
  { phrase: "Reprezentarea studenţilor în structurile administrative și de conducere", url: "https://www.uaic.ro/studenti/reprezentarea-studentilor-structurile-de-conducere-2/" }
];


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

    const processKeywords = (text) => {
        const sortedKeywords = [...KEYWORD_URLS].sort((a, b) => b.phrase.length - a.phrase.length);
        
        let processedText = text;
        
        sortedKeywords.forEach(({ phrase, url }) => {
          const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
          processedText = processedText.replace(
            regex,
            `[${phrase}](${url})`
          );
        });
        
        return processedText;
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

    useEffect(() => {
        if (messages.length >= 3) {
            setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
        }
    }, [messages])

    let mediaRecorderRef = useRef(null);
    let recordInterval = useRef(null);

    const handleRecord = async () => {
        if (isRecording) {
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
                console.log("Audio recording complete:", audioBlob);
            });

            setIsRecording(true);
            setRecordTime(0);
            recordInterval.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Microphone access error:", error);
            setIsRecording(false);
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
                        <a href="/">FiiHelp</a>
                    </div>
                    <div className={styles.navlinks}>
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
                    <div className={styles.cloud}>
                        <div ref={messageListRef} className={styles.messagelist}>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.type === "apiMessage"
                                            ? styles.botText
                                            : styles.userBubble
                                    }
                                >
                                <div className={styles.markdownanswer}>
                                      <ReactMarkdown
                                          linkTarget="_blank"
                                          components={{
                                              a: ({node, ...props}) => (
                                                  <a {...props} style={{
                                                      color: '#0066cc',
                                                      textDecoration: 'underline'
                                                  }} />
                                              )
                                          }}
                                      >
                                          {processKeywords(message.message)}
                                      </ReactMarkdown>
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
                                        placeholder={
                                            loading ? "Waiting for response..." : "Type your question..."
                                        }
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
                                                <CircularProgress color="inherit" size={20} />
                                            </div>
                                        ) : (
                                            <svg
                                                viewBox="0 0 20 20"
                                                className={styles.svgicon}
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {isRecording && (
                                <div style={{
                                    marginTop: "8px",
                                    color: "#ef4444",
                                    fontWeight: "500",
                                    textAlign: "right",
                                }}>
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
