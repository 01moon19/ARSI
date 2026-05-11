// 

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  createSession,
  getSessions,
  getTranscript,
  queryChat,
} from "../services/ChatService";

function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-scroll ref for the chat area
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const handleCreateSession = async () => {
    if (!newChatTitle.trim()) return;
    try {
      const session = await createSession(newChatTitle);
      setNewChatTitle("");
      await fetchSessions();
      openSession(session.session_id);
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };

  const openSession = async (sessionId) => {
    try {
      const data = await getTranscript(sessionId);
      setSelectedSession(sessionId);
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to open session", error);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim() || !selectedSession) return;
    try {
      setLoading(true);
      const userMessage = {
        role: "user",
        content: question,
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentQuestion = question;
      setQuestion("");

      await queryChat(selectedSession, currentQuestion);
      const updatedTranscript = await getTranscript(selectedSession);
      setMessages(updatedTranscript.messages);
    } catch (error) {
      console.error("Chat query failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-200 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex h-[85vh] font-sans">
      
      {/* CHAT SIDEBAR */}
      <div className="w-[320px] border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col backdrop-blur-md relative z-10">
        
        <h1 className="text-3xl font-extrabold mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            SIP
          </span> Chats
        </h1>

        {/* CREATE CHAT */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="New chat title..."
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all placeholder:text-slate-600"
          />
          <button
            onClick={handleCreateSession}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
          >
            Create Chat
          </button>
        </div>

        {/* SESSION LIST */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {sessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => openSession(session.session_id)}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                selectedSession === session.session_id
                  ? "bg-gradient-to-r from-slate-800 to-slate-800/50 border-teal-500/50 text-teal-300 shadow-inner"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800 text-slate-400"
              }`}
            >
              <p className="font-medium truncate">
                {session.title || "New Chat"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Subtle grid background mirroring the About page */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* HEADER */}
        <div className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md px-8 py-5 relative z-10">
          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-3">
            {selectedSession ? (
              <>
                <div className="h-2 w-2 bg-teal-400 rounded-full animate-pulse" />
                Active Session
              </>
            ) : (
              <span className="text-slate-500">Select or create a chat to begin</span>
            )}
          </h2>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                key={index}
                className={`max-w-[75%] p-5 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white ml-auto border border-blue-500/30 shadow-lg shadow-blue-900/20 rounded-tr-sm"
                    : "bg-slate-800/80 border border-slate-700 text-slate-200 backdrop-blur-sm rounded-tl-sm shadow-md"
                }`}
              >
                <p className={`text-xs font-bold tracking-wider mb-2 uppercase ${msg.role === 'user' ? 'text-blue-200' : 'text-teal-400'}`}>
                  {msg.role === "user" ? "You" : "SIP Agent"}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl rounded-tl-sm max-w-[75%] flex items-center gap-3 w-fit"
            >
              <div className="flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-teal-400 rounded-full" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Processing query...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        {selectedSession && (
          <div className="border-t border-slate-800 p-6 bg-slate-900/80 backdrop-blur-lg relative z-10">
            <div className="flex gap-4 max-w-4xl mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask SIP to research an account, draft an email, or query your data..."
                className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all placeholder:text-slate-500 shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendQuestion();
                  }
                }}
              />
              <button
                onClick={sendQuestion}
                disabled={loading || !question.trim()}
                className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold px-8 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:active:scale-100 disabled:shadow-none"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Adding a small inline style block for the custom scrollbar since standard Tailwind doesn't include scrollbar styling by default */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #475569;
        }
      `}} />
    </div>
  );
}

export default ChatPage;