"use client";

import { useState } from "react";
import Image from "next/image";
import { CHANNEL_URL, videos } from "@/content/videos";

export function MediaPlayerContent() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const video = videos[current];

  return (
    <div className="space-y-2">
      <div className="bevel-field relative aspect-video w-full bg-screen">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label={`Play: ${video.title}`}
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
              unoptimized
            />
            <span className="btn95 relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-bold group-hover:bg-chrome-light">
              <span aria-hidden="true" className="text-scarlet">
                ▶
              </span>
              Play
            </span>
          </button>
        )}
      </div>

      <p className="font-pixel bevel-thin-down bg-screen px-2 py-1 text-xs text-led">
        {video.title}
      </p>

      <div className="bevel-thin-down bg-white">
        <h3 className="font-pixel border-b border-chrome-dark px-2 py-1 text-xs font-bold">
          Playlist
        </h3>
        <ul>
          {videos.map((v, i) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => {
                  setCurrent(i);
                  setPlaying(false);
                }}
                aria-pressed={i === current}
                className={`flex w-full items-baseline gap-2 px-2 py-1.5 text-left text-sm ${
                  i === current
                    ? "bg-scarlet text-white"
                    : "hover:bg-chrome-light"
                }`}
              >
                <span className="font-pixel text-xs">{i + 1}.</span>
                <span className="flex-1">{v.title}</span>
                <span
                  className={`text-xs ${i === current ? "text-white/80" : "text-neutral-600"}`}
                >
                  {v.date}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-neutral-700">
        Nothing loads from YouTube until you press play (served via
        youtube-nocookie.com). Full channel:{" "}
        <a
          href={CHANNEL_URL}
          className="text-scarlet underline underline-offset-2"
        >
          youtube.com/@cartertull
        </a>
      </p>
    </div>
  );
}
