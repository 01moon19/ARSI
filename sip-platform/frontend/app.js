const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

const backendUrl = "http://127.0.0.1:8000";

async function askQuestion() {
  const question = questionInput.value.trim();
  if (!question) {
    statusEl.textContent = "Please type a question first.";
    return;
  }

  statusEl.textContent = "Asking backend...";
  resultEl.textContent = "";
  askBtn.disabled = true;

  try {
    const params = new URLSearchParams({ query: question });
    const response = await fetch(`${backendUrl}/ask?${params.toString()}`);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (typeof data === "string") {
      resultEl.textContent = data;
    } else {
      resultEl.textContent = JSON.stringify(data, null, 2);
    }

    statusEl.textContent = "Answer received.";
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
    console.error(err);
  } finally {
    askBtn.disabled = false;
  }
}

askBtn.addEventListener("click", askQuestion);
questionInput.addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); askQuestion(); }});
