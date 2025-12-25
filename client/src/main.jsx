import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider} from "./context/authContext.jsx";
import { SocketProvider } from "./context/socketContext.jsx";
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
)
