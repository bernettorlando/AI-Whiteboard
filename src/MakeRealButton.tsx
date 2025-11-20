import { useState } from 'react'
import { Wand2, Settings, Mic, MicOff } from 'lucide-react'
import { SettingsDialog } from './SettingsDialog'
import { PlanningPanel } from './PlanningPanel'
import { useMakeReal } from './useMakeReal'

export function MakeRealButton() {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [isInputOpen, setIsInputOpen] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isPlanningMode, setIsPlanningMode] = useState(false)
    const [planningSteps, setPlanningSteps] = useState<string[]>([])
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isExecutingPlan, setIsExecutingPlan] = useState(false)
    const { makeReal, generatePlan, isLoading } = useMakeReal()

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false)
            return
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsListening(true)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setPrompt((prev) => (prev ? prev + ' ' + transcript : transcript))
        }

        recognition.start()
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        if (isPlanningMode) {
            const steps = await generatePlan(prompt)
            if (steps && steps.length > 0) {
                setPlanningSteps(steps)
                setCurrentStepIndex(0)
                setIsInputOpen(false)
                setPrompt('')
            }
        } else {
            await makeReal(prompt)
            setPrompt('')
            setIsInputOpen(false)
        }
    }

    const executePlan = async () => {
        if (isExecutingPlan || currentStepIndex >= planningSteps.length) return

        setIsExecutingPlan(true)

        try {
            // Execute steps one by one starting from current index
            for (let i = currentStepIndex; i < planningSteps.length; i++) {
                setCurrentStepIndex(i)
                await makeReal(planningSteps[i])
                // Add a small delay between steps for better UX
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
            setCurrentStepIndex(planningSteps.length) // Mark as complete
        } catch (error) {
            console.error('Error executing plan:', error)
        } finally {
            setIsExecutingPlan(false)
        }
    }

    const cancelPlan = () => {
        setPlanningSteps([])
        setCurrentStepIndex(0)
        setIsExecutingPlan(false)
    }

    return (
        <>
            <div className="absolute top-4 left-1/2 z-[99999] flex -translate-x-1/2 gap-2">
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow-lg dark:bg-zinc-900">
                    {isInputOpen ? (
                        <div className="flex items-center gap-2 px-2">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder={isPlanningMode ? "Describe a complex task..." : "Describe what you want..."}
                                className="w-64 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-white"
                                autoFocus
                            />
                            <button
                                onClick={toggleListening}
                                className={`rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isListening ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'
                                    }`}
                                title={isListening ? 'Stop listening' : 'Start listening'}
                            >
                                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </button>

                            <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 dark:border-zinc-700">
                                <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-white">
                                    <input
                                        type="checkbox"
                                        checked={isPlanningMode}
                                        onChange={(e) => setIsPlanningMode(e.target.checked)}
                                        className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Planning
                                </label>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Wand2 className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsInputOpen(true)}
                            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Wand2 className="h-4 w-4" />
                            <span>Generate</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <SettingsDialog
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {planningSteps.length > 0 && (
                <PlanningPanel
                    steps={planningSteps}
                    currentStepIndex={currentStepIndex}
                    isExecuting={isExecutingPlan}
                    onExecute={executePlan}
                    onCancel={cancelPlan}
                />
            )}
        </>
    )
}
