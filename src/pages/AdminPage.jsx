// pages/AdminPage.jsx
// Hidden admin panel — manage prompts
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import toast from "react-hot-toast";
import { DEFAULT_PROMPTS } from "../data/prompts";

const TYPE_COLORS = {
  move:     "bg-amber-100 text-amber-800",
  talk:     "bg-blue-100 text-blue-800",
  create:   "bg-violet-100 text-violet-800",
  wildcard: "bg-pink-100 text-pink-800",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { prompts, updatePrompts } = useGame();
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState("move");
  const [newText, setNewText] = useState("");

  const filtered = filter === "all" ? prompts : prompts.filter(p => p.type === filter);

  const toggleEnabled = (id) => {
    updatePrompts(prompts.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const deletePrompt = (id) => {
    if (!window.confirm("Delete this prompt?")) return;
    updatePrompts(prompts.filter(p => p.id !== id));
    toast.success("Prompt deleted");
  };

  const addPrompt = () => {
    if (!newText.trim()) { toast.error("Enter prompt text"); return; }
    updatePrompts([...prompts, {
      id: "custom-" + Date.now(),
      type: newType,
      enabled: true,
      text: newText.trim(),
    }]);
    setNewText("");
    setShowForm(false);
    toast.success("Prompt added!");
  };

  const resetToDefaults = () => {
    if (!window.confirm("Reset all prompts to defaults? Custom prompts will be lost.")) return;
    updatePrompts(DEFAULT_PROMPTS.map(p => ({ ...p })));
    toast.success("Prompts reset to defaults");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage game prompts · {prompts.length} total</p>
          </div>
          <button onClick={() => navigate("/")} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-white transition-colors">
            ← Back
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["all", "move", "talk", "create", "wildcard"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors capitalize
                ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 hover:bg-gray-50"}`}
            >
              {f}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800">
            + Add Prompt
          </button>
          <button onClick={resetToDefaults} className="px-4 py-1.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50">
            Reset Defaults
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
            <p className="font-medium mb-4">New Prompt</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="move">Move</option>
                  <option value="talk">Talk</option>
                  <option value="create">Create</option>
                  <option value="wildcard">Wildcard</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Prompt text</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                rows={3}
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Enter the prompt that players will see..."
              />
            </div>
            <div className="flex gap-2">
              <button onClick={addPrompt} className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800">
                Add Prompt
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Prompts table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3 w-24">Type</th>
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Prompt</th>
                <th className="text-left text-xs text-gray-500 font-medium px-5 py-3 w-20">Active</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[p.type] || "bg-gray-100 text-gray-700"}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700 leading-relaxed">{p.text}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleEnabled(p.id)}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${p.enabled ? "bg-gray-900" : "bg-gray-200"}`}
                    >
                      <span className={`inline-block w-4 h-4 mt-0.5 rounded-full bg-white shadow transition-transform ${p.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-3">
                    <button onClick={() => deletePrompt(p.id)} className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none">
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                    No prompts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}