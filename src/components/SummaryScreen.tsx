
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';

interface SummaryScreenProps {
  filledState: any;
  onRestart: () => void;
}

const SummaryScreen = ({ filledState, onRestart }: SummaryScreenProps) => {
  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(filledState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'survey-responses.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const surveyData = [
    { question: "Full Name", answer: filledState.q1 || "Not provided" },
    { question: "Email Address", answer: filledState.q2 || "Not provided" },
    { question: "Age", answer: filledState.q3 ? filledState.q3.toString() : "Not provided" },
    { question: "Occupation", answer: filledState.q4 || "Not provided" },
    { question: "Service Satisfaction (1-10)", answer: filledState.q5 ? filledState.q5.toString() : "Not provided" },
    { question: "Additional Comments", answer: filledState.q6 || "Not provided" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Survey Completed Successfully!
            </CardTitle>
            <p className="text-gray-600">
              Here's a summary of your responses
            </p>
          </CardHeader>
        </Card>

        {/* Survey Summary Table */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Survey Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your Answer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surveyData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.question}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.answer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleDownloadJSON}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              
              <Button
                onClick={onRestart}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 font-medium px-6 py-3 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Survey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryScreen;
