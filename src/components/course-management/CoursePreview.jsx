import { useState } from 'react';
import VideoPlayer from '../common/VideoPlayer';

export default function CoursePreview({ course }) {
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);

  const currentLesson = course?.sections[selectedSection]?.lessons[selectedLesson];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Course Content Sidebar */}
        <div className="lg:col-span-1 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Contenido del Curso</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {course?.sections.map((section, sIndex) => (
              <div key={sIndex} className="border-b border-gray-200">
                <div className="p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {section.lessons.map((lesson, lIndex) => (
                    <button
                      key={lIndex}
                      onClick={() => {
                        setSelectedSection(sIndex);
                        setSelectedLesson(lIndex);
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-50 flex items-center space-x-3 ${
                        selectedSection === sIndex && selectedLesson === lIndex
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {lesson.type === 'video' && (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {lesson.type === 'text' && (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {lesson.type === 'quiz' && (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )}
                      <span>{lesson.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-2 p-6">
          {currentLesson ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h2>
              
              {currentLesson.type === 'video' && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <VideoPlayer url={currentLesson.videoUrl} />
                </div>
              )}

              {currentLesson.type === 'text' && (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              )}

              {currentLesson.type === 'quiz' && (
                <div className="space-y-6">
                  {currentLesson.questions?.map((question, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label className="ml-3 block text-sm font-medium text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">
              Selecciona una lección para comenzar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}