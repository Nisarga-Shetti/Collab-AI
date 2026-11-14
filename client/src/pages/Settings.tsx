
import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Shield,
  Save,
} from 'lucide-react'

type SettingsData = {
  name: string
  email: string
  notifications: boolean
  emailUpdates: boolean
  darkMode: boolean
}

const defaultSettings: SettingsData = {
  name: 'Nisarga',
  email: 'nisarga@example.com',
  notifications: true,
  emailUpdates: false,
  darkMode: true,
}

function getSavedSettings(): SettingsData {
  try {
    const saved = localStorage.getItem('collabai-settings')

    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) }
    }
  } catch {
    console.error('Could not load saved settings.')
  }

  return defaultSettings
}

function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(getSavedSettings)
  const [message, setMessage] = useState('')

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }))
    setMessage('')
  }

  const handleSave = () => {
    try {
      localStorage.setItem(
        'collabai-settings',
        JSON.stringify(settings)
      )
      setMessage('Settings saved successfully!')
    } catch {
      setMessage('Unable to save settings. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account and workspace preferences.
        </p>
      </div>

      <section className="bg-[#171126] border border-purple-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <User className="text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold">Profile Settings</h3>
            <p className="text-xs text-gray-400">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Full Name
            </label>
            <input
              value={settings.name}
              onChange={(e) => updateSetting('name', e.target.value)}
              className="w-full bg-[#0f0a1b] border border-purple-900/40 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
              className="w-full bg-[#0f0a1b] border border-purple-900/40 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#171126] border border-purple-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Bell className="text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-gray-400">
              Control your notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <label className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-gray-400 mt-1">
                Receive updates about team activity
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                updateSetting('notifications', e.target.checked)
              }
              className="w-5 h-5 accent-purple-600"
            />
          </label>

          <div className="border-t border-purple-900/30" />

          <label className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Email Updates</p>
              <p className="text-xs text-gray-400 mt-1">
                Receive updates through email
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) =>
                updateSetting('emailUpdates', e.target.checked)
              }
              className="w-5 h-5 accent-purple-600"
            />
          </label>
        </div>
      </section>

      <section className="bg-[#171126] border border-purple-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Palette className="text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold">Appearance</h3>
            <p className="text-xs text-gray-400">
              Customize your workspace appearance
            </p>
          </div>
        </div>

        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-gray-400 mt-1">
              Save your preferred dark appearance
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) =>
              updateSetting('darkMode', e.target.checked)
            }
            className="w-5 h-5 accent-purple-600"
          />
        </label>
      </section>

      <section className="bg-[#171126] border border-purple-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Shield className="text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold">Security</h3>
            <p className="text-xs text-gray-400 mt-1">
              Account security and privacy settings will be available here.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-green-400">{message}</p>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-medium"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
