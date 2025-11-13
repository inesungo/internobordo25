import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Standing } from '@/lib/types';

interface TablaPosicionesProps {
  standings: Standing[];
}

export default function TablaPosiciones({ standings }: TablaPosicionesProps) {
  return (
    <div className="overflow-x-auto -mx-3 md:mx-0">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 md:w-16 text-xs md:text-sm py-2 md:py-3">Pos</TableHead>
            <TableHead className="text-xs md:text-sm py-2 md:py-3">Equipo</TableHead>
            <TableHead className="text-center text-xs md:text-sm py-2 md:py-3">PJ</TableHead>
            <TableHead className="text-center text-xs md:text-sm py-2 md:py-3">PG</TableHead>
            <TableHead className="text-center text-xs md:text-sm py-2 md:py-3">PE</TableHead>
            <TableHead className="text-center text-xs md:text-sm py-2 md:py-3">PP</TableHead>
            <TableHead className="text-center text-xs md:text-sm py-2 md:py-3">GF</TableHead>
            <TableHead className="text-center text-xs md:text-sm py-2 md:py-3">GC</TableHead>
            <TableHead className="text-center font-bold text-xs md:text-sm py-2 md:py-3">PTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team, index) => (
            <TableRow key={team.equipo_id} className="hover:bg-muted/50">
              <TableCell className="font-bold text-primary text-xs md:text-sm py-2 md:py-3">{index + 1}</TableCell>
              <TableCell className="font-semibold text-xs md:text-sm py-2 md:py-3">{team.nombre}</TableCell>
              <TableCell className="text-center text-xs md:text-sm py-2 md:py-3">{team.PJ}</TableCell>
              <TableCell className="text-center text-xs md:text-sm py-2 md:py-3">{team.PG}</TableCell>
              <TableCell className="text-center text-xs md:text-sm py-2 md:py-3">{team.PE}</TableCell>
              <TableCell className="text-center text-xs md:text-sm py-2 md:py-3">{team.PP}</TableCell>
              <TableCell className="text-center text-xs md:text-sm py-2 md:py-3">{team.GF}</TableCell>
              <TableCell className="text-center text-xs md:text-sm py-2 md:py-3">{team.GC}</TableCell>
              <TableCell className="text-center font-bold text-primary text-xs md:text-sm py-2 md:py-3">{team.Pts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


