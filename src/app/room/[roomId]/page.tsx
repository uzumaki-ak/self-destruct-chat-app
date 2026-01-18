"use client";
import { time } from "console";
import { useParams } from "next/navigation";
import React from "react";

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const Page = () => {
  const params = useParams();
  const roomId = params.roomId as String;

  const [input, settInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [copyText, setCopyText] = React.useState("COPY");
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyText("COPIED");
    setTimeout(() => setCopyText("copy"), 2000);
  };

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between  bg-zinc-900/30">
        <div className="flex items-center gap-4 ">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room id</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500">{roomId}</span>
              <button
                onClick={copyLink}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {copyText}
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex flex-col ">
            <span className="text text-zinc-500 uppercase"> Self Destruct</span>
            <span
              className={`text-small font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60 ? "text-red-600" : "text-amber-400"}`}
            >
              {timeRemaining !== null
                ? formatTimeRemaining(timeRemaining)
                : "--:--"}
            </span>
          </div>
        </div>
        <button className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50">
          <span className="group-hover:animate-pulse">💥</span>
          Destroy Now
        </button>
      </header>
      {/* div containing messages in the room */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin "></div>

      {/* allowing user to write messages  */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex-1 relative group ">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>
            <input
              value={input}
              onChange={(e) => settInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  //send message to backedn
                  // send focus back to input after we press enter
                  inputRef.current?.focus();
                }
              }}
              placeholder="type messages.."
              type="text"
              autoFocus
              className=" w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>
          <button className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            Send nudes
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
