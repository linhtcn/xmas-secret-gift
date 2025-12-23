import { useEffect, useRef, useState } from "react";
import { Volume2, Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import christmasSong from "@/assets/christmas-song.mp3";

const ChristmasMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(30);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Set up audio and play on first user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume / 100;

    const startPlaying = async () => {
      if (hasInteracted || !audioRef.current) return;
      
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasInteracted(true);
      } catch (error) {
        // Silently fail - user can click play button
      }
    };

    // Listen for any user interaction to start playing automatically
    const interactionEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
    
    const handleInteraction = () => {
      if (!hasInteracted) {
        startPlaying();
      }
    };

    // Add listeners for various interaction types (only once)
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Try to play immediately (might work in some browsers/situations)
    if (audio.readyState >= 2) {
      startPlaying();
    } else {
      audio.addEventListener('canplay', startPlaying, { once: true });
      audio.load();
    }

    return () => {
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
      audio.removeEventListener('canplay', startPlaying);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sync playing state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      // Minimum volume of 5% - never fully silent
      audioRef.current.volume = Math.max(volume, 5) / 100;
    }
  }, [volume, hasInteracted]);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        if (!hasInteracted) {
          setHasInteracted(true);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        autoPlay
        preload="auto"
        src={christmasSong}
      />
      <div 
        className="fixed top-4 right-4 z-50 flex items-center gap-2"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {showVolumeSlider && (
          <div className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-christmas-gold/30 flex items-center gap-2 animate-fade-in">
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              min={5}
              max={100}
              step={1}
              className="w-24"
            />
            <span className="text-christmas-cream text-xs w-8">{volume}%</span>
          </div>
        )}
        <button
          onClick={togglePlayPause}
          className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-gold cursor-pointer hover:bg-card transition-all duration-300 hover:scale-110 glow-gold"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-gold cursor-pointer hover:bg-card transition-all duration-300 hover:scale-110 glow-gold"
          title="Volume control"
        >
          <Volume2 size={24} />
        </button>
      </div>
    </>
  );
};

export default ChristmasMusic;
