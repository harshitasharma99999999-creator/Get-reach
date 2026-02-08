
import React from 'react';
import { Target, Search, MapPin, List } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-indigo-600" />,
      title: "Enter your URL",
      desc: "Paste your product or app URL. Our AI understands what you build and who it's for."
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      title: "We find your customer profile",
      desc: "We identify the exact job titles, industries, and pain points of your ideal early adopters."
    },
    {
      icon: <MapPin className="w-8 h-8 text-indigo-600" />,
      title: "We map where they hang out",
      desc: "We scan subreddits, LinkedIn groups, forums, and X to find where those people are already active."
    },
    {
      icon: <List className="w-8 h-8 text-indigo-600" />,
      title: "You get exact places to reach them",
      desc: "Get a clear list of platforms and communities with links — so you can market exactly where your customers are."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-xl text-gray-600">Find where your ideal customers are. Reach them there.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-indigo-50 z-0" />
              )}
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
