import { InlineMusicPlayer } from "@/components/custom/InlineMusicPlayer";
import type { StrapiAudioData } from "@/lib/types";
import { PaginationComponent } from "@/components/custom/Pagination";

import { getAllMusicData } from "@/data/loader";
import React from "react";

export default async function MusicSection() {
  const data = await getAllMusicData();

  const audioFiles = data.data;
  if (!audioFiles) return <p>No items found.</p>;
  return (
    <React.Fragment>
      <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {audioFiles.map((audio: StrapiAudioData) => (
          <InlineMusicPlayer key={audio.id} audio={audio} />
        ))}
      </div>
      <PaginationComponent pageCount={10} className="w-full" />
    </React.Fragment>
  );
}
