// components/PromptCard.jsx
import React from "react";

const STYLES = {
  move:     { bg: "#fef3c7", border: "#f59e0b", title: "Move Challenge",     icon: "🏃" },
  talk:     { bg: "#dbeafe", border: "#3b82f6", title: "Discussion Time",    icon: "💬" },
  create:   { bg: "#ede9fe", border: "#8b5cf6", title: "Creative Challenge", icon: "🎨" },
  wildcard: { bg: "#fce7f3", border: "#ec4899", title: "Wildcard!",          icon: "🌀" },
};

export default function PromptCard({ prompt, teamName }) {
  if (!prompt) return null;
  const style = STYLES[prompt.type] || STYLES.talk;

  return (
    <div
      className="rounded-2xl p-6 text-center transition-all duration-300"
      style={{
        background: style.bg,
        borderLeft: `4px solid ${style.border}`,
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-2xl">{style.icon}</span>
        <span className="font-semibold text-lg" style={{ color: style.border }}>
          {style.title}
        </span>
      </div>

      <p className="text-lg leading-relaxed mb-4">{prompt.text}</p>

      {teamName && (
        <span
          className="inline-block px-4 py-1 rounded-full text-sm font-medium"
          style={{ background: style.border + "22", color: style.border }}
        >
          {teamName}
        </span>
      )}
    </div>
  );
}