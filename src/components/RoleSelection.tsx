import { Gift, Heart, Users } from "lucide-react";

interface RoleSelectionProps {
  onSelect: (role: "friend" | "family") => void;
}

const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
      {/* Main Title */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-christmas text-6xl md:text-8xl text-christmas-gold mb-4 drop-shadow-lg">
          🎄 Linus Claus 🎄
        </h1>
        <p className="text-xl md:text-2xl text-christmas-cream/80 font-body">
          Chào mừng bạn đến với Lễ Giáng Sinh!
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="text-3xl animate-bounce-present" style={{ animationDelay: "0s" }}>🎁</span>
          <span className="text-3xl animate-bounce-present" style={{ animationDelay: "0.2s" }}>⭐</span>
          <span className="text-3xl animate-bounce-present" style={{ animationDelay: "0.4s" }}>🎁</span>
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="font-christmas text-3xl md:text-4xl text-christmas-cream mb-2">
          Bạn là ai nào? 🤔
        </h2>
        <p className="text-christmas-cream/60 text-lg">
          Hãy chọn để bắt đầu cuộc phiêu lưu Giáng Sinh!
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full animate-fade-in" style={{ animationDelay: "0.5s" }}>
        {/* Family Member Card */}
        <button
          onClick={() => onSelect("family")}
          className="group relative p-8 rounded-2xl bg-gradient-to-br from-christmas-red/20 to-christmas-red-dark/30 border-2 border-christmas-red/40 hover:border-christmas-red transition-all duration-500 hover:scale-105 hover:glow-red overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-christmas-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-christmas-red/20 group-hover:bg-christmas-red/30 transition-colors">
              <Heart className="w-12 h-12 text-christmas-red" />
            </div>
            <h3 className="font-christmas text-3xl text-christmas-cream">
              Người Thân
            </h3>
            <p className="text-christmas-cream/70 text-center">
              Là thành viên trong gia đình của mình 💕
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
            🏠
          </div>
        </button>

        {/* Friend Card */}
        <button
          onClick={() => onSelect("friend")}
          className="group relative p-8 rounded-2xl bg-gradient-to-br from-christmas-green/20 to-christmas-green-light/10 border-2 border-christmas-green/40 hover:border-christmas-green-light transition-all duration-500 hover:scale-105 hover:glow-green overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-christmas-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-christmas-green/20 group-hover:bg-christmas-green/30 transition-colors">
              <Users className="w-12 h-12 text-christmas-green-light" />
            </div>
            <h3 className="font-christmas text-3xl text-christmas-cream">
              Bạn Bè
            </h3>
            <p className="text-christmas-cream/70 text-center">
              Là bạn bè thân thiết của mình 🤝
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:opacity-40 transition-opacity">
            🎄
          </div>
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-4xl">
        <span className="animate-float" style={{ animationDelay: "0s" }}>🦌</span>
        <span className="animate-float" style={{ animationDelay: "0.5s" }}>🎅</span>
        <span className="animate-float" style={{ animationDelay: "1s" }}>🦌</span>
      </div>
    </div>
  );
};

export default RoleSelection;
