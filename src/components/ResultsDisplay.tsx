
import { Card } from "@/components/ui/card";
import { Clock, Users, DollarSign } from "lucide-react";

interface ResultsDisplayProps {
  results: {
    effort: number;
    duration: number;
    teamSize: number;
    totalCost: number;
  };
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Resultados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Esfuerzo Estimado</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">{results.effort.toFixed(2)}</p>
          <p className="text-sm text-gray-600">persona-meses</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Duración</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">{results.duration.toFixed(2)}</p>
          <p className="text-sm text-gray-600">meses</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Costo Total Estimado</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {results.totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Interpretación</h4>
        <p className="text-sm text-gray-600">
          Se estima que el proyecto requerirá un esfuerzo de {results.effort.toFixed(2)} persona-meses, 
          con una duración aproximada de {results.duration.toFixed(2)} meses utilizando un equipo de {results.teamSize} desarrolladores. 
          El costo total estimado del proyecto, considerando un incremento anual del 5% en los salarios, 
          será de {results.totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}.
        </p>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
