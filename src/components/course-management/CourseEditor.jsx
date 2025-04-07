import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RichTextEditor from './RichTextEditor';

export default function CourseEditor({ course, onSave }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || '',
    category: course?.category || '',
    level: course?.level || 'beginner',
    thumbnail: null,
    previewVideo: course?.previewVideo || ''
  });

  const [sections, setSections] = useState(course?.sections || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('sections', JSON.stringify(sections));

      const response = await axios.post(
        `/api/courses${course ? `/${course.id}` : ''}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      onSave(response.data);
      navigate(`/cursos/${response.data.id}/administrar`);
    } catch (err) {
      setError('Error al guardar el curso. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionAdd = () => {
    setSections([...sections, {
      title: '',
      lessons: []
    }]);
  };

  const handleLessonAdd = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.push({
      title: '',
      type: 'video',
      content: '',
      duration: 0
    });
    setSections(newSections);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica del curso */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Información del Curso</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título del Curso
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(content) => setFormData({...formData, description: content})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Precio ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nivel
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones y lecciones */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Contenido del Curso</h2>
            <button
              type="button"
              onClick={handleSectionAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Añadir Sección
            </button>
          </div>

          {sections.map((section, sIndex) => (
            <div key={sIndex} className="mb-6 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[sIndex].title = e.target.value;
                    setSections(newSections);
                  }}
                  placeholder="Título de la sección"
                  className="text-lg font-medium border-none focus:ring-0 w-full"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleLessonAdd(sIndex)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newSections = sections.filter((_, i) => i !== sIndex);
                      setSections(newSections);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {section.lessons.map((lesson, lIndex) => (
                  <div key={lIndex} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[sIndex].lessons[lIndex].title = e.target.value;
                          setSections(newSections);
                        }}
                        placeholder="Título de la lección"
                        className="text-base border-none focus:ring-0 w-full"
                      />
                      <div className="flex space-x-2">
                        <select
                          value={lesson.type}
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[sIndex].lessons[lIndex].type = e.target.value;
                            setSections(newSections);
                          }}
                          className="text-sm border-gray-300 rounded-md"
                        >
                          <option value="video">Video</option>
                          <option value="text">Texto</option>
                          <option value="quiz">Cuestionario</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newSections = [...sections];
                            newSections[sIndex].lessons = newSections[sIndex].lessons.filter(
                              (_, i) => i !== lIndex
                            );
                            setSections(newSections);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lesson Content Editor */}
                  <div className="mt-4 pl-4">
                    {lesson.type === 'video' && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            URL del Video
                          </label>
                          <input
                            type="url"
                            value={lesson.videoUrl || ''}
                            onChange={(e) => {
                              const newSections = [...sections];
                              newSections[sIndex].lessons[lIndex].videoUrl = e.target.value;
                              setSections(newSections);
                            }}
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Duración (minutos)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={lesson.duration || ''}
                            onChange={(e) => {
                              const newSections = [...sections];
                              newSections[sIndex].lessons[lIndex].duration = parseInt(e.target.value) || 0;
                              setSections(newSections);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  
                    {lesson.type === 'text' && (
                      <div className="mt-2 bg-gray-50 p-4 rounded-md">
                        <RichTextEditor
                          value={lesson.content || ''}
                          onChange={(content) => {
                            const newSections = [...sections];
                            newSections[sIndex].lessons[lIndex].content = content;
                            setSections(newSections);
                          }}
                        />
                      </div>
                    )}
                  
                    {lesson.type === 'quiz' && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-gray-900">Preguntas del Cuestionario</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newSections = [...sections];
                              if (!newSections[sIndex].lessons[lIndex].questions) {
                                newSections[sIndex].lessons[lIndex].questions = [];
                              }
                              newSections[sIndex].lessons[lIndex].questions.push({
                                question: '',
                                options: ['', '', '', ''],
                                correctAnswer: 0
                              });
                              setSections(newSections);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Añadir Pregunta
                          </button>
                        </div>
                  
                        {lesson.questions?.map((question, qIndex) => (
                          <div key={qIndex} className="border rounded-md p-4">
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[sIndex].lessons[lIndex].questions[qIndex].question = e.target.value;
                                setSections(newSections);
                              }}
                              placeholder="Pregunta"
                              className="block w-full border-gray-300 rounded-md mb-4"
                            />
                            
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2 mb-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={question.correctAnswer === oIndex}
                                  onChange={() => {
                                    const newSections = [...sections];
                                    newSections[sIndex].lessons[lIndex].questions[qIndex].correctAnswer = oIndex;
                                    setSections(newSections);
                                  }}
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[sIndex].lessons[lIndex].questions[qIndex].options[oIndex] = e.target.value;
                                    setSections(newSections);
                                  }}
                                  placeholder={`Opción ${oIndex + 1}`}
                                  className="block w-full border-gray-300 rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Curso'}
          </button>
        </div>
      </form>
    </div>
  );
}