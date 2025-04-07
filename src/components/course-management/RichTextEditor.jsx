import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }) {
  const [editorValue, setEditorValue] = useState(value || '');

  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image', 'video'
  ];

  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="min-h-[200px]"
      />
      
      <div className="mt-2 text-sm text-gray-500">
        Consejo: Puedes arrastrar y soltar imágenes directamente en el editor
      </div>
    </div>
  );
}