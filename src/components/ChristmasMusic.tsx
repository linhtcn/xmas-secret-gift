import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const ChristmasMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(() => {
          // Autoplay blocked
        });
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    return () => document.removeEventListener("click", handleInteraction);
  }, [hasInteracted, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />
      <div 
        className="fixed top-4 right-4 z-50 flex items-center gap-2"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {showVolumeSlider && hasInteracted && (
          <div className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-christmas-gold/30 flex items-center gap-2 animate-fade-in">
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
            <span className="text-christmas-cream text-xs w-8">{isMuted ? 0 : volume}%</span>
          </div>
        )}
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-gold hover:bg-card transition-all duration-300 hover:scale-110 glow-gold"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>
      {!hasInteracted && (
        <div className="fixed top-4 right-20 z-50 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-cream text-sm animate-pulse">
          🎵 Click anywhere for music
        </div>
      )}
    </>
  );
};

export default ChristmasMusic;
