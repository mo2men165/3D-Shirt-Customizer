import React from 'react'
import Canvas from './canvas/Index'
import Customizer from './pages/Customizer'
import Home from './pages/home'
import { Toaster } from 'react-hot-toast'

function App() {
  return <>
  <div><Toaster/></div>
  <main className='app transition-all ease-in'>
      <Home />
      <Canvas />
      <Customizer />
  </main>
  
  </>
    
  
}

export default App