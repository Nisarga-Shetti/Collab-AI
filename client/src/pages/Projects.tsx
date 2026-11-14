
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  Plus,
  FolderKanban,
  CalendarDays,
  Users,
  Search,
  ArrowUpRight,
  X,
  RefreshCw,
  Pencil,
  Trash2,
} from 'lucide-react'

type Project = {
  id: number | string
  name: string
  description: string
  category: string
  status: 'Planning' | 'In Progress' | 'Completed'
  progress: number
  team: string
  deadline: string
}

const API_URL = 'http://127.0.0.1:5000/api/projects'

type ProjectsProps = {
  initialSearch?: string
}

function Projects({ initialSearch = '' }: ProjectsProps) {
  const [search, setSearch] = useState(initialSearch)
  const [filter, setFilter] = useState('All')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | string | null>(null)

  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] =
    useState<Project['status']>('Planning')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  // Load projects from MySQL
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Unable to load projects')
      }

      const data = await response.json()
      const projectList = data.projects ?? []

      setProjects(
        projectList.map((project: any) => ({
          id: project.id,
          name: project.name ?? '',
          description: project.description ?? '',
          category: project.category ?? 'General',
          status: project.status ?? 'Planning',
          progress: Number(project.progress ?? 0),
          team: project.team ?? 'Not assigned',
          deadline: project.deadline
            ? String(project.deadline).slice(0, 10)
            : '',
        }))
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load projects'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Search and filter
  const filteredProjects = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchText) ||
        project.description.toLowerCase().includes(searchText) ||
        project.status.toLowerCase().includes(searchText) ||
        project.category.toLowerCase().includes(searchText) ||
        project.team.toLowerCase().includes(searchText)

      const matchesFilter =
        filter === 'All' || project.status === filter

      return matchesSearch && matchesFilter
    })
  }, [projects, search, filter])

  // Clear form
  const resetForm = () => {
    setProjectName('')
    setDescription('')
    setDeadline('')
    setStatus('Planning')
    setEditingId(null)
    setShowForm(false)
  }

  // Open edit form
  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setProjectName(project.name)
    setDescription(project.description)
    setDeadline(project.deadline)
    setStatus(project.status)
    setShowForm(true)
    setError('')
  }

  // Create or update project
  const handleSaveProject = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!projectName.trim() || !description.trim() || !deadline) {
      setError('Please fill in all project details.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const projectData = {
        name: projectName.trim(),
        description: description.trim(),
        category: 'Development',
        status,
        progress: status === 'Completed' ? 100 : 0,
        team: 'You',
        deadline,
      }

      const isEditing = editingId !== null

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Could not save project')
      }

      resetForm()
      await fetchProjects()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save project'
      )
    } finally {
      setSaving(false)
    }
  }

  // Delete project
  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    )

    if (!confirmed) return

    try {
      setError('')

      const response = await fetch(`${API_URL}/${project.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Could not delete project')
      }

      await fetchProjects()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to delete project'
      )
    }
  }

  const getStatusStyle = (projectStatus: string) => {
    if (projectStatus === 'Completed') {
      return 'bg-emerald-500/10 text-emerald-400'
    }

    if (projectStatus === 'Planning') {
      return 'bg-amber-500/10 text-amber-400'
    }

    return 'bg-violet-500/10 text-violet-300'
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">All Projects</h3>
          <p className="text-sm text-gray-400 mt-1">
            Manage and track your team's work.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchProjects}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-medium"
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchProjects}
            className="underline text-sm mt-2"
          >
            Refresh projects
          </button>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="p-6 rounded-2xl bg-[#171225] border border-violet-500/30">

          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xl font-semibold">
                {editingId !== null ? 'Edit Project' : 'Create New Project'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Enter your project details.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-lg hover:bg-white/10"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveProject} className="space-y-4">

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Project Name
              </label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
                className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project"
                required
                rows={3}
                className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Project Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Project['status'])
                  }
                  className="w-full p-3 rounded-xl bg-[#0b0814] border border-white/10 outline-none focus:border-violet-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-medium disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingId !== null
                    ? 'Update Project'
                    : 'Save Project'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl bg-[#171225] border border-white/10 focus-within:border-violet-500">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, description, status, team..."
            className="bg-transparent outline-none text-sm w-full text-white"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="text-gray-400 hover:text-white"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[#171225] border border-white/10 text-sm outline-none"
        >
          <option value="All">All Projects</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Result Count */}
      {!loading && (
        <p className="text-sm text-gray-400">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <RefreshCw size={30} className="mx-auto mb-3 animate-spin" />
          Loading projects...
        </div>
      )}

      {/* Project Cards */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-[#171225] border border-white/10 hover:border-violet-500/40 transition"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-violet-600/15 text-violet-300">
                  <FolderKanban size={23} />
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(project.status)}`}
                >
                  {project.status}
                </span>
              </div>

              <h3 className="font-semibold text-lg mt-5">
                {project.name}
              </h3>

              <p className="text-sm text-gray-400 mt-2 min-h-10">
                {project.description}
              </p>

              <div className="text-xs text-gray-400 mt-3">
                Category: {project.category}
              </div>

              <div className="flex justify-between text-xs mt-5 mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-violet-300">
                  {project.progress}%
                </span>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-400 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(0, project.progress))}%`,
                  }}
                />
              </div>

              <div className="border-t border-white/10 mt-5 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Users size={15} />
                  Team: {project.team}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    {project.deadline || 'Not set'}
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white transition text-sm"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition text-sm"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Projects Found */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-[#171225] border border-white/10">
          <FolderKanban
            size={35}
            className="mx-auto text-gray-500 mb-3"
          />

          <h3 className="font-semibold">
            {projects.length === 0
              ? 'No projects available'
              : 'No projects found'}
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            {projects.length === 0
              ? 'Create your first project to get started.'
              : 'Try another search or change the status filter.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Projects
