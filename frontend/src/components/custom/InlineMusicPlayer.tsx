"use client";

import { getStrapiMedia, cn } from "@/lib/utils";

import { useCallback, useRef, useEffect, useState } from "react";
import { PlayCircle, StopCircle, Loader2 } from "lucide-react";

import { useWavesurfer } from "@wavesurfer/react";
import { StrapiImage } from "./StrapiImage";

export interface AudioPlayerProps {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
  };
  image: {
    id: number;
    url: string;
    alternativeText: string;
  };
  audio: {
    id: number;
    url: string;
  };
}

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-8 w-8 animate-spin text-pink-500" />
      <p>{text}</p>
    </div>
  );
}

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

export function InlineMusicPlayer({
  audio,
}: {
  readonly audio: AudioPlayerProps;
}) {
  const containerRef = useRef(null);
  const strapiUrl = getStrapiMedia(audio.audio.url);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    url: strapiUrl as string,
  });

  const onPlayPause = useCallback(
    () => (wavesurfer ? wavesurfer.playPause() : null),
    [wavesurfer]
  );

  const onLoading = useCallback(
    () =>
      wavesurfer
        ? wavesurfer.on("loading", (number) => {
            if (number !== 100) {
              setLoading(true);
              setProgress(number);
            } else setLoading(false);
          })
        : null,
    [wavesurfer]
  );

  useEffect(() => {
    onLoading();
  }, [wavesurfer]);

  const imageStyles = "w-full md:h-36 md:w-36 rounded-lg object-cover";

  return (
    <div className="block md:flex md:items-center gap-4 p-4">
      <div className="relative">
        <div className="absolute inset-0 w-full h-full lg:hidden">
          <button
            onClick={onPlayPause}
            className="h-full w-full flex items-center justify-center"
            disabled={loading}
          >
            {isPlaying ? (
              <StopCircle
                size={96}
                className="text-white opacity-90 animate-pulse"
              />
            ) : (
              <PlayCircle size={96} className="text-white opacity-20" />
            )}
          </button>
        </div>

        <StrapiImage
          src={audio.image.url}
          alt="Massive Under Attack"
          width={300}
          height={300}
          className={isPlaying ? cn(imageStyles, "opacity-100") : imageStyles}
        />
      </div>
      <div className="relative flex-1 flex flex-col-reverse p-4">
        <div ref={containerRef} className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0  animate-pulse flex items-center justify-center">
              <Loader text={`Loading ${progress}%`} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <button onClick={onPlayPause} disabled={loading}>
              {isPlaying ? (
                <StopCircle size={48} className="text-pink-500 animate-pulse" />
              ) : (
                <PlayCircle size={48} className="text-pink-500" />
              )}
            </button>
          </div>
          <div>
            <p>
              {audio.title}{" "}
              <span className="font-semibold text-slate-400">
                by {audio.artist.name}
              </span>
            </p>
            <p>{formatTime(currentTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
