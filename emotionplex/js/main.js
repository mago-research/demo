const inputs = [
  {
    text: "Emotion Bench input 01 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 02 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 03 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 04 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 05 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 06 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 07 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 08 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 09 will be added here.",
    userAudio: null,
    responses: {},
  },
  {
    text: "Emotion Bench input 10 will be added here.",
    userAudio: null,
    responses: {},
  },
];

const models = [
  { key: "minicpm-o", label: "MiniCPM-o" },
  { key: "freeze-omni", label: "Freeze-Omni" },
  { key: "raon-speech", label: "Raon Speech" },
  { key: "personaplex", label: "PersonaPlex" },
  { key: "pemoplex", label: "PemoPlex", isOurs: true },
];

const emotions = [
  { key: "happy", label: "Happy" },
  { key: "sad", label: "Sad" },
  { key: "angry", label: "Angry" },
  { key: "neutral", label: "Neutral" },
];

const panel = document.querySelector("#demo-panel");
const tabs = [...document.querySelectorAll("[data-input-index]")];

function renderAudioSlot(source, label) {
  if (!source) {
    return '<div class="audio-slot"><span>Audio pending</span></div>';
  }

  return `
    <div class="audio-slot">
      <audio controls preload="none" aria-label="${label}">
        <source src="${source}" type="audio/wav" />
      </audio>
    </div>
  `;
}

function renderInput(index) {
  const input = inputs[index];

  const rows = models
    .map((model) => {
      const emotionSamples = emotions
        .map((emotion) => {
          const source = input.responses[model.key]?.[emotion.key];
          return renderAudioSlot(source, `${model.label}, ${emotion.label}`);
        })
        .join("");

      return `
        <div class="model-row${model.isOurs ? " is-ours" : ""}">
          <div class="model-name">
            ${model.label}
            ${model.isOurs ? "<small>Ours</small>" : ""}
          </div>
          ${emotionSamples}
        </div>
      `;
    })
    .join("");

  panel.innerHTML = `
    <div class="input-context">
      <span>User input</span>
      <p>${input.text}</p>
    </div>
    <div class="comparison-scroll">
      <div class="comparison-grid">
        <div class="comparison-header">
          <span>Model</span>
          ${emotions.map((emotion) => `<span>${emotion.label}</span>`).join("")}
        </div>
        ${rows}
      </div>
    </div>
  `;
}

function selectTab(index) {
  tabs.forEach((tab, tabIndex) => {
    tab.setAttribute("aria-selected", String(tabIndex === index));
    tab.tabIndex = tabIndex === index ? 0 : -1;
  });

  renderInput(index);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(index));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    selectTab(nextIndex);
    tabs[nextIndex].focus();
  });
});

selectTab(0);
