import { useState } from 'react'
import './App.css'

function App() {
  const [isTracking, setIsTracking] = useState(false)

  return (
    <div className="popup-container">
      <header>
        <h1>ADHD Tracker</h1>
      </header>

      <main>
        <div className="status-section">
          <p className="status-text">
            {isTracking ? 'Tracking in progress...' : 'Ready to track'}
          </p>
          <button
            className="track-button"
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <button className="action-button">View History</button>
          <button className="action-button">Settings</button>
        </div>
      </main>
    </div>
  )
}

export default App
