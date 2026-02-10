const API_KEY = "YOUR_OPENAI_API_KEY";

const textarea = document.getElementById("bookText");
const charCount = document.getElementById("charCount");
const output = document.getElementById("output");
const loading = document.getElementById("loading");

textarea.addEventListener("input", () => {
  charCount.textContent = `${textarea.value.length} characters`;
});

function splitText(text, size = 2000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

async function summarizeChunk(text, type) {
  const promptMap = {
    short: "Give a short summary",
    detailed: "Give a detailed summary",
    bullets: "Summarize in bullet points"
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `${promptMap[type]} of the following text:\n\n${text}`
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function summarizeBook() {
  const text = textarea.value.trim();
  const type = document.getElementById("summaryType").value;

  if (!text) {
    alert("Please paste some text first.");
    return;
  }

  output.innerHTML = "";
  loading.classList.remove("hidden");

  const chunks = splitText(text);
  let finalSummary = "";

  for (const chunk of chunks) {
    const summary = await summarizeChunk(chunk, type);
    finalSummary += summary + "\n\n";
  }

  loading.classList.add("hidden");
  output.textContent = finalSummary;
}
