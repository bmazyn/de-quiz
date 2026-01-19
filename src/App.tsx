import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import QuizFeed from './components/QuizFeed'
import AudioLoop from './components/AudioLoop'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizFeed />} />
        <Route path="/audio-loop" element={<AudioLoop />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
