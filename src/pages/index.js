// import Image from 'next/image'
import dynamic from "next/dynamic";
import { useState } from "react";

import Artwork from "../components/Artwork";
import Tag from "../components/Tag";
import TagsList from "../components/TagsList";

const Viewer = dynamic(() => import("../components/Viewer"), { ssr: false });

// get x and y from a coordinate like '(0.46498754620552063, 0.22276608645915985)'
const getXandY = (str) => {
  const coordinates = str.slice(1, -1).split(", ");
  const x = parseFloat(coordinates[0]);
  const y = parseFloat(coordinates[1]);
  return { x, y };
};

export default function Home() {
  const [artworks, setArtworks] = useState([
    {
      id: 28560,
      title: "The Bedroom",
      artist: "Vincent van Gogh",
      url: "https://www.artic.edu/artworks/28560",
      iiif: "https://www.artic.edu/iiif/2/25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e",
      tags: [
        "Furniture",
        "Table",
        "Chair",
        "Wood",
        "Couch",
        "Flooring",
        "Interior design",
        "Yellow",
        "Floor",
        "Rectangle",
        "Living room",
        "Hardwood",
        "Wood stain",
        "Leisure",
        "Comfort",
        "Painting",
        "Linens",
        "Drawing",
        "Illustration",
        "studio couch",
        "Outdoor furniture",
        "Room",
        "Font",
        "Pattern",
        "Throw pillow",
        "Drawer",
        "Desk",
        "Coffee table",
        "Picture frame",
        "Dining room",
        "House",
        "Bedroom",
        "Wallpaper",
        "Bedding",
        "Ceiling",
        "Home accessories",
      ],
      objects: [
        {
          tag: "Bed",
          confidence: "0.8861366510391235",
          bl: "(0.46498754620552063, 0.22276608645915985)",
          br: "(0.9359931945800781, 0.22276608645915985)",
          tr: "(0.9359931945800781, 0.8410670757293701)",
          tl: "(0.46498754620552063, 0.8410670757293701)",
          rect: [
            0.46498754620552063, 0.17636357202423666, 0.4710056483745575,
            0.4895079533293551,
          ],
        },
        {
          tag: "Table",
          confidence: "0.8592445850372314",
          bl: "(0.14006252586841583, 0.33594056963920593)",
          br: "(0.3540078401565552, 0.33594056963920593)",
          tr: "(0.3540078401565552, 0.6137327551841736)",
          tl: "(0.14006252586841583, 0.6137327551841736)",
          rect: [
            0.14006252586841583, 0.2659636383219812, 0.21394531428813934,
            0.21992765102560569,
          ],
        },
        {
          tag: "Chair",
          confidence: "0.8008004426956177",
          bl: "(0.002156810136511922, 0.39126113057136536)",
          br: "(0.1712246686220169, 0.39126113057136536)",
          tr: "(0.1712246686220169, 0.8596672415733337)",
          tl: "(0.002156810136511922, 0.8596672415733337)",
          rect: [
            0.002156810136511922, 0.309760842319497, 0.16906785848550498,
            0.3708364060587528,
          ],
        },
        {
          tag: "Chair",
          confidence: "0.6600181460380554",
          bl: "(0.347951740026474, 0.2974742352962494)",
          br: "(0.47696653008461, 0.2974742352962494)",
          tr: "(0.47696653008461, 0.5834335684776306)",
          tl: "(0.347951740026474, 0.5834335684776306)",
          rect: [
            0.347951740026474, 0.23550989989512186, 0.129014790058136,
            0.22639356939451896,
          ],
        },
      ],
    },
  ]);

  const [chosenTagsTotals, setChosenTagTotals] = useState({
    Azure: 1,
    Water: 1,
    Aqua: 1,
    "Electric blue": 1,
    Pattern: 1,
    Font: 1,
    Rectangle: 1,
    Carmine: 1,
  });
  const [apiTagsTotals, setApiTagTotals] = useState({});

  const fetchArtworkForTag = (tag) => {
    const getRandomArtworkForTag = async () => {
      const response = await fetch(`/api/tags/${tag}`);
      return response.json();
    };

    getRandomArtworkForTag().then((data) => {
      const artworkIds = artworks.map((artwork) => artwork.id);
      let artworkIsUnique = false;
      let chosenArtwork = data[Math.floor(Math.random() * data.length)];

      setApiTagTotals({
        ...apiTagsTotals,
        [tag]: data.length,
      });

      if (data.length > 1) {
        while (!artworkIsUnique) {
          if (!artworkIds.includes(parseInt(chosenArtwork.id, 10))) {
            artworkIsUnique = true;

            setChosenTagTotals({
              ...chosenTagsTotals,
              [tag]: chosenTagsTotals[tag] ? chosenTagsTotals[tag] + 1 : 1,
            });

            break;
          }

          chosenArtwork = data[Math.floor(Math.random() * data.length)];
        }
      }

      // Update the chosen artwork
      const lastArtworkIndex = artworks.length - 1;
      const lastArtwork = artworks[lastArtworkIndex];
      const updatedLastArtwork = { ...lastArtwork, chosenTag: tag };
      const updatedArtworks = [
        ...artworks.slice(0, lastArtworkIndex),
        updatedLastArtwork,
        chosenArtwork.source,
      ];
      setArtworks(updatedArtworks);
    });
  };

  const removeLastArtwork = () => {
    // reduce chosenTagsTotals for the tag by 1
    if (
      artworks[artworks.length - 2] &&
      artworks[artworks.length - 2].chosenTag
    ) {
      const chosenTag = artworks[artworks.length - 2].chosenTag;
      setChosenTagTotals({
        ...chosenTagsTotals,
        [chosenTag]: chosenTagsTotals[chosenTag] - 1,
      });
    }
    setArtworks(artworks.slice(0, -1));
  };

  // Current artwork is the last in the array
  const currentArtwork = artworks.at(-1);

  const overlays =
    "objects" in currentArtwork && currentArtwork.objects.length > 0
      ? currentArtwork.objects.map((object) => {
          return {
            id: `${currentArtwork.id}-${object.tag.replace(/[^a-z0-9]/gi, "")}`,
            tag: object.tag,
            rect: object.rect,
            // rect: [
            //   getXandY(object.bl).x,
            //   getXandY(object.bl).y / aspectRatio,
            //   getXandY(object.tr).x - getXandY(object.tl).x,
            //   getXandY(object.tl).y / aspectRatio - getXandY(object.bl).y / aspectRatio,
            // ],
          };
        })
      : [];

  console.log(overlays);

  return (
    <main className="grid grid-cols-4 gap-4 container mx-auto p-4">
      <div className="col-span-full sm:col-span-3">
        <div className="aspect-[16/9]">
          <Viewer
            elementId="viewer"
            iiifUrl={currentArtwork.iiif}
            overlays={overlays}
          />
        </div>

        <h2 className="font-bold text-2xl mt-4">
          <a href={currentArtwork.url} target="_blank" className="underline">
            {currentArtwork.title}
          </a>
        </h2>
        <p className="italic">{currentArtwork.artist}</p>
      </div>
      <div className="col-span-full sm:col-span-1 min-h-[12rem] overflow-y-scroll">
        <h2 className="font-bold text-2xl">Tags</h2>
        <TagsList>
          {currentArtwork.tags.map((tagName) => (
            <Tag
              key={tagName}
              onClick={() => fetchArtworkForTag(tagName)}
              disabled={apiTagsTotals[tagName] == chosenTagsTotals[tagName]}
            >
              {tagName}
            </Tag>
          ))}
        </TagsList>
      </div>
      <div className="col-span-4">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">Your journey</h2>
          <button
            onClick={() => removeLastArtwork()}
            className="p-2 rounded-lg shadow bg-white flex gap-2 disabled:opacity-50 hover:bg-blue-200 transition-colors duration-150"
            disabled={artworks.length <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Undo
          </button>
        </div>

        <ul className="flex overflow-y-scroll py-4">
          {artworks.map((artwork) => (
            <Artwork key={artwork.id} artwork={artwork} />
          ))}
        </ul>
        <div className="hidden js-overlays-container"></div>
        {/* {overlays.map((overlay) => (
          <div key={overlay.id} id={overlay.id} className="border-yellow-300 border-4">{overlay.tag}</div>
        ))} */}
      </div>
    </main>
  );
}
