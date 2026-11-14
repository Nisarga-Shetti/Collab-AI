
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  CalendarDays,
  Bot,
  Settings,
  Search,
  Bell,
  Users,
  Menu,
  X,
} from 'lucide-react'

import Messages from './pages/Messages'
import Projects from './pages/Projects'
import Meetings from './pages/Meetings'
import AIAssistant from './pages/AIAssistant'
import SettingsPage from './pages/Settings'

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Messages', icon: MessageSquare },
  { name: 'Projects', icon: FolderKanban },
  { name: 'Meetings', icon: CalendarDays },
  { name: 'AI Assistant', icon: Bot },
  { name: 'Settings', icon: Settings },
]

type Project = {
  id: number
  status: string
}

function Overview({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/projects')

        if (!response.ok) {
          throw new Error('Could not load projects')
        }

        const data = await response.json()
        setProjects(Array.isArray(data.projects) ? data.projects : [])
      } catch {
        setError('Unable to load project summaries. Please check that the backend server is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
    },
    {
      title: 'Completed Projects',
      value: projects.filter(
        (project) => project.status?.toLowerCase() === 'completed'
      ).length,
      icon: LayoutDashboard,
    },
    {
      title: 'In Progress Projects',
      value: projects.filter(
        (project) => project.status?.toLowerCase() === 'in progress'
      ).length,
      icon: CalendarDays,
    },
    {
      title: 'Planning Projects',
      value: projects.filter(
        (project) => project.status?.toLowerCase() === 'planning'
      ).length,
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome to CollabAI 👋</h2>
        <p className="text-gray-400 mt-2">
          Your team's workspace for smarter collaboration.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="p-5 rounded-2xl bg-[#171225] border border-white/10"
            >
              <div className="flex justify-between text-gray-400 gap-2">
                <span>{item.title}</span>
                <Icon size={20} className="text-violet-400" />
              </div>

              <h3 className="text-3xl font-bold mt-4">
                {loading ? '...' : item.value}
              </h3>
            </div>
          )
        })}
      </div>

      <div className="p-6 rounded-2xl bg-[#171225] border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Quick Access</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Projects', 'Messages', 'Meetings', 'AI Assistant'].map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="p-4 text-left rounded-xl bg-white/5 hover:bg-violet-600/20 border border-white/10"
            >
              {page} →
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activeMenu, setActiveMenu] = useState('Overview')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderPage() {
    switch (activeMenu) {
      case 'Messages':
        return <Messages />
      case 'Projects':
        return <Projects initialSearch={search} />
      case 'Meetings':
        return <Meetings />
      case 'AI Assistant':
        return <AIAssistant />
      case 'Settings':
        return <SettingsPage />
      default:
        return <Overview onNavigate={setActiveMenu} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0814] text-white flex">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#110d1d] border-r border-white/10 p-5 flex flex-col transition-transform ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-violet-400">CollabAI</h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X />
          </button>
        </div>

        <p className="text-xs uppercase text-gray-500 mb-4">Workspace</p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  activeMenu === item.name
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-violet-600/10 border border-violet-500/20">
          <Bot className="text-violet-400 mb-2" />
          <p className="font-medium">CollabAI Workspace</p>
          <p className="text-xs text-gray-400 mt-1">
            Work better together.
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="min-h-20 px-5 lg:px-8 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu />
            </button>

            <div>
              <h2 className="text-lg font-semibold">{activeMenu}</h2>
              <p className="text-xs text-gray-500">
                Your collaboration workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#171225] border border-white/10">
              <Search size={17} className="text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setActiveMenu('Projects')}
                placeholder="Search projects..."
                className="bg-transparent outline-none text-sm w-40"
              />
            </div>

            <Bell size={20} className="text-gray-400" />

            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center">
              N
            </div>
          </div>
        </header>

        <section className="p-5 lg:p-8">
          {renderPage()}
        </section>
      </main>
    </div>
  )
}

export default App
