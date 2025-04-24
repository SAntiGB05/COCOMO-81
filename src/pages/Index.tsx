
import CocomoCalculator from "@/components/CocomoCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Calculadora COCOMO 81 Intermedio
        </h1>
        <CocomoCalculator />
      </div>
    </div>
  );
};

export default Index;
