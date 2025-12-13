import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Snowfall from "@/components/Snowfall";
import ChristmasMusic from "@/components/ChristmasMusic";
import RoleSelection from "@/components/RoleSelection";
import Questionnaire from "@/components/Questionnaire";
import GiftReveal from "@/components/GiftReveal";

type GameState = "selection" | "questionnaire" | "gift";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("selection");
  const [userType, setUserType] = useState<"friend" | "family" | null>(null);

  const handleRoleSelect = (role: "friend" | "family") => {
    setUserType(role);
    setGameState("questionnaire");
  };

  const handleQuestionnaireComplete = async (responses: Record<string, string>) => {
    try {
      // Save responses to database
      const { error } = await supabase
        .from("questionnaire_responses")
        .insert({
          user_type: userType,
          responses: responses,
        });

      if (error) {
        console.error("Error saving responses:", error);
        toast.error("Không thể lưu câu trả lời, nhưng vẫn có quà cho bạn!");
      }
    } catch (err) {
      console.error("Error:", err);
    }

    setGameState("gift");
  };

  const handleRestart = () => {
    setGameState("selection");
    setUserType(null);
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
      
      {/* Admin Link */}
      <Link
        to="/admin"
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:bg-card transition-all duration-300 opacity-40 hover:opacity-100"
        title="Admin Login"
      >
        <Lock size={18} className="text-muted-foreground" />
      </Link>

      {/* Game Content */}
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
      
      {gameState === "gift" && (
        <GiftReveal onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;
