import React, { useEffect } from 'react'
import OpenSeadragon from 'openseadragon'
import classNames from 'classnames'

export default function Osd({
  id,
  iiifUrl,
  osdInstance,
  setOsdInstance,
  isFullScreen,
}) {
  useEffect(() => {
    // It's possible that osdInstance is null but an OpenSeadragon viewer
    // already exists in the container div. Do another check for child elements
    // to prevent instantiating two OpenSeadragon viewers
    if (
      iiifUrl &&
      !osdInstance &&
      !(document.getElementById(id)?.childElementCount > 0)
    ) {
      // Fix for gaps between tiles on devices with pixel density > 1
      // https://github.com/openseadragon/openseadragon/discussions/2085#discussioncomment-1957842
      const subPixelRoundingForTransparency = {}
      // @ts-ignore
      subPixelRoundingForTransparency[OpenSeadragon.BROWSERS.CHROME] =
        // @ts-ignore
        OpenSeadragon.SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS
      // @ts-ignore
      subPixelRoundingForTransparency[OpenSeadragon.BROWSERS.FIREFOX] =
        // @ts-ignore
        OpenSeadragon.SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS
      // @ts-ignore
      subPixelRoundingForTransparency[OpenSeadragon.BROWSERS.SAFARI] =
        // @ts-ignore
        OpenSeadragon.SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS

      setOsdInstance(
        OpenSeadragon({
          id,
          crossOriginPolicy: 'Anonymous',
          // @ts-ignore
          subPixelRoundingForTransparency,
          sequenceMode: true,
          showSequenceControl: false,
          showHomeControl: false,
          showZoomControl: false,
          showFullPageControl: false,
          visibilityRatio: 0.3,
          tileSources: [ `${iiifUrl}/info.json` ],
          gestureSettingsMouse: {
            scrollToZoom: false,
          },
          preserveViewport: true,
        })
      )
    }
  }, [])

  // Effect to run when switching to and from fullscreen
  // - set focus on OSD canvas,
  // - enable / disable scroll events
  useEffect(() => {
    if (osdInstance) {
      if (isFullScreen) {
        // eslint-disable-next-line no-param-reassign
        osdInstance.gestureSettingsMouse = {
          ...osdInstance.gestureSettingsMouse,
          scrollToZoom: true,
        }
        osdInstance.element.querySelector('.openseadragon-canvas').focus()
        setTimeout(() => {
          osdInstance.element.querySelector('.openseadragon-canvas').focus()
        }, 0)
      } else {
        // eslint-disable-next-line no-param-reassign
        osdInstance.gestureSettingsMouse = {
          ...osdInstance.gestureSettingsMouse,
          scrollToZoom: false,
        }
      }
    }
  }, [osdInstance, isFullScreen])

  // Effect to make page scroll work with scroll to zoom disabled
  // https://github.com/openseadragon/openseadragon/issues/2151
  useEffect(() => {
    if (osdInstance) {
      osdInstance.addHandler('canvas-scroll', (event) => {
        // eslint-disable-next-line no-param-reassign
        if (!isFullScreen) event.preventDefault = false
      })
    }
  }, [osdInstance, isFullScreen])

  return (
    <div
      id={id}
      className={classNames('viewer__osd bg-black', {
        'flex-grow pointer-events-none touch-none': !isFullScreen,
        'h-full': isFullScreen,
      })}
    />
  )
}
