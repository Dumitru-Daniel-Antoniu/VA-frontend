import { useState } from 'react';

export default function QuickQuestions({ onQuestionClick }) {
  const [isVisible, setIsVisible] = useState(true);
  
  const questions = [
    "How can I verify my scholar situation?",
    "How can I contact the Faculty secretariat?",
    "What informations should an email to the secretariat contain?",
    "When and how are the taxes paid?",
    "How and where can I pay the taxes?",
    "When are tax-budget transfers made?",
    "In which situation can I be at the end of the academic year?",
    "When are the scolarship lists displayed?",
    "When are social scolarship applications submitted?"
  ];
  
  const handleQuestionClick = (question) => {
    onQuestionClick(question);
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">FiiHelp</h2>
      <div className="w-full grid gap-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-left px-4 py-3 rounded-lg transition-colors duration-200 border border-blue-300"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}