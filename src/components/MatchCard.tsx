import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  category: "Masculino" | "Femenino";
  status?: "Finalizado" | "En vivo" | "Próximo";
}

const MatchCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  time,
  category,
  status = "Próximo",
}: MatchCardProps) => {
  return (
    <Card className="p-3 md:p-3 hover:shadow-lg transition-all duration-300 border-border bg-card animate-scale-in">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <Badge variant={category === "Masculino" ? "default" : "secondary"} className="text-xs">
          {category}
        </Badge>
        <Badge
          variant={
            status === "En vivo"
              ? "destructive"
              : status === "Finalizado"
              ? "outline"
              : "outline"
          }
          className={
            status === "Próximo"
              ? "bg-slate-800 text-white border-slate-800 hover:bg-slate-700 text-xs"
              : "text-xs"
          }
        >
          {status}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2 md:gap-3">
        <div className="flex-1 text-center">
          <p className="font-bold text-sm md:text-base text-foreground">{homeTeam}</p>
        </div>

        <div className="flex items-center gap-2">
          {homeScore !== undefined && awayScore !== undefined ? (
            <>
              <div className="text-xl md:text-2xl font-bold text-primary">{homeScore}</div>
              <div className="text-lg md:text-xl text-muted-foreground">-</div>
              <div className="text-xl md:text-2xl font-bold text-primary">{awayScore}</div>
            </>
          ) : (
            <div className="text-sm md:text-base font-medium text-muted-foreground">vs</div>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="font-bold text-sm md:text-base text-foreground">{awayTeam}</p>
        </div>
      </div>

      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          {date} - {time}
        </p>
      </div>
    </Card>
  );
};

export default MatchCard;
