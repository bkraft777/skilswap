
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCapacitor } from './integrations/capacitor'

// Initialize Capacitor if available
try {
  initializeCapacitor();
} catch (error) {
  console.error('Failed to initialize Capacitor, continuing with web mode:', error);
}

createRoot(document.getElementById("root")!).render(<App />);
