import React, { useRef } from 'react';
import { Bold, Italic, List, Heading1, Heading2, Code, Link2 } from 'lucide-react';

const RichTextEditor = ({ value, onChange, label, placeholder = "Write notes, policy details, or explanations here..." }) => {
  const textareaRef = useRef(null);

  const insertFormat = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const actions = [
    { icon: Heading1, action: () => insertFormat('# ', '\n'), label: 'H1' },
    { icon: Heading2, action: () => insertFormat('## ', '\n'), label: 'H2' },
    { icon: Bold, action: () => insertFormat('**', '**'), label: 'Bold' },
    { icon: Italic, action: () => insertFormat('*', '*'), label: 'Italic' },
    { icon: List, action: () => insertFormat('- ', '\n'), label: 'Bullet List' },
    { icon: Code, action: () => insertFormat('`', '`'), label: 'Code' },
    { icon: Link2, action: () => insertFormat('[', '](url)'), label: 'Link' },
  ];

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
        {/* Editor Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1.5 shrink-0">
          {actions.map((act, index) => (
            <button
              key={index}
              type="button"
              onClick={act.action}
              className="p-1.5 hover:bg-slate-200/80 active:bg-slate-300/50 rounded-lg text-slate-600 transition-all"
              title={act.label}
            >
              <act.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full px-4 py-3 bg-white text-slate-800 text-sm focus:outline-hidden resize-y min-h-[140px]"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
