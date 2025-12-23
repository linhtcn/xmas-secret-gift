import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface GiftRevealProps {
  onRestart: () => void;
  userType: "friend" | "family";
  isReady: boolean;
  gameScore: number;
  playerName: string;
}

const GiftReveal = ({ onRestart, userType, isReady, gameScore, playerName }: GiftRevealProps) => {
  const [stage, setStage] = useState<"intro" | "reveal" | "message">("intro");

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#e53935", "#43a047", "#ffd700", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#e53935", "#43a047", "#ffd700", "#ffffff"],
      });
    }, 100);

    // Progress through stages
    setTimeout(() => setStage("reveal"), 1500);
    setTimeout(() => setStage("message"), 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Christmas Trees */}
        <div className="absolute bottom-0 left-8 text-8xl md:text-9xl opacity-30 animate-float" style={{ animationDelay: "0s" }}>
          🎄
        </div>
        <div className="absolute bottom-0 right-8 text-8xl md:text-9xl opacity-30 animate-float" style={{ animationDelay: "1s" }}>
          🎄
        </div>
        
        {/* Floating Presents */}
        <div className="absolute top-1/4 left-1/4 text-5xl animate-bounce-present" style={{ animationDelay: "0s" }}>
          🎁
        </div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce-present" style={{ animationDelay: "0.5s" }}>
          🎁
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-6xl animate-bounce-present" style={{ animationDelay: "1s" }}>
          🎁
        </div>
        <div className="absolute top-1/2 right-1/3 text-5xl animate-bounce-present" style={{ animationDelay: "1.5s" }}>
          🎁
        </div>

        {/* Stars */}
        <div className="absolute top-16 left-1/4 text-3xl animate-twinkle" style={{ animationDelay: "0s" }}>⭐</div>
        <div className="absolute top-24 right-1/4 text-2xl animate-twinkle" style={{ animationDelay: "0.3s" }}>✨</div>
        <div className="absolute top-32 left-1/2 text-4xl animate-twinkle" style={{ animationDelay: "0.6s" }}>🌟</div>
        <div className="absolute top-20 right-1/3 text-2xl animate-twinkle" style={{ animationDelay: "0.9s" }}>✨</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Santa */}
        <div 
          className={`text-9xl md:text-[12rem] mb-8 transition-all duration-1000 ${
            stage === "intro" ? "scale-0 rotate-180" : "scale-100 rotate-0"
          }`}
        >
          🎅
        </div>

        {/* Title */}
        <h1 
          className={`font-christmas text-5xl md:text-7xl text-christmas-gold mb-6 transition-all duration-700 ${
            stage === "message" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          🎄 Chúc Mừng Giáng Sinh! 🎄
        </h1>

        {/* Message Box */}
        <div 
          className={`bg-card/70 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-christmas-gold/40 transition-all duration-700 delay-300 ${
            stage === "message" ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="flex justify-center gap-4 mb-6 text-4xl">
            <span className="animate-bounce-present" style={{ animationDelay: "0s" }}>🎁</span>
            <span className="animate-bounce-present" style={{ animationDelay: "0.2s" }}>🎄</span>
            <span className="animate-bounce-present" style={{ animationDelay: "0.4s" }}>🎁</span>
          </div>

          <p className="text-xl md:text-2xl text-christmas-cream leading-relaxed mb-6">
            {isReady ? (
              <>
                Cảm ơn bạn đã tham gia trò chơi! 
                <br />
                <span className="text-christmas-gold">Santa Claus</span> gửi tặng bạn món quà đặc biệt:
              </>
            ) : (
              <>
                <span className="text-christmas-gold text-3xl font-christmas">Không sẵn sàng cũng phải nhận! 😂</span>
                <br />
                <span className="text-christmas-gold">Santa Claus</span> vẫn gửi quà cho bạn:
              </>
            )}
          </p>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-christmas-red/20 to-christmas-green/20 border border-christmas-gold/30">
            <p className="font-christmas text-3xl md:text-4xl text-christmas-gold animate-pulse-glow inline-block">
              ✨ {gameScore} trái tim từ Linh ✨
            </p>
            <p className="text-christmas-cream/80 mt-4 text-lg">
              {userType === "friend" ? (
                <>
                  {playerName && <span className="text-christmas-gold font-semibold">{playerName}</span>}
                  {playerName ? ", c" : "C"}húc bạn và gia đình một mùa Giáng Sinh ấm áp, 
                  <br />
                  tràn đầy yêu thương và hạnh phúc! 🎄❤️
                </>
              ) : (
                <>
                  Cảm ơn {playerName || "gia đình"} đã luôn yêu thương và ủng hộ!
                  <br />
                  Chúc cả nhà mình Giáng Sinh thật vui vẻ và ấm cúng! 🏠💕
                </>
              )}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-8 text-3xl">
            <span className="animate-twinkle" style={{ animationDelay: "0s" }}>⭐</span>
            <span className="animate-twinkle" style={{ animationDelay: "0.2s" }}>✨</span>
            <span className="animate-twinkle" style={{ animationDelay: "0.4s" }}>🌟</span>
            <span className="animate-twinkle" style={{ animationDelay: "0.6s" }}>✨</span>
            <span className="animate-twinkle" style={{ animationDelay: "0.8s" }}>⭐</span>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className={`mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-christmas-red to-christmas-red-dark text-christmas-cream font-christmas text-2xl hover:scale-105 transition-all duration-300 glow-red ${
            stage === "message" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          🎁 Chơi Lại 🎁
        </button>
      </div>

      {/* Bottom Decorations */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 text-5xl">
        <span className="animate-float" style={{ animationDelay: "0s" }}>🦌</span>
        <span className="animate-float" style={{ animationDelay: "0.5s" }}>🛷</span>
        <span className="animate-float" style={{ animationDelay: "1s" }}>🦌</span>
      </div>
    </div>
  );
};

export default GiftReveal;
