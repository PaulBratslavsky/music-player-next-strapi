import { InlineMusicPlayer } from "@/components/custom/InlineMusicPlayer";
import type { StrapiAudioData } from "@/lib/types";
import { PaginationComponent } from "@/components/custom/Pagination";

import { getAllMusicData } from "@/data/loader";
import React from "react";

export async function MusicSection({ page, query } : { readonly page: number, readonly query: string}) {
  
  const data = await getAllMusicData(page, query);
  const totalPages = data.meta.pagination.pageCount;

  const audioFiles = data.data;
  if (!audioFiles) return <p>No items found.</p>;

  console.log("audioFiles", audioFiles);

  return (
    <React.Fragment>
      <div className="container mx-auto grid my-2 sm:grid-cols-1 md:grid-cols-2 gap-4">
        {audioFiles.map((audio: StrapiAudioData) => (
          <InlineMusicPlayer key={audio.id} audio={audio} />
        ))}
      </div>
      <PaginationComponent pageCount={totalPages} />
    </React.Fragment>
  );
}
