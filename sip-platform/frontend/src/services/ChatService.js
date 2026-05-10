import api from "../api/axios";

export const createSession =
  async (title) => {

    const response =
      await api.post(
        "/chat/sessions",
        {
          title,
        }
      );

    return response.data;
  };

export const getSessions =
  async () => {

    const response =
      await api.get(
        "/chat/sessions"
      );

    return response.data;
  };

export const queryChat =
  async (
    sessionId,
    question
  ) => {

    const response =
      await api.post(
        "/chat/query",
        {
          session_id:
            sessionId,
          question,
        }
      );

    return response.data;
  };

export const getTranscript =
  async (
    sessionId
  ) => {

    const response =
      await api.get(
        `/chat/sessions/${sessionId}`
      );

    return response.data;
  };