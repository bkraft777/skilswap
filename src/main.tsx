
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCapacitor } from './integrations/capacitor'

// Initialize Capacitor if available
initializeCapacitor();

createRoot(document.getElementById("root")!).render(<App />);
