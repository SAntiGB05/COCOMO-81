
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import ResultsDisplay from './ResultsDisplay';

interface CocomoInputs {
  kloc: number;
  // Atributos del producto
  rely: number;  // Fiabilidad requerida
  data: number;  // Tamaño de la base de datos
  cplx: number;  // Complejidad del producto
  // Atributos de la computadora
  time: number;  // Restricciones del tiempo de ejecución
  stor: number;  // Restricciones del almacenamiento
  virt: number;  // Inestabilidad de la máquina virtual
  turn: number;  // Tiempo de respuesta del computador
  // Atributos del personal
  acap: number;  // Capacidad del analista
  aexp: number;  // Experiencia en la aplicación
  pcap: number;  // Capacidad de los programadores
  vexp: number;  // Experiencia en S.O. utilizado
  lexp: number;  // Experiencia en el lenguaje de prog.
  // Atributos del proyecto
  modp: number;  // Uso de prácticas de programación modernas
  tool: number;  // Uso de herramientas software
  sced: number;  // Restricciones en la duración del proyecto
  developers?: number;
  monthlySalary?: number;
}

const CocomoCalculator = () => {
  const [inputs, setInputs] = useState<CocomoInputs>({
    kloc: 0,
    rely: 1.00,
    data: 1.00,
    cplx: 1.00,
    time: 1.00,
    stor: 1.00,
    virt: 1.00,
    turn: 1.00,
    acap: 1.00,
    aexp: 1.00,
    pcap: 1.00,
    vexp: 1.00,
    lexp: 1.00,
    modp: 1.00,
    tool: 1.00,
    sced: 1.00,
    developers: 4,
    monthlySalary: 0
  });
  
  const [results, setResults] = useState<any>(null);

  const calculateCocomo = () => {
    const a = 2.4;
    const b = 1.05;
    
    // Calcular el multiplicador total
    const M = inputs.rely * inputs.data * inputs.cplx * 
              inputs.time * inputs.stor * inputs.virt * inputs.turn *
              inputs.acap * inputs.aexp * inputs.pcap * inputs.vexp * inputs.lexp *
              inputs.modp * inputs.tool * inputs.sced;
    
    // Calcular esfuerzo
    const effort = a * Math.pow(inputs.kloc, b) * M;
    
    // Calcular duración y tamaño del equipo
    let duration = effort / (inputs.developers || 1);
    let teamSize = inputs.developers || Math.ceil(effort / 12);
    
    // Calcular costo total con incremento anual del 5%
    let totalCost = 0;
    let remainingEffort = effort;
    let years = Math.ceil(duration / 12);
    
    for (let year = 0; year < years; year++) {
      const monthsThisYear = Math.min(12, remainingEffort);
      const salaryThisYear = inputs.monthlySalary! * Math.pow(1.05, year);
      totalCost += salaryThisYear * monthsThisYear * teamSize;
      remainingEffort -= monthsThisYear;
    }

    setResults({
      effort: effort,
      duration: duration,
      teamSize: teamSize,
      totalCost: totalCost
    });
  };

  const renderMultiplierSelect = (name: keyof CocomoInputs, label: string, options: {value: string, label: string}[]) => (
    <div>
      <Label>{label}</Label>
      <Select
        defaultValue="1.00"
        onValueChange={(value) => setInputs({ ...inputs, [name]: Number(value) })}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Seleccionar ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Calculadora COCOMO 81 Intermedio</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="kloc">Tamaño del proyecto (KLOC)</Label>
              <Input
                id="kloc"
                type="number"
                min="0"
                value={inputs.kloc}
                onChange={(e) => setInputs({ ...inputs, kloc: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="developers">Número de desarrolladores</Label>
              <Input
                id="developers"
                type="number"
                min="1"
                value={inputs.developers}
                onChange={(e) => setInputs({ ...inputs, developers: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="salary">Salario mensual por desarrollador</Label>
              <Input
                id="salary"
                type="number"
                min="0"
                value={inputs.monthlySalary}
                onChange={(e) => setInputs({ ...inputs, monthlySalary: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Atributos del producto</h3>
            {renderMultiplierSelect('rely', 'RELY (Fiabilidad requerida)', [
              { value: "0.75", label: "Muy Bajo (0.75)" },
              { value: "0.88", label: "Bajo (0.88)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.15", label: "Alto (1.15)" },
              { value: "1.40", label: "Muy Alto (1.40)" }
            ])}
            {renderMultiplierSelect('data', 'DATA (Tamaño BD)', [
              { value: "0.94", label: "Bajo (0.94)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.08", label: "Alto (1.08)" },
              { value: "1.16", label: "Muy Alto (1.16)" }
            ])}
            {renderMultiplierSelect('cplx', 'CPLX (Complejidad)', [
              { value: "0.70", label: "Muy Bajo (0.70)" },
              { value: "0.85", label: "Bajo (0.85)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.15", label: "Alto (1.15)" },
              { value: "1.30", label: "Muy Alto (1.30)" },
              { value: "1.65", label: "Extra Alto (1.65)" }
            ])}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Atributos de la computadora</h3>
            {renderMultiplierSelect('time', 'TIME (Restricciones de tiempo)', [
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.11", label: "Alto (1.11)" },
              { value: "1.30", label: "Muy Alto (1.30)" },
              { value: "1.66", label: "Extra Alto (1.66)" }
            ])}
            {renderMultiplierSelect('stor', 'STOR (Restricciones de almacenamiento)', [
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.06", label: "Alto (1.06)" },
              { value: "1.21", label: "Muy Alto (1.21)" },
              { value: "1.56", label: "Extra Alto (1.56)" }
            ])}
            {renderMultiplierSelect('virt', 'VIRT (Inestabilidad VM)', [
              { value: "0.87", label: "Bajo (0.87)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.15", label: "Alto (1.15)" },
              { value: "1.30", label: "Muy Alto (1.30)" }
            ])}
            {renderMultiplierSelect('turn', 'TURN (Tiempo de respuesta)', [
              { value: "0.87", label: "Bajo (0.87)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.07", label: "Alto (1.07)" },
              { value: "1.15", label: "Muy Alto (1.15)" }
            ])}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Atributos del personal</h3>
            {renderMultiplierSelect('acap', 'ACAP (Capacidad del analista)', [
              { value: "1.46", label: "Muy Bajo (1.46)" },
              { value: "1.19", label: "Bajo (1.19)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.86", label: "Alto (0.86)" },
              { value: "0.71", label: "Muy Alto (0.71)" }
            ])}
            {renderMultiplierSelect('aexp', 'AEXP (Experiencia Aplicación)', [
              { value: "1.29", label: "Muy Bajo (1.29)" },
              { value: "1.13", label: "Bajo (1.13)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.91", label: "Alto (0.91)" },
              { value: "0.82", label: "Muy Alto (0.82)" }
            ])}
            {renderMultiplierSelect('pcap', 'PCAP (Capacidad programadores)', [
              { value: "1.42", label: "Muy Bajo (1.42)" },
              { value: "1.17", label: "Bajo (1.17)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.86", label: "Alto (0.86)" },
              { value: "0.70", label: "Muy Alto (0.70)" }
            ])}
            {renderMultiplierSelect('vexp', 'VEXP (Experiencia S.O.)', [
              { value: "1.21", label: "Muy Bajo (1.21)" },
              { value: "1.10", label: "Bajo (1.10)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.90", label: "Alto (0.90)" }
            ])}
            {renderMultiplierSelect('lexp', 'LEXP (Experiencia lenguaje)', [
              { value: "1.14", label: "Muy Bajo (1.14)" },
              { value: "1.07", label: "Bajo (1.07)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.95", label: "Alto (0.95)" }
            ])}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Atributos del proyecto</h3>
            {renderMultiplierSelect('modp', 'MODP (Prácticas modernas)', [
              { value: "1.24", label: "Muy Bajo (1.24)" },
              { value: "1.10", label: "Bajo (1.10)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.91", label: "Alto (0.91)" },
              { value: "0.82", label: "Muy Alto (0.82)" }
            ])}
            {renderMultiplierSelect('tool', 'TOOL (Uso de herramientas)', [
              { value: "1.24", label: "Muy Bajo (1.24)" },
              { value: "1.10", label: "Bajo (1.10)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "0.91", label: "Alto (0.91)" },
              { value: "0.83", label: "Muy Alto (0.83)" }
            ])}
            {renderMultiplierSelect('sced', 'SCED (Restricciones de duración)', [
              { value: "1.23", label: "Muy Bajo (1.23)" },
              { value: "1.08", label: "Bajo (1.08)" },
              { value: "1.00", label: "Nominal (1.00)" },
              { value: "1.04", label: "Alto (1.04)" },
              { value: "1.10", label: "Muy Alto (1.10)" }
            ])}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={calculateCocomo}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Calcular
          </Button>
        </div>
      </Card>

      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default CocomoCalculator;

