import { Users } from "lucide-react";

interface VisitorCountProps {
  count: number;
  loading?: boolean;
}

const VisitorCount = ({ count, loading }: VisitorCountProps) => {
  return (
    <div className="fixed top-4 left-4 z-50 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-christmas-gold/30 flex items-center gap-2">
      <Users size={18} className="text-christmas-gold" />
      <span className="text-christmas-cream text-sm">
        {loading ? "..." : `${count} người đã tham gia`}
      </span>
    </div>
  );
};

export default VisitorCount;
