// import Image from 'next/image'
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { useState } from 'react'

const inter = Inter({ subsets: ["latin"] });

import TagsList from "../components/TagsList";
import Tag from "../components/Tag";
import Artwork from "@/components/Artwork";

const Viewer = dynamic(() => import("../components/Viewer"), { ssr: false });

export default function Home() {
  const [artworks, setArtworks] = useState([
    {
      "id" : 28561,
      "title" : "The Bedroom",
      "artist" : "Vincent van Gogh",
      "url" : "https://www.artic.edu/artworks/28560",
      "iiif" : "https://www.artic.edu/iiif/2/25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e",
      "tags" : [
        "Azure",
        "Water",
        "Aqua",
        "Electric blue",
        "Pattern",
        "Font",
        "Rectangle",
        "Carmine"
      ],
      "chosenTag": "Bed",
    },
    {
      "id" : 28560,
      "title" : "The Bedroom",
      "artist" : "Vincent van Gogh",
      "url" : "https://www.artic.edu/artworks/28560",
      "iiif" : "https://www.artic.edu/iiif/2/e966799b-97ee-1cc6-bd2f-a94b4b8bb8f9",
      "tags" : [
        "Azure",
        "Water",
        "Aqua",
        "Electric blue",
        "Pattern",
        "Font",
        "Rectangle",
        "Carmine"
      ],
      "chosenTag": null,
    }
  ])

  const fetchArtworkForTag = (tag) => {
    const getRandomArtworkForTag = async () => {
      const response = await fetch(`/api/tags/${tag}`);
      return response.json();
    };

    getRandomArtworkForTag().then((data) => {
      alert(data.message);
      // const newArtwork = data.artwork;
      // Update the chosenTag
      const lastArtworkIndex = artworks.length - 1;
      const lastArtwork = artworks[lastArtworkIndex];
      const updatedLastArtwork = { ...lastArtwork, chosenTag: tag };
      const updatedArtworks = [
        ...artworks.slice(0, lastArtworkIndex),
        updatedLastArtwork,
        // newArtwork,
      ];
      setArtworks(updatedArtworks);
    });
  };

  const currentArtwork = artworks.at(-1);
  const pastArtworks = artworks.slice(0, -1);

  return (
    <main className="h-screen grid grid-cols-3 gap-4 container mx-auto p-4">
      <div className="col-span-2">
        <div className="aspect-[16/9]">
          <Viewer
            elementId="viewer"
            iiifUrl={currentArtwork.iiif}
          />
        </div>

        <h2 className="font-bold text-2xl mt-4">
          <a href={currentArtwork.url} target="_blank" className="underline">{currentArtwork.title}</a>
        </h2>
        <p className="italic">{currentArtwork.artist}</p>
      </div>
      <div className="">
        <h2 className="font-bold text-2xl">Tags</h2>
        <TagsList>
          {currentArtwork.tags.map((tagName) => 
            <Tag key={tagName} onClick={() => fetchArtworkForTag(tagName)}>
              {tagName}
            </Tag>
          )}
        </TagsList>
      </div>
      <div className="col-span-3">
        <h2 className="font-bold text-2xl">Your journey</h2>
        <ul className="flex">
          {artworks.map((artwork) => (
            <Artwork key={artwork.id} artwork={artwork} />
          ))}
        </ul>
      </div>
    </main>
  );
}
