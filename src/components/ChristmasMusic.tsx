import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const ChristmasMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = 0.3;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, user needs to click
        });
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    return () => document.removeEventListener("click", handleInteraction);
  }, [hasInteracted]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-gold hover:bg-card transition-all duration-300 hover:scale-110 glow-gold"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      {!hasInteracted && (
        <div className="fixed top-4 right-20 z-50 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-cream text-sm animate-pulse">
          🎵 Click anywhere for music
        </div>
      )}
    </>
  );
};

export default ChristmasMusic;
