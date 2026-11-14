
import { useState } from 'react'
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Plus,
} from 'lucide-react'

type Message = {
  id: number
  text: string
  time: string
  own: boolean
}

const initialChats = [
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    color: 'bg-pink-600',
    online: true,
    preview: 'Hey! How is the project going?',
    time: '10:42 AM',
    messages: [
      { id: 1, text: 'Hey! Good morning 👋', time: '10:30 AM', own: false },
      { id: 2, text: 'Good morning Sarah!', time: '10:32 AM', own: true },
      { id: 3, text: 'How is the project going?', time: '10:35 AM', own: false },
      { id: 4, text: 'It is going great! We finished the UI design.', time: '10:38 AM', own: true },
      { id: 5, text: 'That is awesome! Looking forward to seeing it.', time: '10:42 AM', own: false },
    ],
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    color: 'bg-blue-600',
    online: true,
    preview: 'I have shared the new files.',
    time: '9:45 AM',
    messages: [
      { id: 1, text: 'Hi! I have shared the new files.', time: '9:45 AM', own: false },
    ],
  },
  {
    id: 3,
    name: 'Emily Davis',
    initials: 'ED',
    color: 'bg-emerald-600',
    online: false,
    preview: 'Thanks for the update!',
    time: 'Yesterday',
    messages: [
      { id: 1, text: 'Thanks for the update!', time: 'Yesterday', own: false },
    ],
  },
  {
    id: 4,
    name: 'Development Team',
    initials: 'DT',
    color: 'bg-violet-600',
    online: true,
    preview: 'Alex: Meeting at 2:30 PM',
    time: 'Yesterday',
    messages: [
      { id: 1, text: 'Alex: Meeting at 2:30 PM', time: 'Yesterday', own: false },
    ],
  },
]

function Messages() {
  const [chats, setChats] = useState(initialChats)
  const [activeChat, setActiveChat] = useState(1)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  const selectedChat = chats.find((chat) => chat.id === activeChat)!

  const sendMessage = () => {
    const trimmed = message.trim()
    if (!trimmed) return

    const newMessage: Message = {
      id: Date.now(),
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      own: true,
    }

    setChats((current) =>
      current.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newMessage], preview: trimmed, time: 'Now' }
          : chat
      )
    )

    setMessage('')
  }

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-72px)] min-h-[500px] flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-white/10 bg-[#100c1d]">

      {/* Conversation list */}
      <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-bold">Messages</h2>
              <p className="text-xs text-gray-400 mt-1">Your conversations</p>
            </div>
            <button className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500">
              <Plus size={19} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <Search size={17} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full text-left p-3 rounded-xl flex gap-3 transition ${
                activeChat === chat.id
                  ? 'bg-violet-600/20 border border-violet-500/30'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full ${chat.color} flex items-center justify-center font-semibold`}>
                  {chat.initials}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#100c1d]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-sm truncate">{chat.name}</span>
                  <span className="text-[10px] text-gray-500 shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-1">{chat.preview}</p>
              </div>
            </button>
          ))}

          {filteredChats.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">
              No conversations found.
            </p>
          )}
        </div>
      </aside>

      {/* Active conversation */}
      <section className="flex-1 min-w-0 flex flex-col">
        <header className="h-[76px] px-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${selectedChat.color} flex items-center justify-center text-sm font-semibold`}>
              {selectedChat.initials}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{selectedChat.name}</h3>
              <p className="text-xs text-gray-400">
                {selectedChat.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <button className="p-2 rounded-lg hover:bg-white/5" title="Voice call">
              <Phone size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5" title="Video call">
              <Video size={19} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5" title="More options">
              <MoreVertical size={19} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="text-center">
            <span className="text-[11px] text-gray-500 bg-white/5 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {selectedChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.own ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] sm:max-w-[65%] ${msg.own ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-6 ${
                  msg.own
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-[#211a30] text-gray-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-500 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 bg-[#1b1528] border border-white/10 rounded-xl p-2">
            <button className="p-2 text-gray-400 hover:text-violet-300">
              <Paperclip size={19} />
            </button>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
              placeholder="Write your message..."
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            />

            <button className="p-2 text-gray-400 hover:text-violet-300">
              <Smile size={19} />
            </button>

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="p-3 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Send message"
            >
              <Send size={17} />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Press Enter to send a message
          </p>
        </div>
      </section>
    </div>
  )
}

export default Messages
