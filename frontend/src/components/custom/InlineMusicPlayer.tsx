"use client";

import type { StrapiAudioData } from "@/lib/types";

import { useMemo, useCallback, useRef } from "react";
import { PlayCircle, StopCircle } from "lucide-react";

import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { StrapiImage } from "./StrapiImage";

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");



export function InlineMusicPlayer({ audio }: { readonly audio: StrapiAudioData }) {
  const containerRef = useRef(null);


  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 50,
    waveColor: "rgb(236 72 153)",
    progressColor: "rgb(164, 162, 161)",
    barGap: 1.5,
    barWidth: 3,
    barHeight: 0.75,
    barRadius: 3,
    dragToSeek: true,
    barAlign: "bottom",
    url: "http://localhost:1337" + audio.audio.url,
    plugins: useMemo(() => [Timeline.create()], []),
  });

  const onPlayPause = useCallback(
    () => (wavesurfer ? wavesurfer.playPause() : null),
    [wavesurfer]
  );

  return (
    <div className="flex items-center gap-4 p-4">
      <div>
        <StrapiImage
          src={audio.image.url}
          alt="Massive Under Attack"
          width={300}
          height={300}
          className="h-36 w-36 rounded-lg object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col-reverse p-4">
        <div ref={containerRef} className="flex-1" />
        <div className="flex items-center gap-2">
          <div style={{ margin: "1em 0", display: "flex", gap: "1em" }}>
            <button onClick={onPlayPause}>
              {isPlaying ? (
                <StopCircle size={48} className="text-pink-500" />
              ) : (
                <PlayCircle size={48} className="text-pink-500" />
              )}
            </button>
          </div>
          <div>
            <p>{audio.title} <span className="font-semibold text-slate-400">by {audio.artist.name}</span></p>
            <p>{formatTime(currentTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
