import React, { useEffect } from "react";
import OpenSeadragon from "openseadragon";
import classNames from "classnames";

const overlayColors = [
  "text-red-600 border-red-600 hover:bg-red-600",
  "text-orange-600 border-orange-600 hover:bg-orange-600",
  "text-amber-600 border-amber-600 hover:bg-amber-600",
  "text-yellow-600 border-yellow-600 hover:bg-yellow-600",
  "text-lime-600 border-lime-600 hover:bg-lime-600",
  "text-green-600 border-green-600 hover:bg-green-600",
  "text-emerald-600 border-emerald-600 hover:bg-emerald-600",
  "text-teal-600 border-teal-600 hover:bg-teal-600",
  "text-cyan-600 border-cyan-600 hover:bg-cyan-600",
  "text-sky-600 border-sky-600 hover:bg-sky-600",
  "text-blue-600 border-blue-600 hover:bg-blue-600",
  "text-indigo-600 border-indigo-600 hover:bg-indigo-600",
  "text-violet-600 border-violet-600 hover:bg-violet-600",
  "text-purple-600 border-purple-600 hover:bg-purple-600",
  "text-fuchsia-600 border-fuchsia-600 hover:bg-fuchsia-600",
  "text-pink-600 border-pink-600 hover:bg-pink-600",
  "text-rose-600 border-rose-600 hover:bg-rose-600"
]

export default function Osd({
  id,
  iiifUrl,
  osdInstance,
  setOsdInstance,
  isFullScreen,
  overlays,
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
      const subPixelRoundingForTransparency = {};
      // @ts-ignore
      subPixelRoundingForTransparency[OpenSeadragon.BROWSERS.CHROME] =
        // @ts-ignore
        OpenSeadragon.SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS;
      // @ts-ignore
      subPixelRoundingForTransparency[OpenSeadragon.BROWSERS.FIREFOX] =
        // @ts-ignore
        OpenSeadragon.SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS;
      // @ts-ignore
      subPixelRoundingForTransparency[OpenSeadragon.BROWSERS.SAFARI] =
        // @ts-ignore
        OpenSeadragon.SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS;

      setOsdInstance(
        OpenSeadragon({
          id,
          crossOriginPolicy: "Anonymous",
          // @ts-ignore
          subPixelRoundingForTransparency,
          sequenceMode: true,
          showSequenceControl: false,
          showHomeControl: true,
          showZoomControl: true,
          showFullPageControl: true,
          tileSources: [`${iiifUrl}/info.json`],
          gestureSettingsMouse: {
            scrollToZoom: false,
          },
          preserveViewport: true,
        })
      );
    }
  }, []);

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
        };
        osdInstance.element.querySelector(".openseadragon-canvas").focus();
        setTimeout(() => {
          osdInstance.element.querySelector(".openseadragon-canvas").focus();
        }, 0);
      } else {
        // eslint-disable-next-line no-param-reassign
        osdInstance.gestureSettingsMouse = {
          ...osdInstance.gestureSettingsMouse,
          scrollToZoom: false,
        };
      }
    }
  }, [osdInstance, isFullScreen]);

  // Effect to make page scroll work with scroll to zoom disabled
  // https://github.com/openseadragon/openseadragon/issues/2151
  useEffect(() => {
    if (osdInstance) {
      osdInstance.addHandler("canvas-scroll", (event) => {
        // eslint-disable-next-line no-param-reassign
        if (!isFullScreen) event.preventDefault = false;
      });
    }
  }, [osdInstance, isFullScreen]);

  useEffect(() => {
    if (iiifUrl && osdInstance) {
      osdInstance.open(`${iiifUrl}/info.json`);
    }
  }, [osdInstance, iiifUrl]);

  useEffect(() => {
    if (osdInstance && overlays) {
      overlays.forEach((overlay) => {
        // Create a new <div> element
        const overlaysContainer = document.querySelector('.js-overlays-container')
        const overlayElement = document.createElement('div');

        // Set its ID attribute to "myDiv"
        overlayElement.id = overlay.id;

        // Set its text content to "Hello, world!"
        overlayElement.textContent = overlay.tag;
        overlayElement.className = `${overlayColors[Math.floor(Math.random() * overlayColors.length)]} border-2 hover:bg-opacity-20 p-1 leading-none shadow [text-shadow:_0_0_2px_#000] cursor-pointer`;

        // Add the new <div> element to the DOM
        overlaysContainer.appendChild(overlayElement);

        // const imageAspectRatio = osdInstance.tileSources[0].aspectRatio;

        // if (imageAspectRatio) {
          // if width > height (landscape) then aspect ratio is > 1
          // if square then aspect ratio is 1
          // if width < height (portrait) then aspect ratio is < 1
        // }

        osdInstance.addOverlay({
          element: overlay.id,
          location: osdInstance.viewport.imageToViewportRectangle(
            new OpenSeadragon.Rect(overlay.rect[0], overlay.rect[1], overlay.rect[2], overlay.rect[3])
          ),
        });

        var tracker = new OpenSeadragon.MouseTracker({
          element: overlayElement,
          clickHandler: overlay.onClick,
       });
      });
    }
  }, [osdInstance, overlays]);

  return (
    <div
      id={id}
      className={classNames("viewer__osd bg-black", {
        "flex-grow pointer-events-none touch-none": !isFullScreen,
        "h-full": isFullScreen,
      })}
    />
  );
}
