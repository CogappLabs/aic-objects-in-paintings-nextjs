import React, { useState, useEffect, useRef } from 'react'
// import ReactDOMClient from 'react-dom/client'
import classNames from 'classnames'
import Osd from './Osd'


export default function Viewer({ elementId, iiifUrl, overlays }) {
  const [osdInstance, setOsdInstance] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const viewerRef = useRef()

  const exitFullScreenHandler = (e) => {
    // For non-supporting browsers fullscreenElement is undefined
    if (
      typeof document.fullscreenElement === 'undefined' &&
      // @ts-ignore
      typeof document.webkitFullscreenElement === 'undefined' &&
      e.type === 'keydown' &&
      e.key === 'Escape'
    ) {
      setIsFullScreen(false)
    }
    // Esc or the browser inserted close button will trigger the fullscreenchange event instead
    if (
      (e.type === 'fullscreenchange' || e.type === 'webkitfullscreenchange') &&
      // @ts-ignore
      !(document.fullscreenElement || document.webkitFullscreenElement)
    ) {
      setIsFullScreen(false)
    }
  }

  // Fullscreen enter / exit
  useEffect(() => {
    const viewerEl = osdInstance?.element?.parentElement

    // Going from not fullscreen to fullscreen
    if (isFullScreen) {
      document.addEventListener('keydown', exitFullScreenHandler)
      document.body.classList.add('overflow-hidden')

      // If fullscreen API is available use that, otherwise rely on CSS
      if (typeof document.fullscreenElement !== 'undefined') {
        viewerEl.requestFullscreen()
        // @ts-ignore
      } else if (typeof document.webkitFullscreenElement !== 'undefined') {
        viewerEl.webkitRequestFullscreen()
      }
      // Going from fullscreen to not fullscreen
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        // @ts-ignore
      } else if (document.webkitFullscreenElement) {
        // @ts-ignore
        document.webkitExitFullscreen()
      }
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.removeEventListener('keydown', exitFullScreenHandler)
    }
  }, [isFullScreen])

  // Mount / unmount
  useEffect(() => {
    // parseDataAttribute()
    document.addEventListener('fullscreenchange', exitFullScreenHandler)

    // @ts-ignore
    if (typeof document.webkitFullscreenElement !== 'undefined') {
      document.addEventListener('webkitfullscreenchange', exitFullScreenHandler)
    }

    return () => {
      document.removeEventListener('fullscreenchange', exitFullScreenHandler)

      // @ts-ignore
      if (typeof document.webkitFullscreenElement !== 'undefined') {
        document.removeEventListener(
          'webkitfullscreenchange',
          exitFullScreenHandler
        )
      }
    }
  }, [])

  return (
    <>
      <div
        ref={viewerRef}
        id={elementId}
        className={classNames('viewer overflow-hidden h-full', {
          'flex-grow flex flex-col relative': !isFullScreen,
          'fixed top-0 right-0 bottom-0 left-0 w-full h-full z-20': isFullScreen,
        })}
      >
        <Osd
          id={`${elementId}__osd`}
          osdInstance={osdInstance}
          setOsdInstance={setOsdInstance}
          iiifUrl={iiifUrl}
          isFullScreen={isFullScreen}
          overlays={overlays}
        />
        {/* This element is just here to trap mouse and touch events */}
        {!isFullScreen && (
          <div className="viewer__osd-mask" aria-hidden="true" />
        )}
      </div>
    </>
  )
}