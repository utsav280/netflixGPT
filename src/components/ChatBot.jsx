import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRobot, FaTimes, FaSearch, FaSpinner, FaUser } from "react-icons/fa";
import { genAI } from "../utils/geminiAi";
import { API_OPTIONS } from "../utils/constants";
import { setSelectedMovie } from "../utils/movieSlice";
import lang from "../utils/langConstants";

const searchMovieTMDB = async (name) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}&include_adult=false&page=1`,
    API_OPTIONS
  );
  const json = await res.json();
  return json?.results?.[0] || null;
};

const WELCOME = {
  role: "bot",
  text: "Hi! 👋 I'm your AI movie assistant. Ask me anything — vibe, genre, or mood — and I'll suggest 5 movies for you.",
  movies: null,
};

const ChatBot = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Prevent background scrolling when chat is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryOverride) => {
    const query = queryOverride || input.trim();
    if (!query || loading) return;
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    try {
      // Build context from previous conversation, skipping the welcome message
      const contextMessages = messages
        .filter((m) => m !== WELCOME)
        .slice(-6) // Keep the last 6 messages
        .map((m) => {
          let content = m.text;
          if (m.movies && m.movies.length > 0) {
            content += " [I suggested: " + m.movies.map((movie) => movie.name).join(", ") + "]";
          }
          return `${m.role === "user" ? "User" : "MovieBot"}: ${content}`;
        })
        .join("\n");

      const geminiQuery = `
You are MovieBot, a helpful Netflix-style AI assistant.
Previous conversation:
${contextMessages || "None"}

User's new message: "${query}"

Respond in STRICT JSON format ONLY with this structure:
{
  "reply": "Your friendly, conversational response to the user. E.g., answering their question, acknowledging their mood, or introducing the movies. Be concise.",
  "movies": ["Movie 1", "Movie 2"] // An array of up to 5 movie names ONLY if the user is asking for recommendations. If the user is just asking a question about previous movies, leave this as an empty array [].
}
Do not include any markdown formatting like \`\`\`json. Return ONLY the JSON object.
`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(geminiQuery);
      
      // Clean up potential markdown formatting from Gemini
      let rawText = result?.response?.text() || "{}";
      rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      let parsedData = {};
      let replyText = "Here is what I found:";
      let movieNames = [];
      
      try {
        parsedData = JSON.parse(rawText);
        replyText = parsedData.reply || rawText;
        movieNames = Array.isArray(parsedData.movies) ? parsedData.movies : [];
      } catch (parseErr) {
        // If Gemini hallucinates plain text instead of JSON, fail gracefully
        replyText = rawText;
      }

      // Fetch TMDB data for each name only if required
      let movieObjects = [];
      if (movieNames.length > 0) {
        movieObjects = await Promise.all(movieNames.map(searchMovieTMDB));
      }

      // Map TMDB objects alongside their original names so we don't mismatched titles if TMDB fails to find one
      let finalMovies = [];
      if (movieNames.length > 0) {
        finalMovies = movieObjects
          .map((obj, i) => ({ name: movieNames[i], data: obj }))
          .filter((m) => m.data !== null); // Only keep ones we actually found on TMDB
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: replyText,
          movies: finalMovies.length > 0 ? finalMovies : null,
        },
      ]);
    } catch (err) {
      console.error(err);
      
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again.";
      const errString = err.message || String(err);
      
      if (errString.includes("429") || errString.includes("Quota")) {
        errorMessage = "Whoops! 🚦 I'm getting too many requests right now. Please wait 30 seconds and ask me again!";
      } else if (errString.includes("fetch") || errString.includes("network")) {
        errorMessage = "It looks like you're offline or my server is unreachable. Check your internet connection.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: errorMessage, movies: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieData) => {
    if (movieData) dispatch(setSelectedMovie(movieData));
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSend(); };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-[150] w-80 md:w-96 transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="glass border border-white/15 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden" style={{ height: "480px" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-red-700/30 to-red-900/20 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center">
                <FaRobot className="text-red-400 text-sm" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">MovieBot</p>
                <p className="text-green-400 text-[10px] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([WELCOME])}
                className="text-white/30 hover:text-white/60 transition-colors text-xs px-2 py-1 rounded"
                title={lang[langKey]?.clear || "Clear chat"}
              >
                {lang[langKey]?.clear || "Clear"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-1">
                    <FaRobot className="text-red-400 text-[9px]" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
                  {/* Text bubble */}
                  <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-red-600/70 text-white rounded-tr-sm"
                      : "bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>

                  {/* Movie name links */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.movies.map((m, j) => (
                        <button
                          key={j}
                          onClick={() => handleMovieClick(m.data)}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600/15 hover:border-red-500/40 transition-all duration-200 group"
                        >
                          <FaSearch className="text-red-500/60 text-[9px] shrink-0 group-hover:text-red-400" />
                          <span className="text-red-300 text-xs font-medium group-hover:text-red-200 truncate">
                            {m.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                    <FaUser className="text-gray-300 text-[9px]" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                  <FaRobot className="text-red-400 text-[9px]" />
                </div>
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-red-500/40 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang[langKey]?.askAssistant || "Ask for a movie…"}
                disabled={loading}
                className="flex-1 bg-transparent text-white text-xs placeholder-gray-600 px-3 py-2.5 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="m-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {loading ? <FaSpinner className="animate-spin text-[10px]" /> : null}
                {lang[langKey]?.send || "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full shadow-2xl shadow-black/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          open
            ? "bg-white/10 border border-white/20 rotate-0"
            : "bg-gradient-to-br from-red-600 to-red-800 border border-red-500/50 glow-red"
        }`}
        title="Chat with MovieBot"
      >
        {open ? (
          <FaTimes className="text-white text-lg" />
        ) : (
          <FaRobot className="text-white text-xl" />
        )}
      </button>
    </>
  );
};

export default ChatBot;
