"use client";

import { getStrapiURL, cn } from "@/lib/utils";

import { useCallback, useRef, useEffect, useState } from "react";
import { PlayCircle, StopCircle, Loader2 } from "lucide-react";

import WaveSurfer from "wavesurfer.js";
import { StrapiImage } from "./StrapiImage";

export interface AudioPlayerProps {
  id: number;
  documentId: string;
  title: string;
  peaks?: number[] | null;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const strapiBase = getStrapiURL();
  const streamUrl = audio.documentId
    ? `${strapiBase}/api/songs/${audio.documentId}/stream`
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !audioRef.current || !streamUrl) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 50,
      waveColor: "rgb(236 72 153)",
      progressColor: "rgb(164, 162, 161)",
      barGap: 1.5,
      barWidth: 3,
      barHeight: 0.75,
      barRadius: 3,
      dragToSeek: true,
      barAlign: "bottom" as const,
      media: audioRef.current,
      peaks: audio.peaks?.length ? [audio.peaks] : undefined,
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));
    ws.on("loading", (percent) => {
      if (percent !== 100) setLoading(true);
      else setLoading(false);
    });
    ws.on("ready", () => setLoading(false));

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [mounted, streamUrl, audio.peaks]);

  const onPlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const imageStyles = "w-full md:h-36 md:w-36 rounded-lg object-cover";

  return (
    <div className="block md:flex md:items-center gap-4 p-4">
      {/* Hidden audio element for streaming — client only to avoid hydration mismatch */}
      {mounted && streamUrl && (
        <audio ref={audioRef} src={streamUrl} preload="metadata" />
      )}

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

        {audio.image ? (
          <StrapiImage
            src={audio.image.url}
            alt={audio.image.alternativeText || audio.title}
            width={300}
            height={300}
            className={isPlaying ? cn(imageStyles, "opacity-100") : imageStyles}
          />
        ) : (
          <div
            className={cn(
              imageStyles,
              "bg-gray-200 flex items-center justify-center"
            )}
          >
            🎵
          </div>
        )}
      </div>
      <div className="relative flex-1 flex flex-col-reverse p-4">
        <div ref={containerRef} className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 animate-pulse flex items-center justify-center">
              <Loader text="Loading..." />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <button onClick={onPlayPause} disabled={loading}>
              {isPlaying ? (
                <StopCircle
                  size={48}
                  className="text-pink-500 animate-pulse"
                />
              ) : (
                <PlayCircle size={48} className="text-pink-500" />
              )}
            </button>
          </div>
          <div>
            <p>
              {audio.title}{" "}
              <span className="font-semibold text-slate-400">
                by {audio.artist?.name ?? "Unknown Artist"}
              </span>
            </p>
            <p>{formatTime(currentTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
