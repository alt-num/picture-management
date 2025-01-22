import { Info } from "lucide-react";

const AboutIcon = () => {
  return (
    <div className="fixed bottom-4 left-4 group">
      {/* About Icon */}
      <div
        className="flex items-center justify-center w-10 h-10 bg-white shadow-md rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
        aria-label="About"
      >
        <Info className="w-6 h-6 text-gray-600" />
      </div>

      {/* Tooltip */}
      <div className="invisible group-hover:visible absolute bottom-12 left-0 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-64 text-sm">
        <p className="font-semibold text-gray-900 mb-2">Team Members:</p>
        <ul className="space-y-1 text-gray-700">
          <li>Ryan James Nervez</li>
          <li>Kenn Henzly Ciar</li>
          <li>Jasmin Darang</li>
          <li>Arvin Negrillo</li>
          <li>Francis William Hermoso</li>
          <li>Lorenz Joshua Campoto</li>
          <li>Marc Rammyr Busa</li>
          <li>Merophel Basilia</li>
          <li>Elizabeth Cadilo</li>
          <li>Rodel Lagramada</li>
          <li>Kyle Braynt Darol</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutIcon;
