// import Image from 'next/image'
import dynamic from "next/dynamic";
import { useState } from "react";

import Artwork from "../components/Artwork";
import Tag from "../components/Tag";
import TagsList from "../components/TagsList";

const Viewer = dynamic(() => import("../components/Viewer"), { ssr: false });

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

  return (
    <main className="grid grid-cols-4 gap-4 container mx-auto p-4">
      <div className="col-span-3">
        <div className="aspect-[16/9]">
          <Viewer elementId="viewer" iiifUrl={currentArtwork.iiif} />
        </div>

        <h2 className="font-bold text-2xl mt-4">
          <a href={currentArtwork.url} target="_blank" className="underline">
            {currentArtwork.title}
          </a>
        </h2>
        <p className="italic">{currentArtwork.artist}</p>
      </div>
      <div className="col-span-1 overflow-y-scroll">
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
      </div>
    </main>
  );
}
