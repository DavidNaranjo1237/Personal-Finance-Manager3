import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './app/routes'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css';
import './styles/tailwind.css';
import './styles/theme.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
)
  
  
  
