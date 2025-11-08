import { useState } from 'react';

const templates = [
  {
    id: 'template-1',
    name: 'Modern Professional',
    preview: 'Modern blue theme with clean layout',
    colors: ['#2563eb', '#1e40af']
  },
  {
    id: 'template-2',
    name: 'Classic',
    preview: 'Traditional black and white design',
    colors: ['#000000', '#333333']
  },
  {
    id: 'template-3',
    name: 'Creative',
    preview: 'Modern purple theme',
    colors: ['#7c3aed', '#5b21b6']
  }
];

function TemplateSelector({ selected, onSelect }) {
  return (
    <div 
      className="template-selector mb-4 p-4 rounded-lg backdrop-blur-xl border-2"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <h3 
        className="text-lg font-bold mb-3"
        style={{ color: 'var(--color-text)' }}
      >
        Select Template
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="p-4 border-2 rounded cursor-pointer transition-all"
            style={{
              borderColor: selected === template.id 
                ? 'var(--color-primary)' 
                : 'var(--color-border)',
              backgroundColor: selected === template.id
                ? 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.1)'
                : 'var(--color-background)',
            }}
            onMouseEnter={(e) => {
              if (selected !== template.id) {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== template.id) {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.backgroundColor = 'var(--color-background)';
              }
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: template.colors[0] }}
              ></div>
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: template.colors[1] }}
              ></div>
            </div>
            <h4 
              className="font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {template.name}
            </h4>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {template.preview}
            </p>
            {selected === template.id && (
              <div 
                className="mt-2 font-semibold"
                style={{ color: 'var(--color-primary)' }}
              >
                <i className="fa-solid fa-check"></i> Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;

