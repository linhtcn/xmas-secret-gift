import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, Users, Heart, Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResponseData {
  id: string;
  user_type: "friend" | "family";
  responses: Record<string, string>;
  completed_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<ResponseData[]>([]);

  useEffect(() => {
    // Check if already logged in
    const adminSession = localStorage.getItem("admin_session");
    if (adminSession) {
      setIsLoggedIn(true);
      fetchResponses();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data) {
        toast.error("Tên đăng nhập không đúng!");
        setIsLoading(false);
        return;
      }

      if (data.password_hash !== password) {
        toast.error("Mật khẩu không đúng!");
        setIsLoading(false);
        return;
      }

      // Login successful
      localStorage.setItem("admin_session", "true");
      setIsLoggedIn(true);
      toast.success("Đăng nhập thành công! 🎄");
      fetchResponses();
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Có lỗi xảy ra!");
    }

    setIsLoading(false);
  };

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .select("*")
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching responses:", error);
        return;
      }

      setResponses((data || []) as ResponseData[]);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    toast.success("Đã đăng xuất!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-card to-background">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-4 left-4 z-30 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-cream hover:bg-card transition-all duration-300 hover:scale-110"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-full max-w-md">
          <div className="bg-card/70 backdrop-blur-md rounded-3xl p-8 border border-christmas-gold/30">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-full bg-christmas-red/20 mb-4">
                <Lock className="w-8 h-8 text-christmas-red" />
              </div>
              <h1 className="font-christmas text-4xl text-christmas-gold mb-2">
                🎅 Admin Login 🎅
              </h1>
              <p className="text-christmas-cream/60">
                Đăng nhập để xem các câu trả lời
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-christmas-cream/80 mb-2 text-sm">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 rounded-xl bg-muted/50 border border-christmas-gold/20 focus:border-christmas-gold/60 outline-none text-christmas-cream placeholder:text-christmas-cream/40 transition-all"
                  placeholder="Username"
                  required
                />
              </div>

              <div>
                <label className="block text-christmas-cream/80 mb-2 text-sm">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-xl bg-muted/50 border border-christmas-gold/20 focus:border-christmas-gold/60 outline-none text-christmas-cream placeholder:text-christmas-cream/40 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-christmas-red to-christmas-red-dark text-christmas-cream font-christmas text-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang đăng nhập..." : "🎄 Đăng nhập 🎄"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const friendResponses = responses.filter((r) => r.user_type === "friend");
  const familyResponses = responses.filter((r) => r.user_type === "family");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-christmas text-4xl md:text-5xl text-christmas-gold mb-2">
              🎄 Bảng Điều Khiển 🎄
            </h1>
            <p className="text-christmas-cream/60">
              Xem tất cả các câu trả lời từ người chơi
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-xl bg-card border border-christmas-gold/30 text-christmas-cream hover:bg-muted transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Về trang chủ
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-christmas-red/20 border border-christmas-red/30 text-christmas-red hover:bg-christmas-red/30 transition-all flex items-center gap-2"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-christmas-gold/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-christmas-gold/20">
                <Users className="w-6 h-6 text-christmas-gold" />
              </div>
              <div>
                <p className="text-christmas-cream/60 text-sm">Tổng số phản hồi</p>
                <p className="text-3xl font-christmas text-christmas-cream">{responses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-christmas-green/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-christmas-green/20">
                <Users className="w-6 h-6 text-christmas-green-light" />
              </div>
              <div>
                <p className="text-christmas-cream/60 text-sm">Bạn bè</p>
                <p className="text-3xl font-christmas text-christmas-cream">{friendResponses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-christmas-red/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-christmas-red/20">
                <Heart className="w-6 h-6 text-christmas-red" />
              </div>
              <div>
                <p className="text-christmas-cream/60 text-sm">Người thân</p>
                <p className="text-3xl font-christmas text-christmas-cream">{familyResponses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responses List */}
        <div className="space-y-4">
          {responses.length === 0 ? (
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-12 border border-christmas-gold/20 text-center">
              <p className="text-christmas-cream/60 text-xl">
                Chưa có câu trả lời nào 🎄
              </p>
            </div>
          ) : (
            responses.map((response) => (
              <div
                key={response.id}
                className={`bg-card/60 backdrop-blur-sm rounded-2xl p-6 border ${
                  response.user_type === "friend"
                    ? "border-christmas-green/30"
                    : "border-christmas-red/30"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        response.user_type === "friend"
                          ? "bg-christmas-green/20 text-christmas-green-light"
                          : "bg-christmas-red/20 text-christmas-red"
                      }`}
                    >
                      {response.user_type === "friend" ? "👥 Bạn bè" : "💕 Người thân"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-christmas-cream/50 text-sm">
                    <Calendar size={14} />
                    {formatDate(response.completed_at)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(response.responses).map(([key, value]) => (
                    <div key={key} className="bg-muted/30 rounded-xl p-4">
                      <p className="text-christmas-gold text-sm mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-christmas-cream">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
