// components/DiceRoller.jsx
import React, { useState, useEffect } from "react";

const DICE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function DiceRoller({ onRoll, onNext, diceValue, disabled }) {
  const [display, setDisplay] = useState("🎲");
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    if (rolling || disabled) return;
    setRolling(true);
    // Animate random faces for 1.2s
    const anim = setInterval(() => {
      setDisplay(DICE_FACES[Math.floor(Math.random() * 6) + 1]);
    }, 100);
    onRoll();
    setTimeout(() => {
      clearInterval(anim);
      setRolling(false);
    }, 1200);
  };

  // Show final value when roll completes
  useEffect(() => {
    if (diceValue && !rolling) {
      setDisplay(DICE_FACES[diceValue]);
    }
    if (!diceValue) {
      setDisplay("🎲");
    }
  }, [diceValue, rolling]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
      <p className="text-xs text-gray-500 font-medium mb-3 tracking-wide">ROLL DICE</p>

      {/* Dice */}
      <button
        onClick={handleRoll}
        disabled={disabled || rolling}
        className={`
          w-20 h-20 rounded-2xl bg-gray-900 text-4xl mx-auto flex items-center justify-center
          transition-all duration-150 cursor-pointer select-none
          ${rolling ? "animate-bounce" : "hover:-translate-y-1 hover:shadow-lg"}
          ${disabled && !rolling ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {display}
      </button>

      <p className="text-xs text-gray-500 mt-2">
        {rolling ? "Rolling..." : diceValue ? `Rolled a ${diceValue}!` : "Click to roll"}
      </p>

      {/* Next turn button */}
      {diceValue && !rolling && (
        <button
          onClick={() => { onNext(); setDisplay("🎲"); }}
          className="mt-3 w-full py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Next Turn →
        </button>
      )}
    </div>
  );
}