import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Snowflake } from "lucide-react";

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: "heart" | "snowflake";
  speed: number;
}

interface CatchHeartsGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const GAME_DURATION = 15; // seconds
const SPAWN_INTERVAL = 600; // ms

const CatchHeartsGame = ({ onComplete, onBack }: CatchHeartsGameProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [nextId, setNextId] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  // Spawn falling items
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const spawnItem = () => {
      const newItem: FallingItem = {
        id: nextId,
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: -10,
        type: Math.random() > 0.3 ? "heart" : "snowflake",
        speed: Math.random() * 2 + 2, // 2-4 speed
      };
      setNextId((prev) => prev + 1);
      setItems((prev) => [...prev, newItem]);
    };

    const spawner = setInterval(spawnItem, SPAWN_INTERVAL);
    return () => clearInterval(spawner);
  }, [gameStarted, gameEnded, nextId]);

  // Move items down
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const mover = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + item.speed }))
          .filter((item) => item.y < 110) // Remove items that fell off screen
      );
    }, 50);

    return () => clearInterval(mover);
  }, [gameStarted, gameEnded]);

  const handleCatchItem = useCallback((item: FallingItem) => {
    if (gameEnded) return;
    
    const points = item.type === "heart" ? 2 : 1;
    setScore((prev) => prev + points);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }, [gameEnded]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setGameEnded(false);
  };

  const handleContinue = () => {
    onComplete(score);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      {!gameStarted ? (
        // Start screen
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-3xl font-bold text-primary">Mini Game</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Bắt những trái tim và bông tuyết rơi xuống để nhận điểm!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> = 2 điểm
            </span>
            <span className="flex items-center gap-1">
              <Snowflake className="w-4 h-4 text-blue-400" /> = 1 điểm
            </span>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={onBack}>
              Quay lại
            </Button>
            <Button onClick={startGame} size="lg" className="text-lg px-8">
              Bắt đầu!
            </Button>
          </div>
        </div>
      ) : gameEnded ? (
        // End screen
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-primary">Tuyệt vời!</h2>
          <div className="text-6xl font-bold text-primary">{score}</div>
          <p className="text-xl text-muted-foreground">điểm</p>
          <Button onClick={handleContinue} size="lg" className="text-lg px-8">
            Nhận quà 🎁
          </Button>
        </div>
      ) : (
        // Game screen
        <div className="fixed inset-0 z-20">
          {/* Score and Timer */}
          <div className="absolute top-4 left-0 right-0 flex justify-between px-6 z-30">
            <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <span className="text-lg font-bold text-primary">❤️ {score}</span>
            </div>
            <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <span className="text-lg font-bold text-primary">⏱️ {timeLeft}s</span>
            </div>
          </div>

          {/* Game area */}
          <div className="absolute inset-0 overflow-hidden">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCatchItem(item)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 active:scale-90 cursor-pointer z-20"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                }}
              >
                {item.type === "heart" ? (
                  <Heart className="w-10 h-10 text-red-500 fill-red-500 drop-shadow-lg animate-pulse" />
                ) : (
                  <Snowflake className="w-8 h-8 text-blue-400 drop-shadow-lg" />
                )}
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-muted-foreground text-sm">
              Chạm vào trái tim và bông tuyết để bắt!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatchHeartsGame;
