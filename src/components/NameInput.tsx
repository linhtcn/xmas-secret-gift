import { useState } from "react";
import { User } from "lucide-react";

interface NameInputProps {
  onSubmit: (name: string) => void;
}

const NameInput = ({ onSubmit }: NameInputProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

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

      {/* Name Input Form */}
      <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="bg-card/70 backdrop-blur-md rounded-3xl p-8 border border-christmas-gold/30">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 rounded-full bg-christmas-gold/20 mb-4">
              <User className="w-8 h-8 text-christmas-gold" />
            </div>
            <h2 className="font-christmas text-3xl text-christmas-cream mb-2">
              Bạn tên là gì? 🤔
            </h2>
            <p className="text-christmas-cream/60">
              Nhập tên của bạn để bắt đầu cuộc phiêu lưu!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-muted/50 border border-christmas-gold/20 focus:border-christmas-gold/60 outline-none text-christmas-cream placeholder:text-christmas-cream/40 transition-all text-center text-lg"
              placeholder="Nhập tên của bạn..."
              maxLength={50}
              required
            />

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-christmas-red to-christmas-red-dark text-christmas-cream font-christmas text-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎄 Tiếp tục 🎄
            </button>
          </form>
        </div>
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

export default NameInput;
