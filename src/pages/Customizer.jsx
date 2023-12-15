import { useState, useEffect } from "react"
import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { useSnapshot } from "valtio"
import state from "../store"
import config from './../config/config';
import {download} from '../assets'
import { downloadCanvasToImage, reader  } from './../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from './../config/constants';
import { fadeAnimation, slideAnimation } from "../config/motion"
import AIPicker from './../components/AIPicker';
import CustomButton from "../components/CustomButton"
import Tab from './../components/Tab';
import ColorPicker from './../components/ColorPicker';
import FilePicker from './../components/FilePicker';
import toast from 'react-hot-toast';


const Customizer = () => {
  const snap = useSnapshot(state);
  
  const [file, setFile] = useState("")
  
  const [prompt, setPrompt] = useState('')

  const [generatingIMG, setGeneratingIMG] = useState(false)

  const [activeEditorTab, setActiveEditorTab] = useState('')

  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  })
  
  
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case 'filepicker':
        return <FilePicker
        file = {file}
        setFile = {setFile}
        readFile = {readFile} />
      // case 'aipicker':
      //   return <AIPicker 
      //   prompt={prompt}
      //   setPrompt={setPrompt}
      //   generatingIMG={generatingIMG}
      //   handleSubmit = {handleSubmit}
      //   /> 
      default:
        return null   
    }
  } 
  
  const handleSubmit = async (type) => {
    if (!prompt) return toast.error("Please enter a prompt")
    try{
      setGeneratingIMG(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })
      const data = await response.JSON()
      handleDecals(type, `data:image/png:base64,${data.photo}`)
  }   
  catch(error){
    toast.error(error)
  } finally {
    setGeneratingIMG(false)
    setActiveEditorTab('')
  }
  }
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if (!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch(tabName){
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName]
        break;
      default:
        state.isFullTexture = false;
        state.isLogoTexture = true;
    }

    setActiveFilterTab((prevState)=>{
      return{
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
    .then((result)=>{
      handleDecals(type,result)
      setActiveEditorTab('')
    })

  }
  return <>
  
  <AnimatePresence>
    {!snap.intro && (
      <>
      <motion.div
      key="custom"
      className="absolute top-0 left-0 z-10 "
      {...slideAnimation('left')}>
        <div className="flex items-center min-h-screen">
          <div className="editortabs-container tabs">
          {EditorTabs.map((tab)=>(
            <Tab
            key={tab.name}
            tab={tab}
            handleClick={()=>setActiveEditorTab(tab.name)} />
          ))}
          {generateTabContent()}
          </div>
        </div>
      </motion.div>

      <motion.div className="absolute z-10 top-5 right-5"
      {...fadeAnimation}
      >
        <CustomButton type='filled'
        title="Go back"
        handleClick={()=> state.intro = true}
        customStyles='w-fit px-4 py-2.5 font-bold text-sm' />
      </motion.div>

      <motion.div
      className="filtertabs-container"
      {...slideAnimation('up')}>
        {FilterTabs.map((tab)=>(
            <Tab
            key={tab.name}
            tab={tab}
            isFilterTab
            isActiveTab = ''
            handleClick={()=>handleActiveFilterTab(tab.name)} />
          ))}
      </motion.div>
      </>
    )}
  </AnimatePresence>
  
  </>
}

export default Customizer