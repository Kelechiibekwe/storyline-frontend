import Image from "next/image";
import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor"
// import StackedNotifications from "@/components/stacked-notification"

export default function Home() {
  return (
      <main>
        <div className=" flex items-center justify-center">
          {/* <div className="w-full max-w-3xl h-[600px] flex flex-col"> */}
          <div className="flex-grow h-[200px] container mx-auto px-4 ">
            {/* <RichTextEditorDemo className="w-full flex-grow rounded-xl" /> */}
            <RichTextEditorDemo className=""/>
            {/* <StackedNotifications/> */}
          </div>
          {/* <div className="w-full md:w-80 mt-4 md:mt-0 md:ml-4">
        <EntryHistory entries={entries} onEntryClick={handleEntryClick} />
      </div> */}
        </div>
      </main>
  );
}
