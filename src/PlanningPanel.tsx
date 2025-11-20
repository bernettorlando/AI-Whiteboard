import { Play, X, CheckCircle2, Circle, Loader2 } from 'lucide-react'

interface PlanningPanelProps {
    steps: string[]
    currentStepIndex: number
    isExecuting: boolean
    onExecute: () => void
    onCancel: () => void
}

export function PlanningPanel({
    steps,
    currentStepIndex,
    isExecuting,
    onExecute,
    onCancel,
}: PlanningPanelProps) {
    return (
        <div className="absolute top-20 left-4 z-[99999] w-80 rounded-lg bg-white p-4 shadow-xl dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Plan Steps</h3>
                <button
                    onClick={onCancel}
                    className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="mb-4 max-h-[60vh] overflow-y-auto space-y-2">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex
                    const isCurrent = index === currentStepIndex


                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 rounded-md p-2 text-sm transition-colors ${isCurrent
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                }`}
                        >
                            <div className="mt-0.5 shrink-0">
                                {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : isCurrent && isExecuting ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                ) : (
                                    <Circle className={`h-4 w-4 ${isCurrent ? 'text-blue-500' : 'text-zinc-300 dark:text-zinc-600'}`} />
                                )}
                            </div>
                            <span className={`${isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                {step}
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-end">
                {!isExecuting && currentStepIndex < steps.length && (
                    <button
                        onClick={onExecute}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Play className="h-4 w-4" />
                        Execute Plan
                    </button>
                )}
                {isExecuting && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Executing step {currentStepIndex + 1}...
                    </div>
                )}
                {!isExecuting && currentStepIndex >= steps.length && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Plan Complete
                    </div>
                )}
            </div>
        </div>
    )
}
