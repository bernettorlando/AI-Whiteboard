import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SettingsDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const [apiKey, setApiKey] = useState('')

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key')
        if (storedKey) setApiKey(storedKey)
    }, [])

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-zinc-500">
                            Your key is stored locally in your browser.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}
