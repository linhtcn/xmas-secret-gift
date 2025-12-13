import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "choice" | "text";
  options?: string[];
}

const friendQuestions: Question[] = [
  {
    id: "gender",
    question: "Bạn là nam hay nữ?",
    type: "choice",
    options: ["Nữ 👩", "Nam 👨"],
  },
  {
    id: "first_meet",
    question: "Lần đầu mình gặp nhau là khi nào nhỉ?",
    type: "text",
  },
  {
    id: "best_friend",
    question: "Mình có phải là bạn thân không?",
    type: "choice",
    options: ["Cóa 💕", "Khom 😢"],
  },
  {
    id: "wishes",
    question: "Bạn có lời chúc gì cho mình khom?",
    type: "text",
  },
  {
    id: "ready",
    question: "Sẵn sàng nhận quà từ Santa Claus chưa?",
    type: "choice",
    options: ["Rùi 🎁", "Chưa 😅"],
  },
];

const familyQuestions: Question[] = [
  {
    id: "who",
    question: "Là ai đây ta?",
    type: "text",
  },
  {
    id: "preparation",
    question: "Mọi Người đã chuẩn bị gì cho lễ Giáng Sinh chưa?",
    type: "text",
  },
  {
    id: "ready",
    question: "Sẵn sàng nhận quà từ Santa Claus chưa?",
    type: "choice",
    options: ["Rùi 🎁", "Chưa 😅"],
  },
];

interface QuestionnaireProps {
  userType: "friend" | "family";
  onComplete: (responses: Record<string, string>) => void;
  onBack: () => void;
}

const Questionnaire = ({ userType, onComplete, onBack }: QuestionnaireProps) => {
  const questions = userType === "friend" ? friendQuestions : familyQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [textInput, setTextInput] = useState("");

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleChoice = (option: string) => {
    const newResponses = { ...responses, [currentQuestion.id]: option };
    setResponses(newResponses);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newResponses);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    
    const newResponses = { ...responses, [currentQuestion.id]: textInput };
    setResponses(newResponses);
    setTextInput("");
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newResponses);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTextInput(responses[questions[currentIndex - 1].id] || "");
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-muted z-30">
        <div 
          className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back Button */}
      <button
        onClick={handlePrevious}
        className="fixed top-6 left-4 z-30 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 text-christmas-cream hover:bg-card transition-all duration-300 hover:scale-110"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Question Counter */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30">
        <span className="text-christmas-gold font-christmas text-xl">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full">
        {/* Question Card */}
        <div 
          key={currentQuestion.id}
          className="bg-card/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-christmas-gold/20 animate-scale-in"
        >
          {/* Decorative Icons */}
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-2xl animate-twinkle" style={{ animationDelay: "0s" }}>✨</span>
            <span className="text-3xl">🎄</span>
            <span className="text-2xl animate-twinkle" style={{ animationDelay: "0.5s" }}>✨</span>
          </div>

          {/* Question */}
          <h2 className="font-christmas text-3xl md:text-4xl text-christmas-cream text-center mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          {currentQuestion.type === "choice" ? (
            <div className="flex flex-col gap-4">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option)}
                  className="group relative p-5 rounded-2xl bg-gradient-to-r from-muted to-muted/50 border-2 border-christmas-gold/20 hover:border-christmas-gold/60 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-christmas-gold/10 to-christmas-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 font-body text-xl text-christmas-cream group-hover:text-christmas-gold transition-colors">
                    {option}
                  </span>
                  <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-christmas-gold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                className="w-full p-5 rounded-2xl bg-muted/50 border-2 border-christmas-gold/20 focus:border-christmas-gold/60 outline-none text-christmas-cream placeholder:text-christmas-cream/40 font-body text-lg resize-none h-32 transition-all duration-300"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-christmas-red to-christmas-red-dark text-christmas-cream font-christmas text-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                Tiếp tục
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Decorative Footer */}
        <div className="flex justify-center gap-4 mt-8 text-3xl">
          <span className="animate-bounce-present" style={{ animationDelay: "0s" }}>🎁</span>
          <span className="animate-bounce-present" style={{ animationDelay: "0.2s" }}>🌟</span>
          <span className="animate-bounce-present" style={{ animationDelay: "0.4s" }}>🎁</span>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
