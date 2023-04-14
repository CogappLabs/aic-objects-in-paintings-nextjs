// import Image from 'next/image'
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { useState } from 'react'

const inter = Inter({ subsets: ["latin"] });

import TagsList from "../components/TagsList";
import Tag from "../components/Tag";

const Viewer = dynamic(() => import("../components/Viewer"), { ssr: false });

export default function Home() {
  // const [tags, setTags] = useState([
  //   "Azure",
  //   "Water",
  //   "Aqua",
  //   "Electric blue",
  //   "Pattern",
  //   "Font",
  //   "Rectangle",
  //   "Carmine",
  // ]);

  const [journey, setJourney] = useState([
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
      // Update the chosenTag
      const lastJourneyItemIndex = journeys.length - 1;
      const lastJourneyItem = journeys[lastJourneyItemIndex];
      const updatedLastJourneyItem = { ...lastJourneyItem, chosenTag: tag };
      const updatedJourneys = [
        ...journeys.slice(0, lastJourneyItemIndex),
        updatedLastJourneyItem,
      ];
      setJourneys(updatedJourneys);
    });
  };

  const currentArtwork = journey.at(-1);

  return (
    <main className="h-screen grid grid-cols-3 gap-4 container mx-auto px-4">
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
      </div>
    </main>
  );
}
