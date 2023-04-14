// import Image from 'next/image'
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

import TagsList from "../components/TagsList";
import Tag from "../components/Tag";
import Artwork from "@/components/Artwork";

const Viewer = dynamic(() => import("../components/Viewer"), { ssr: false });

export default function Home() {
  const [artworks, setArtworks] = useState([
    {
      id: 28561,
      title: "The Bedroom",
      artist: "Vincent van Gogh",
      url: "https://www.artic.edu/artworks/28560",
      iiif: "https://www.artic.edu/iiif/2/25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e",
      tags: [
        "Azure",
        "Water",
        "Aqua",
        "Electric blue",
        "Pattern",
        "Font",
        "Rectangle",
        "Carmine",
      ],
      chosenTag: null,
    },
    // {
    //   id: 28560,
    //   title: "The Bedroom",
    //   artist: "Vincent van Gogh",
    //   url: "https://www.artic.edu/artworks/28560",
    //   iiif: "https://www.artic.edu/iiif/2/e966799b-97ee-1cc6-bd2f-a94b4b8bb8f9",
    //   tags: [
    //     "Azure",
    //     "Water",
    //     "Aqua",
    //     "Electric blue",
    //     "Pattern",
    //     "Font",
    //     "Rectangle",
    //     "Carmine",
    //   ],
    //   chosenTag: null,
    // },
    // {
    //   id: 11723,
    //   title: "Woman at Her Toilette",
    //   artist: "Berthe Morisot",
    //   url: "https://www.artic.edu/artworks/11723",
    //   iiif: "https://www.artic.edu/iiif/2/78c80988-6524-cec7-c661-a4c0a706d06f",
    //   tags: [
    //     "Brown",
    //     "Wood",
    //     "Temple",
    //     "Font",
    //     "Artifact",
    //     "Wall",
    //     "Brick",
    //     "Rectangle",
    //     "Pattern",
    //     "Relief",
    //     "Sculpture",
    //     "Ancient history",
    //     "Stone wall",
    //     "Rock",
    //     "Illustration",
    //     "Creative arts",
    //     "History",
    //     "Carving",
    //     "Metal",
    //     "Stone carving",
    //     "Drawing",
    //     "Painting",
    //     "Trunk",
    //     "Still life photography",
    //     "Brickwork",
    //     "Handwriting",
    //     "Archaeological site",
    //     "Still life",
    //   ],
    // },
  ]);

  const fetchArtworkForTag = (tag) => {
    const getRandomArtworkForTag = async () => {
      const response = await fetch(`/api/tags/${tag}`);
      return response.json();
    };

    getRandomArtworkForTag().then((data) => {
      // alert(data.message);
      const chosenArtwork = data[Math.floor(Math.random()*data.length)];

      // const newArtwork = data.artwork;
      // Update the chosenTag
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
    setArtworks(artworks.slice(0, -1));
  }

  console.log(artworks)
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
            <Tag key={tagName} onClick={() => fetchArtworkForTag(tagName)}>
              {tagName}
            </Tag>
          ))}
        </TagsList>
      </div>
      <div className="col-span-4">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">Your journey</h2>
          <button onClick={() => removeLastArtwork()} className="p-2 rounded-lg shadow bg-white flex gap-2 disabled:opacity-50" disabled={artworks.length <= 1}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Undo
          </button>
        </div>
  
        <ul className="flex mt-4 overflow-y-scroll py-4">
          {artworks.map((artwork) => (
            <Artwork key={artwork.id} artwork={artwork} />
          ))}
        </ul>
      </div>
    </main>
  );
}
