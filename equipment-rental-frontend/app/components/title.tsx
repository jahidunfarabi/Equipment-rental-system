// components/title.tsx
import React from 'react';

// Props interface define kora (TypeScript-er jonno)
interface TitleProps {
  props: {
    title: string;
  };
}

export default function MyTitle({ props }: TitleProps) {
  return (
    <div className="mb-6">
      {/* Browser tab-er title set korbe */}
      <title>{props.title}</title>
      
      {/* Page-e title display korbe (Tailwind style shoho) */}
      <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2">
        {props.title}
      </h2>
    </div>
  );
}