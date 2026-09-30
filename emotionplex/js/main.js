const inputs = [
  {
    id: "05",
    text: "The fighting had now become intermittent.",
  },
  {
    id: "08",
    text: "Oppressive as the heat had been, it was now even more oppressive.",
  },
  {
    id: "07",
    text: "We had been chased by them ourselves, more than once.",
  },
  {
    id: "04",
    text: "A combination of Canadian capital quickly organized and petitioned for the same privileges.",
  },
  {
    id: "01",
    text: "God bless 'em, I hope I'll go on seeing them forever.",
  },
  {
    id: "09",
    text: "Hardly were our plans made public before we were met by powerful opposition.",
  },
  {
    id: "03",
    text: "Each day she became a more vital part of him.",
  },
  {
    id: "02",
    text: "Ah, we were very close together in that moment.",
  },
  {
    id: "06",
    text: "To my surprise he began to show actual enthusiasm in my favor.",
  },
  {
    id: "10",
    text: "But they make the mistake of ignoring their own duality.",
  },
];

const models = [
  { key: "minicpm-o", label: "MiniCPM-o" },
  { key: "freeze-omni", label: "Freeze-Omni" },
  { key: "raon-speech", label: "Raon Speech" },
  { key: "personaplex", label: "PersonaPlex" },
  { key: "emotionplex", label: "EmotionPlex", isOurs: true },
];

const emotions = [
  { key: "happy", label: "Happy" },
  { key: "sad", label: "Sad" },
  { key: "angry", label: "Angry" },
  { key: "neutral", label: "Neutral" },
];

const panel = document.querySelector("#demo-panel");
const tabs = [...document.querySelectorAll("[data-input-index]")];

panel.addEventListener(
  "play",
  (event) => {
    if (!(event.target instanceof HTMLAudioElement)) return;

    panel.querySelectorAll("audio").forEach((audio) => {
      if (audio !== event.target) audio.pause();
    });
  },
  true,
);

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
          const source = `assets/audio/${input.id}/${model.key}/${emotion.key}.wav`;
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
      <div class="input-content">
        <p>${input.text}</p>
        <audio controls preload="none" aria-label="User input ${input.id}">
          <source src="assets/audio/${input.id}/user_input.wav" type="audio/wav" />
        </audio>
      </div>
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
