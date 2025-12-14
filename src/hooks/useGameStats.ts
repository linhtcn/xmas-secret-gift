import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GameStats {
  fake_count: number;
  real_count: number;
  last_fake_increment: string;
}

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("game_statistics")
      .select("*")
      .single();

    if (!error && data) {
      // Check if we need to increment fake count (every 30 minutes, max 40)
      const lastIncrement = new Date(data.last_fake_increment);
      const now = new Date();
      const minutesSinceLastIncrement = (now.getTime() - lastIncrement.getTime()) / (1000 * 60);
      
      if (minutesSinceLastIncrement >= 30 && data.fake_count < 40) {
        const incrementsNeeded = Math.min(
          Math.floor(minutesSinceLastIncrement / 30),
          40 - data.fake_count
        );
        
        if (incrementsNeeded > 0) {
          const newFakeCount = data.fake_count + incrementsNeeded;
          await supabase
            .from("game_statistics")
            .update({ 
              fake_count: newFakeCount,
              last_fake_increment: now.toISOString()
            })
            .eq("id", data.id);
          
          setStats({ ...data, fake_count: newFakeCount });
        } else {
          setStats(data as GameStats);
        }
      } else {
        setStats(data as GameStats);
      }
    }
    setLoading(false);
  };

  const incrementRealCount = async () => {
    if (!stats) return;
    
    const { data } = await supabase
      .from("game_statistics")
      .select("*")
      .single();
    
    if (data) {
      await supabase
        .from("game_statistics")
        .update({ real_count: data.real_count + 1 })
        .eq("id", data.id);
      
      setStats(prev => prev ? { ...prev, real_count: prev.real_count + 1 } : null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalVisibleCount = stats ? stats.fake_count + stats.real_count : 0;

  return { 
    stats, 
    loading, 
    totalVisibleCount, 
    incrementRealCount,
    refetch: fetchStats 
  };
};
