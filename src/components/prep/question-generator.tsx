
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface Question {
  id: string;
  question: string;
  answer: string;
  type: string;
  example?: string;
}

interface QuestionGeneratorProps {
  questions: Question[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function QuestionGenerator({ questions, onLoadMore, isLoading, hasMore }: QuestionGeneratorProps) {
  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div key={q.id} className="border-2 border-purple-200/50 dark:border-purple-800/50 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
              {index + 1}. {q.question}
            </h3>
            <span className="ml-4 shrink-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold px-3 py-1 rounded-full text-sm">
              {q.type.charAt(0).toUpperCase() + q.type.slice(1).replace('-', ' ')}
            </span>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">💡 Suggested Answer:</h4>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{q.answer}</p>
            
            {q.example && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 Example:</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{q.example}</p>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading More Questions...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Load More Questions
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
