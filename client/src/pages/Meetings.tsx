
import { useState } from 'react'
import {
  Video,
  Plus,
  CalendarDays,
  Clock,
  Users,
  Search,
  X,
  ArrowUpRight,
} from 'lucide-react'

type Meeting = {
  id: number
  title: string
  date: string
  time: string
  participants: string
  status: 'Upcoming' | 'Completed'
}

function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: 'Weekly Team Meeting',
      date: 'Nov 16, 2026',
      time: '10:00 AM',
      participants: '8 members',
      status: 'Upcoming',
    },
    {
      id: 2,
      title: 'Website Design Review',
      date: 'Nov 17, 2026',
      time: '2:30 PM',
      participants: '4 members',
      status: 'Upcoming',
    },
    {
      id: 3,
      title: 'Project Planning',
      date: 'Nov 18, 2026',
      time: '11:00 AM',
      participants: '6 members',
      status: 'Upcoming',
    },
    {
      id: 4,
      title: 'Marketing Discussion',
      date: 'Nov 10, 2026',
      time: '3:00 PM',
      participants: '5 members',
      status: 'Completed',
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [participants, setParticipants] = useState('')
  const [search, setSearch] = useState('')

  const createMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newMeeting: Meeting = {
      id: Date.now(),
      title: title.trim(),
      date: new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      participants: `${participants} members`,
      status: 'Upcoming',
    }

    setMeetings((previous) => [newMeeting, ...previous])

    setTitle('')
    setDate('')
    setTime('')
    setParticipants('')
    setShowForm(false)
  }

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(search.toLowerCase())
  )

  const upcomingCount = meetings.filter(
    (meeting) => meeting.status === 'Upcoming'
  ).length

  const completedCount = meetings.filter(
    (meeting) => meeting.status === 'Completed'
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Meetings & Calls</h3>
          <p className="text-sm text-gray-400 mt-1">
            Organize meetings and stay connected with your team.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition"
        >
          <Plus size={18} />
          Schedule Meeting
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="p-5 rounded-2xl bg-[#171225] border border-white/10">
          <CalendarDays className="text-violet-400" size={23} />
          <h3 className="text-3xl font-bold mt-4">{meetings.length}</h3>
          <p className="text-sm text-gray-400 mt-1">Total Meetings</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#171225] border border-white/10">
          <Video className="text-emerald-400" size={23} />
          <h3 className="text-3xl font-bold mt-4">{upcomingCount}</h3>
          <p className="text-sm text-gray-400 mt-1">Upcoming Meetings</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#171225] border border-white/10">
          <Clock className="text-fuchsia-400" size={23} />
          <h3 className="text-3xl font-bold mt-4">{completedCount}</h3>
          <p className="text-sm text-gray-400 mt-1">Completed Meetings</p>
        </div>

      </div>

      {/* Create Meeting Form */}
      {showForm && (
        <div className="p-6 rounded-2xl bg-[#171225] border border-violet-500/30">

          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xl font-semibold">Schedule New Meeting</h3>
              <p className="text-sm text-gray-400 mt-1">
                Add your meeting details.
              </p>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="p-2 rounded-lg hover:bg-white/10"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={createMeeting} className="space-y-4">

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Meeting Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
                required
                className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Participants
                </label>
                <input
                  type="number"
                  min="1"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Number of members"
                  required
                  className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none"
                />
              </div>

            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500"
              >
                Create Meeting
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl bg-white/10"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#171225] border border-white/10">
        <Search size={18} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meetings..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Meeting List */}
      <div className="space-y-4">

        <h3 className="text-lg font-semibold">All Meetings</h3>

        {filteredMeetings.map((meeting) => (

          <div
            key={meeting.id}
            className="p-5 rounded-2xl bg-[#171225] border border-white/10 hover:border-violet-500/40 transition"
          >

            <div className="flex flex-col sm:flex-row justify-between gap-4">

              <div className="flex gap-4">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-600/15 flex items-center justify-center text-violet-300">
                  <Video size={23} />
                </div>

                <div>
                  <h4 className="font-semibold">{meeting.title}</h4>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">

                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {meeting.date}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock size={14} />
                      {meeting.time}
                    </span>

                    <span className="flex items-center gap-2">
                      <Users size={14} />
                      {meeting.participants}
                    </span>

                  </div>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <span className={`text-xs px-3 py-2 rounded-full ${
                  meeting.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-violet-500/10 text-violet-300'
                }`}>
                  {meeting.status}
                </span>

                {meeting.status === 'Upcoming' && (
                  <button
                    type="button"
                    title="Meeting link not configured yet"
                    className="p-2 rounded-lg bg-violet-600/20 text-violet-300"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                )}

              </div>

            </div>

          </div>

        ))}

        {filteredMeetings.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No meetings found.
          </p>
        )}

      </div>

    </div>
  )
}

export default Meetings
