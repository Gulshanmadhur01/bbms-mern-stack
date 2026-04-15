import API_BASE_URL from "../utils/apiConfig.js";
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, HeartPulse, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am Blood-Sync AI. How can I help you today? I can help check your medical eligibility for blood donation.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: "Eligibility Check", text: "Am I eligible to donate blood?" },
    { label: "Tattoo/Piercing", text: "I have a tattoo. Can I donate?" },
    { label: "Medication", text: "I am taking medicine. Can I donate?" },
    { label: "Recent Travel", text: "I traveled recently. Can I donate?" }
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleQuickAction = (text) => {
     handleSendMessage(null, text);
  };

  const handleSendMessage = async (e, forcedText = null) => {
    if (e) e.preventDefault();
    const userMsgText = forcedText || inputMessage;
    if (!userMsgText.trim()) return;

    // Add user message
    const newMsg = {
      sender: "user",
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsgText })
      });

      const data = await response.json();

      if (data.reply) {
         setMessages((prev) => [
           ...prev,
           {
             sender: "bot",
             text: data.reply,
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           },
         ]);
      } else if (data.error) {
         setMessages((prev) => [
           ...prev,
           {
             sender: "bot",
             text: "⚠️ " + data.error,
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           },
         ]);
      }
    } catch (error) {
      console.error("Chatbot Fetch Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having trouble connecting to my AI brain. Is the server running?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-600 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-red-400 rounded-full blur animate-ping opacity-20"></div>
            <MessageSquare className="w-7 h-7 text-white" />
            
            {/* Tooltip hint */}
            <div className="absolute -top-10 -left-6 bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Medical Eligibility Chat
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100"
          >
            {/* Chatbot Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-5 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-red-700 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight">Blood-Sync AI</h3>
                  <p className="text-red-100 text-[10px] uppercase tracking-widest font-bold">Medical Eligibility Expert</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-4">
              <div className="text-center pb-4 mb-4 border-b border-slate-100">
                 <div className="p-2 bg-red-50 rounded-2xl w-fit mx-auto mb-2 border border-red-100">
                    <HeartPulse className="w-6 h-6 text-red-600" />
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    AI is providing general health information. 
                    <span className="text-red-500 block underline">Not a substitute for official medical advice.</span>
                 </p>
              </div>

              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Avatar */}
                    <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${msg.sender === "user" ? "bg-slate-200" : "bg-red-100"}`}>
                        {msg.sender === "user" ? <User className="w-3 h-3 text-slate-500" /> : <Bot className="w-3 h-3 text-red-600" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-slate-900 text-white rounded-br-none"
                          : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className={`block text-[9px] mt-1 font-medium ${msg.sender === "user" ? "text-slate-400 text-right" : "text-slate-400"}`}>
                          {msg.time}
                      </span>
                    </div>

                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2 flex-row">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-red-600" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex gap-1">
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions Grid */}
              {messages.length < 5 && !isTyping && (
                 <div className="grid grid-cols-2 gap-2 mt-4">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action.text)}
                        className="bg-white border border-slate-200 p-2.5 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-red-50 hover:border-red-200 transition-all text-left flex items-center gap-2 group"
                      >
                         <Zap className="w-3 h-3 text-amber-500 group-hover:scale-125 transition-transform" />
                         {action.label}
                      </button>
                    ))}
                 </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1 pr-2 focus-within:border-red-300 focus-within:bg-white transition-colors shadow-inner"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a medical question..."
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-4 py-2 text-slate-700"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4 text-white ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-3">
                  <Link to="/register/donor" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                     Quick Action: Register as Donor
                  </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
