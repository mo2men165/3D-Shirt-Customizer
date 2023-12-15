import {motion, AnimatePresence} from 'framer-motion'
import { useSnapshot } from 'valtio'
import { 
    headContentAnimation, 
    headContainerAnimation,
    headTextAnimation,
    slideAnimation
} from './../config/motion';
import state from '../store'
import CustomButton from '../components/CustomButton';

const Home = () => { 
const snap = useSnapshot(state);
  return <>
  
  <AnimatePresence>
    {snap.intro && (
        <motion.section className='home' 
        {...slideAnimation('left')}>
            <motion.header {...slideAnimation('down')}>
                <img src="./threejs.png" alt="logo"
                className='w-8 h-8 object-contain' />
            </motion.header>
            <motion.div className='home-conetn'
            {...headContainerAnimation}>
                <motion.div {...headTextAnimation}>
                    <h1 className='head-text'>
                        LET'S <br className='xl:block hidden' /> DO IT
                    </h1>
                </motion.div>
                <motion.div
                {... headContentAnimation}
                className='flex flex-col gap-5'>
                <p className='max-w-md font-normal text-gray-600 text-base'>
                <strong>Step into the future of fashion</strong> with our 3D T-shirt customization tool! 
                <strong> Unleash your creativity</strong> and design a T-shirt that's as <strong>unique</strong> as you are. 
                <strong> Simple</strong>, <strong>intuitive</strong>, and <strong>limitless possibilities</strong> await. 
                <strong> Let's make your vision a reality!</strong>
                </p>
                <CustomButton
                type="filled"
                title="Customize It"
                handleClick = {() => state.intro = false}
                customStyles = 'w-fit px-4 py-2.5 font-bold text-small'
                />
                </motion.div>
            </motion.div>
        </motion.section>
    )}
  </AnimatePresence>
  
  </>
}

export default Home