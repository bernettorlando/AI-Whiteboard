import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { MakeRealButton } from './MakeRealButton'

function App() {
    return (
        <div className="fixed inset-0" style={{ border: '5px solid red', zIndex: 50 }}>
            <Tldraw persistenceKey="ai-whiteboard" licenseKey="tldraw-2026-11-24/WyJBRVgyckZJbSIsWyIqLmFpLXdoaXRlYm9hcmQtbmluZS52ZXJjZWwuYXBwLyJdLDksIjIwMjYtMTEtMjQiXQ.WmzpG7awS7V/0U11Ngz4SjpPosDAXPjL2q+/dHoGzAJFhiul8Qc0Dln2HnhYuzOxI97owAtwFQlSDPATpv/2tw">
                <MakeRealButton />
            </Tldraw>
        </div>
    )
}

export default App
