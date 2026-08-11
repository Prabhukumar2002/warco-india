import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { ORG } from "../data/content";

export default function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleQuickReply = (label) => {
    setMessage((prev) => (prev ? prev : label + " — "));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!phone || !message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Chat widget visitor",
          phone,
          requestType: "Chat Message",
          message,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const resetChat = () => {
    setPhone("");
    setMessage("");
    setStatus("idle");
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span>{t.chat.title}</span>
            <button
              type="button"
              className="chat-close-btn"
              onClick={() => setOpen(false)}
              aria-label={t.chat.close}
            >
              ×
            </button>
          </div>

          <div className="chat-panel-body">
            {status === "sent" ? (
              <div className="chat-sent-state">
                <p className="chat-auto-reply">{t.chat.autoReply}</p>
                <button className="btn btn-warco-outline btn-sm mt-2" onClick={resetChat}>
                  {t.chat.sent} ↺
                </button>
              </div>
            ) : (
              <>
                <p className="chat-greeting">{t.chat.greeting}</p>
                <div className="chat-quick-replies">
                  {t.chat.quickReplies.map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="chat-quick-reply"
                      onClick={() => handleQuickReply(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSend}>
                  <input
                    type="tel"
                    className="form-control mb-2"
                    placeholder={t.chat.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder={t.chat.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-warco-cta w-100" disabled={status === "sending"}>
                    {status === "sending" ? t.chat.sending : t.chat.send}
                  </button>
                  {status === "error" && <p className="form-feedback error mt-2">{t.chat.errorMsg}</p>}
                </form>
                <p className="chat-fallback-note">
                  Urgent? Call <a href={`tel:${ORG.phonePrimary.replace(/\s/g, "")}`}>{ORG.phonePrimary}</a>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="chat-bubble-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.chat.bubbleLabel}
        title={t.chat.bubbleLabel}
      >
        {open ? (
          <span className="chat-bubble-icon">×</span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4h16v11H8l-4 4V4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
