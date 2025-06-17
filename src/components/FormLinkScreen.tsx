
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface FormLinkScreenProps {
  onFormSubmit: (formLink: string) => void;
}

const FormLinkScreen = ({ onFormSubmit }: FormLinkScreenProps) => {
  const [formLink, setFormLink] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formLink && consent) {
      onFormSubmit(formLink);
    }
  };

  const isValidForm = formLink.includes('docs.google.com/forms') || formLink.includes('forms.gle');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Survey Chat Assistant
          </CardTitle>
          <p className="text-gray-600">
            Fill out Google Forms through intelligent conversations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="formLink" className="text-sm font-medium text-gray-700">
                Google Forms Link
              </label>
              <Input
                id="formLink"
                type="url"
                placeholder="https://docs.google.com/forms/..."
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
                required
              />
              {formLink && !isValidForm && (
                <p className="text-sm text-amber-600">
                  Please enter a valid Google Forms link
                </p>
              )}
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                I allow the app to read my form data for the purpose of assisting me in filling out the survey
              </label>
            </div>

            <Button
              type="submit"
              disabled={!formLink || !consent || !isValidForm}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-white font-medium py-3"
            >
              Start Survey Assistant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormLinkScreen;
