import { useSnapshot } from 'valtio'
import { state } from './store'
import { Logo } from '@pmndrs/branding'

import { motion } from 'framer-motion'

export function Overlay() {
    const snap = useSnapshot(state)
    const transition = { type: 'spring', duration: 0.8 }

    return (
      <div>
        <header >
          <Logo width="40" height="40" />
          <motion.div animate={{ x: snap.intro ? 0 : 100, opacity: snap.intro ? 1 : 0 }} transition={transition}>
            
          </motion.div>
        </header>
        <>
            <div key="custom">
                <Customizer />
            </div>
        </>
      </div>
    )
  }
  

export function Customizer() {
    const snap = useSnapshot(state)
    return (
      <div className="customizer">
        <div className="color-options">
          {snap.colors.map((color) => (
            <div key={color} className={`circle`} style={{ background: color }} onClick={() => (state.color = color)}></div>
          ))}
        </div>
        <div className="decals">
          <div className="decals--container">
            {snap.decals.map((decal) => (
              <div key={decal} className={`decal`} onClick={() => (state.decal = decal)}>
                <img src={decal + `${decal === 'pagefly' ? '.png' : '.webp'}`} alt="brand" />
              </div>
            ))}
          </div>
        </div>
        <button
          className="share"
          style={{ background: snap.color }}
          onClick={() => {
            const link = document.createElement('a')
            link.setAttribute('download', 'canvas.png')
            link.setAttribute('href', document.querySelector('canvas').toDataURL('image/png').replace('image/png', 'image/octet-stream'))
            link.click()
          }}>
          DOWNLOAD
          
        </button>
        <button className="exit" style={{ background: snap.color }} onClick={() => (state.intro = true)}>
          GO BACK    
        </button>
      </div>
    )
  }