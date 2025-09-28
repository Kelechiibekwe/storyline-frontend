"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor";
import BarLoaderExample from "@/components/BarLoader";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = use(params);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // if (!mounted) {
  //   return (
  //     <div className="flex flex-col min-h-screen">
  //       <main className="flex-grow container mx-auto px-4 py-4">
  //         <div className="w-full h-[600px] border rounded-xl bg-card flex items-center justify-center">
  //           <div className="text-muted-foreground">Loading editor...</div>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  if (!mounted) {
    return (
      <div className="relative">
        <BarLoaderExample />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-4" id="editor">
        <RichTextEditorDemo
          className="w-full rounded-xl"
          entryId={
            Number.isNaN(parseInt(entryId, 10))
              ? undefined
              : parseInt(entryId, 10)
          }
        />
      </main>
    </div>
  );
}
