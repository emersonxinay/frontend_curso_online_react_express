import { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuizTracker({ lessonId, questions, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/lessons/${lessonId}/quiz`, {
        answers,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setResults(response.data);
      setSubmitted(true);
      
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question, qIndex) => (
        <div 
          key={qIndex} 
          className={`bg-white p-6 rounded-lg shadow ${
            submitted ? (
              results?.correctAnswers.includes(qIndex)
                ? 'ring-2 ring-green-500'
                : 'ring-2 ring-red-500'
            ) : ''
          }`}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.question}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((option, oIndex) => (
              <label
                key={oIndex}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  answers[qIndex] === oIndex
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={oIndex}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => handleAnswerSelect(qIndex, oIndex)}
                  disabled={submitted}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{option}</span>
                
                {submitted && (
                  <span className="ml-auto">
                    {results?.correctAnswers[qIndex] === oIndex && (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                )}
              </label>
            ))}
          </div>

          {submitted && results?.correctAnswers[qIndex] !== answers[qIndex] && (
            <div className="mt-4 text-sm text-red-600">
              La respuesta correcta era: {question.options[results?.correctAnswers[qIndex]]}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length !== questions.length}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Respuestas'}
          </button>
        </div>
      )}

      {submitted && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Resultados
          </h3>
          <p className="text-gray-600">
            Respuestas correctas: {results.score} de {questions.length}
          </p>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${(results.score / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}