
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2 } from 'lucide-react';

interface UserInputProps {
  questions: string[];
  answers: string[];
  onAnswersChange: (answers: string[]) => void;
  onSubmit: (answers: string[]) => void;
  isProcessing: boolean;
}

const UserInput = ({ questions, answers, onAnswersChange, onSubmit, isProcessing }: UserInputProps) => {
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    onAnswersChange(newAnswers);
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const allAnswered = answers.every(answer => answer.trim() !== '');

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Answers</h3>
          
          {questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {index + 1}. {question}
              </label>
              <Textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[80px] resize-none transition-all focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isProcessing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Submit Answers
                  <ArrowUp className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {!allAnswered && (
            <p className="text-sm text-amber-600 text-center">
              Please answer all questions before submitting
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInput;
