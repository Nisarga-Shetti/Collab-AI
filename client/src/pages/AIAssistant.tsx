
import { useState } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  User,
  MessageSquare,
  Lightbulb,
  ListChecks,
  X,
} from 'lucide-react'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
}

function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hello! I'm your CollabAI assistant. I can help you organize projects, plan tasks, and improve team productivity. What would you like help with today?",
    },
  ])

  const [input, setInput] = useState('')

  const suggestions = [
    {
      icon: ListChecks,
      title: 'Create a task plan',
      description: 'Break a project into simple tasks.',
    },
    {
      icon: MessageSquare,
      title: 'Summarize a discussion',
      description: 'Get the key points from a conversation.',
    },
    {
      icon: Lightbulb,
      title: 'Generate project ideas',
      description: 'Explore ideas for your next project.',
    },
  ]

  const sendMessage = (text?: string) => {
    const messageText = (text ?? input).trim()

    if (!messageText) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
    }

    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content:
        "Thanks for your question! I'm currently running in demo mode. Once we connect the AI backend, I'll be able to generate real AI-powered answers and project suggestions.",
    }

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ])

    setInput('')
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content:
          "Hello! I'm your CollabAI assistant. How can I help you today?",
      },
    ])
  }

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Assistant</h2>
          <p className="text-gray-400 text-sm mt-1">
            Your intelligent workspace companion
          </p>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-500/30 text-gray-300 hover:bg-purple-500/10 transition"
        >
          <X size={16} />
          Clear chat
        </button>
      </div>

      {/* AI Welcome Card */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 via-[#171126] to-[#171126] p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 flex items-center justify-center">
            <Bot size={30} className="text-purple-300" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">CollabAI Intelligence</h3>
              <Sparkles size={17} className="text-purple-300" />
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Ask questions and explore ideas for your team.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="font-semibold mb-4">What can I help you with?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon

            return (
              <button
                key={suggestion.title}
                onClick={() => sendMessage(suggestion.title)}
                className="text-left p-5 rounded-2xl bg-[#171126] border border-purple-900/30 hover:border-purple-500/50 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-purple-300" />
                </div>

                <h4 className="font-semibold mb-2">
                  {suggestion.title}
                </h4>

                <p className="text-sm text-gray-400">
                  {suggestion.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="rounded-2xl bg-[#171126] border border-purple-900/30 overflow-hidden">

        <div className="p-5 border-b border-purple-900/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Bot size={21} className="text-purple-300" />
          </div>

          <div>
            <h3 className="font-semibold">AI Chat</h3>
            <p className="text-xs text-gray-400">
              Demo assistant
            </p>
          </div>
        </div>

        <div className="h-[380px] overflow-y-auto p-5 space-y-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-9 h-9 shrink-0 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <Bot size={19} className="text-purple-300" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#241b35] text-gray-200'
                }`}
              >
                {message.content}
              </div>

              {message.role === 'user' && (
                <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                  <User size={19} className="text-indigo-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-purple-900/30">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
            className="flex items-center gap-3 bg-[#0f0a1b] border border-purple-900/40 rounded-xl p-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your AI assistant anything..."
              className="flex-1 min-w-0 bg-transparent outline-none px-3 py-2 text-sm text-white placeholder:text-gray-500"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 shrink-0 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
            >
              <Send size={19} />
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-3">
            CollabAI demo mode · AI backend connection coming later
          </p>
        </div>
      </div>

    </div>
  )
}

export default AIAssistant
