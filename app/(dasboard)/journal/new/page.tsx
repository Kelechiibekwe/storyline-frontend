import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor";
import { useEffect } from "react";

export default function NewPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-4" id="editor">
        <RichTextEditorDemo className="w-full rounded-xl" isNewJournal={true} />
      </main>
    </div>
  );
}
