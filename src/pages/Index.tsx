import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Snowfall from "@/components/Snowfall";
import ChristmasMusic from "@/components/ChristmasMusic";
import NameInput from "@/components/NameInput";
import RoleSelection from "@/components/RoleSelection";
import Questionnaire from "@/components/Questionnaire";
import GiftReveal from "@/components/GiftReveal";
import VisitorCount from "@/components/VisitorCount";
import { useGameStats } from "@/hooks/useGameStats";

type GameState = "name" | "selection" | "questionnaire" | "gift";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("name");
  const [playerName, setPlayerName] = useState<string>("");
  const [userType, setUserType] = useState<"friend" | "family" | null>(null);
  const [isReady, setIsReady] = useState(true);
  const { totalVisibleCount, loading: statsLoading, incrementRealCount } = useGameStats();

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setGameState("selection");
  };

  const handleRoleSelect = (role: "friend" | "family") => {
    setUserType(role);
    setGameState("questionnaire");
  };

  const handleQuestionnaireComplete = async (responses: Record<string, string>) => {
    // Check if user chose "not ready" (Chưa)
    const readyAnswer = responses.ready || "";
    setIsReady(!readyAnswer.includes("Chưa"));

    try {
      // Save responses to database with player name
      const { error } = await supabase
        .from("questionnaire_responses")
        .insert({
          user_type: userType,
          responses: responses,
          player_name: playerName,
        });

      if (error) {
        console.error("Error saving responses:", error);
        toast.error("Không thể lưu câu trả lời, nhưng vẫn có quà cho bạn!");
      } else {
        // Increment real count on successful completion
        await incrementRealCount();
      }
    } catch (err) {
      console.error("Error:", err);
    }

    setGameState("gift");
  };

  const handleRestart = () => {
    setGameState("name");
    setPlayerName("");
    setUserType(null);
    setIsReady(true);
  };

  const handleBack = () => {
    setGameState("selection");
    setUserType(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      {/* Snowfall Effect */}
      <Snowfall />
      
      {/* Christmas Music */}
      <ChristmasMusic />
      
      {/* Visitor Count */}
      <VisitorCount count={totalVisibleCount} loading={statsLoading} />

      {/* Game Content */}
      {gameState === "name" && (
        <NameInput onSubmit={handleNameSubmit} />
      )}
      
      {gameState === "selection" && (
        <RoleSelection onSelect={handleRoleSelect} />
      )}
      
      {gameState === "questionnaire" && userType && (
        <Questionnaire 
          userType={userType} 
          onComplete={handleQuestionnaireComplete}
          onBack={handleBack}
        />
      )}
      
      {gameState === "gift" && userType && (
        <GiftReveal onRestart={handleRestart} userType={userType} isReady={isReady} />
      )}
    </div>
  );
};

export default Index;
