'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, setInput, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setHasNewMessage(true)
    }
  }, [messages, isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setHasNewMessage(false)
    await sendMessage({
      text: input,
    })
  }

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-indigo-650 hover:bg-indigo-600 border border-indigo-400/25 hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 transition-all duration-200 shadow-[0_4px_25px_rgba(99,102,241,0.4)] cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {hasNewMessage && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-indigo-600 animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 glass-lg rounded-2xl w-96 h-[560px] flex flex-col shadow-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4.5 border-b border-white/5 bg-slate-950/40 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Dental AI Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center px-4">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">How can I help you today?</p>
                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                      Let&apos;s schedule your dental visit. Ask about services or request a time slot.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-indigo-650 text-white rounded-br-none'
                      : 'bg-slate-900 border border-white/5 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {message.content ? (
                    <p>{message.content}</p>
                  ) : (
                    message.parts?.map((part, idx) => (
                      <p key={idx}>
                        {part.type === 'text' ? part.text : '[Action performed]'}
                      </p>
                    ))
                  )}
                </div>
              </div>
            ))}

            {status === 'streaming' && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-white/5 bg-slate-950/20 flex gap-2 rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={status === 'streaming'}
              className="flex-1 bg-slate-950/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)] disabled:opacity-50 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || status === 'streaming'}
              className="p-2.5 rounded-xl bg-indigo-650 text-white hover:bg-indigo-600 border border-indigo-400/20 shadow-[0_2px_10px_rgba(99,102,241,0.2)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none transition duration-150 cursor-pointer flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
