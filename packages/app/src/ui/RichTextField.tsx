import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface RichTextFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
}

export function RichTextField({ label, value, onChange }: RichTextFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // Sync external value changes (e.g., import, preset switch)
  useEffect(() => {
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="overflow-hidden rounded-md border border-line-strong bg-white/[0.03] transition-colors focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/30">
        {/* Toolbar */}
        <div className="flex gap-0.5 border-b border-line bg-white/[0.02] px-1.5 py-1">
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            B
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            &bull;
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered list"
          >
            1.
          </ToolbarButton>
        </div>
        {/* Editor */}
        <EditorContent
          editor={editor}
          className="max-w-none px-2.5 py-1.5 text-sm text-ink [&_.ProseMirror]:min-h-15 [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ active, onClick, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
        active ? 'bg-white/[0.12] text-ink' : 'text-muted hover:bg-white/[0.06] hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
