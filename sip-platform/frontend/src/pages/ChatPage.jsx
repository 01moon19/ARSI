import { useEffect, useState, useRef } from "react";

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

  // Helper to get the title of the active session for the header
  const getActiveSessionTitle = () => {
    const session = sessions.find(s => s.session_id === selectedSession);
    return session ? session.title : "Unknown Topic";
  };

  return (
    <div className="bg-[#FFFFFF] text-[#172B4D] rounded shadow-sm border border-[#DFE1E6] overflow-hidden flex h-[85vh] font-sans antialiased text-sm">
      
      {/* SIDEBAR */}
      <div className="w-[300px] flex-shrink-0 border-r border-[#DFE1E6] bg-[#FAFBFC] flex flex-col z-10">
        
        {/* Sidebar Header */}
        <div className="h-14 border-b border-[#DFE1E6] flex items-center px-4 shrink-0 bg-[#FFFFFF]">
          <div className="flex items-center gap-2 text-[#172B4D] font-semibold text-base">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0052CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            SIP Console
          </div>
        </div>

        {/* CREATE CHAT (Workspace Actions) */}
        <div className="p-4 border-b border-[#DFE1E6] shrink-0 bg-[#FFFFFF]">
          <div className="font-medium text-xs text-[#5E6C84] uppercase tracking-wider mb-2">Workspace</div>
          <input
            type="text"
            placeholder="New research topic..."
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateSession()}
            className="w-full border border-[#DFE1E6] rounded shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors mb-2 placeholder-[#A5ADBA]"
          />
          <button
            onClick={handleCreateSession}
            className="w-full bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#172B4D] border border-[#DFE1E6] rounded py-1.5 text-sm font-medium transition-colors flex items-center justify-center gap-1 active:bg-[#DFE1E6]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Issue / Chat
          </button>
        </div>

        {/* SESSION LIST */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {sessions.map((session) => {
            const isSelected = selectedSession === session.session_id;
            return (
              <div
                key={session.session_id}
                onClick={() => openSession(session.session_id)}
                className={`mx-2 px-3 py-2 cursor-pointer rounded text-sm mb-0.5 flex items-center gap-2 group transition-colors ${
                  isSelected
                    ? "bg-[#E6EFFC] text-[#0052CC] font-medium border-l-2 border-[#0052CC]"
                    : "text-[#172B4D] hover:bg-[#F4F5F7] border-l-2 border-transparent"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${isSelected ? 'text-[#0052CC]' : 'text-[#5E6C84]'} shrink-0`}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="truncate">
                  {session.title || "New Task"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col h-full relative bg-[#FFFFFF]">
        
        {/* HEADER */}
        <div className="h-14 border-b border-[#DFE1E6] flex items-center px-6 shrink-0 bg-[#FFFFFF]">
          <div className="text-[#172B4D] font-medium text-lg flex items-center gap-2">
            {selectedSession ? (
              <>
                <span className="text-[#5E6C84] font-normal text-base mr-1">Topic /</span>
                {getActiveSessionTitle()}
                <div className="ml-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E6EFFC] text-[#0052CC]">
                  IN PROGRESS
                </div>
              </>
            ) : (
              <span className="text-[#5E6C84] text-base">Select a workspace item to begin</span>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Empty State */}
          {!selectedSession && (
             <div className="h-full flex flex-col items-center justify-center text-[#5E6C84]">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
               <p className="text-lg font-medium text-[#172B4D]">No active query</p>
               <p className="mt-1">Select a chat from the sidebar or create a new one.</p>
             </div>
          )}

          {/* Comment Thread (Replacing Bubbles) */}
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div key={index} className="flex gap-4">
                {/* Avatar */}
                <div className={`${isUser ? 'bg-[#5E6C84]' : 'bg-[#0052CC]'} text-white shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm mt-0.5`}>
                  {isUser ? 'US' : 'SIP'}
                </div>
                
                {/* Content Block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-[#172B4D] hover:underline cursor-pointer">
                      {isUser ? 'Current User' : 'SIP Intelligence Agent'}
                    </span>
                    {!isUser && (
                      <span className="ml-2 bg-[#E6EFFC] text-[#0052CC] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                        System
                      </span>
                    )}
                  </div>
                  
                  {/* The actual text */}
                  <div className={`text-[#172B4D] leading-relaxed bg-[#FFFFFF] border ${isUser ? 'border-transparent' : 'border-[#DFE1E6] shadow-sm rounded p-3 mt-1'}`}>
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-[#5E6C84] text-sm py-2">
              <svg className="animate-spin h-4 w-4 text-[#0052CC]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              SIP Agent is gathering intelligence...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        {selectedSession && (
          <div className="p-4 bg-[#FAFBFC] border-t border-[#DFE1E6] shrink-0">
            <div className="max-w-4xl flex gap-3 items-end bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm focus-within:border-[#0052CC] focus-within:ring-1 focus-within:ring-[#0052CC] transition-colors p-1 pr-2 mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Add a comment or ask a question..."
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none min-h-[40px] disabled:bg-[#FAFBFC] disabled:cursor-not-allowed text-[#172B4D] placeholder-[#A5ADBA]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendQuestion();
                  }
                }}
              />
              <button
                onClick={sendQuestion}
                disabled={loading || !question.trim()}
                className="bg-[#0052CC] text-white p-2 mb-1 rounded hover:bg-[#0065FF] active:bg-[#0747A6] disabled:bg-[#DFE1E6] disabled:text-[#A5ADBA] disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <p className="text-center text-xs text-[#5E6C84] mt-2">Press <strong>Enter</strong> to submit.</p>
          </div>
        )}

      </div>

      {/* Embedded CSS for Enterprise Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #DFE1E6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #C1C7D0;
        }
      `}} />
    </div>
  );
}

export default ChatPage;