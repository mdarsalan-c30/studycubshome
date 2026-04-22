import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { 
  Bold, Italic, List, ListOrdered, Table as TableIcon, 
  Heading1, Heading2, Quote, Undo, Redo, Code 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogEditor = ({ content, onChange }: any) => {
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Table.configure({ resizable: true }), 
      TableRow, 
      TableHeader, 
      TableCell
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''}><Bold size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''}><Italic size={16} /></Button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : ''}><Heading1 size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : ''}><Heading2 size={16} /></Button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''}><List size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : ''}><ListOrdered size={16} /></Button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : ''}><Quote size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></Button>
        <div className="ml-auto flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></Button>
          <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-10 min-h-[600px] bg-white cursor-text">
        <div className="max-w-3xl mx-auto prose prose-lg prose-orange focus:outline-none min-h-[500px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
