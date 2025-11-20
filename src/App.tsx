import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { MakeRealButton } from './MakeRealButton'

function App() {
    return (
        <div className="fixed inset-0">
            <Tldraw persistenceKey="ai-whiteboard">
                <MakeRealButton />
            </Tldraw>
        </div>
    )
}

export default App
