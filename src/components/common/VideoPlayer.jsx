import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, onProgress, onEnded }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);

  const handleProgress = (state) => {
    setProgress(state.played);
    if (onProgress) {
      onProgress(state);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleEnded = () => {
    setPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  return (
    <div className="relative">
      <div className="relative aspect-w-16 aspect-h-9">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          controls={true}
          onProgress={handleProgress}
          onEnded={handleEnded}
          config={{
            youtube: {
              playerVars: { showinfo: 1 }
            },
            vimeo: {
              playerOptions: { title: true }
            }
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between text-white">
          <button
            onClick={handlePlayPause}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            {playing ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          <div className="flex-1 mx-4">
            <div className="h-1 bg-white/30 rounded-full">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => playerRef.current?.seekTo(1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}