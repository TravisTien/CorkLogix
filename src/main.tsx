import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SalesApp from './SalesApp'
import './index.css'

// 檢查 URL 參數決定載入哪個應用
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {mode === 'sales' ? <SalesApp /> : <App />}
    </React.StrictMode>,
)

