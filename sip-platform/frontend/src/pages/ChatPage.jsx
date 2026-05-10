import {
  useEffect,
  useState,
} from "react";

import {
  createSession,
  getSessions,
  getTranscript,
  queryChat,
} from "../services/ChatService";

function ChatPage() {

  const [sessions, setSessions] =
    useState([]);

  const [selectedSession, setSelectedSession] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [question, setQuestion] =
    useState("");

  const [newChatTitle, setNewChatTitle] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    fetchSessions();

  }, []);

  const fetchSessions =
    async () => {

      try {

        const data =
          await getSessions();

        setSessions(data);

      } catch (error) {

        console.error(
          "Failed to fetch sessions",
          error
        );
      }
    };

  const handleCreateSession =
    async () => {

      if (
        !newChatTitle.trim()
      ) return;

      try {

        const session =
          await createSession(
            newChatTitle
          );

        setNewChatTitle("");

        await fetchSessions();

        openSession(
          session.session_id
        );

      } catch (error) {

        console.error(
          "Failed to create session",
          error
        );
      }
    };

  const openSession =
    async (sessionId) => {

      try {

        const data =
          await getTranscript(
            sessionId
          );

        setSelectedSession(
          sessionId
        );

        setMessages(
          data.messages
        );

      } catch (error) {

        console.error(
          "Failed to open session",
          error
        );
      }
    };

  const sendQuestion =
    async () => {

      if (
        !question.trim() ||
        !selectedSession
      ) return;

      try {

        setLoading(true);

        const userMessage = {
          role: "user",
          content: question,
        };

        setMessages((prev) => [
          ...prev,
          userMessage,
        ]);

        const currentQuestion =
          question;

        setQuestion("");

        await queryChat(
          selectedSession,
          currentQuestion
        );

        const updatedTranscript =
          await getTranscript(
            selectedSession
          );

        setMessages(
          updatedTranscript.messages
        );

      } catch (error) {

        console.error(
          "Chat query failed",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex h-[85vh]">

      {/* CHAT SIDEBAR */}

      <div className="w-[320px] border-r p-6 flex flex-col">

        <h1 className="text-3xl font-bold mb-6">
          SIP Chats
        </h1>

        {/* CREATE CHAT */}

        <div className="mb-6 space-y-3">

          <input
            type="text"
            placeholder="New chat title"
            value={newChatTitle}
            onChange={(e) =>
              setNewChatTitle(
                e.target.value
              )
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            onClick={
              handleCreateSession
            }
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Create Chat
          </button>

        </div>

        {/* SESSION LIST */}

        <div className="flex-1 overflow-y-auto space-y-3">

          {sessions.map((session) => (

            <div
              key={session.session_id}
              onClick={() =>
                openSession(
                  session.session_id
                )
              }
              className={`p-4 rounded-xl cursor-pointer border transition ${
                selectedSession ===
                session.session_id
                  ? "bg-black text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >

              <p className="font-medium">

                {session.title ||
                  "New Chat"}

              </p>

            </div>

          ))}

        </div>

      </div>

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="border-b px-8 py-5">

          <h2 className="text-2xl font-semibold">

            {selectedSession
              ? "Conversation"
              : "Select or create a chat"}

          </h2>

        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50">

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className={`max-w-[75%] p-5 rounded-2xl ${
                  msg.role ===
                  "user"
                    ? "bg-blue-100 ml-auto"
                    : "bg-white border"
                }`}
              >

                <p className="text-sm font-semibold mb-2 capitalize">

                  {msg.role}

                </p>

                <p className="whitespace-pre-wrap">

                  {msg.content}

                </p>

              </div>
            )
          )}

          {loading && (

            <div className="bg-white border p-5 rounded-2xl max-w-[75%]">

              Thinking...

            </div>

          )}

        </div>

        {/* INPUT */}

        {selectedSession && (

          <div className="border-t p-6 flex gap-4 bg-white">

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="Ask something..."
              className="flex-1 border rounded-xl px-5 py-4"
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendQuestion();
                }
              }}
            />

            <button
              onClick={
                sendQuestion
              }
              className="bg-black text-white px-8 rounded-xl"
            >
              Send
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ChatPage;