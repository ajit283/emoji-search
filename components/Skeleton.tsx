import { set } from "cohere-ai/core/schemas";
import { useState, useEffect } from "react";

export default function Skeleton() {
  // just random unrelated emojis for now
  const emojis = [
    "👨‍💻",
    "🚀",
    "👨",
    "👩‍💻",
    "🤖",
    "🧠",
    "📚",
    "💻",
    "🔭",
    "📖",
    "💡",
    "🔬",
    "🎨",
    "🎤",
    "🏃",
    "🏄",
    "🌈",
    "🌊",
    "🌎",
    "🌏",
    "🌐",
    "🌑",
    "🚨",
    "🚧",
    "🚥",
    "🚩",
    "🚦",
    "🚪",
    "🚬",
    "🚰",
    "🚮",
    "🚭",
    "🚷",
    "🚶",
    "🚹",
    "🚺",
    "🚻",
  ];

  const [chosenEmojis, setChosenEmojis] = useState<string[]>([
    "🌑",
    "🚨",
    "🚧",
    "🚥",
    "🚩",
    "🚦",
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChosenEmojis((prev) => {
        const newEmojis = [
          ...prev,
          emojis[Math.floor(Math.random() * emojis.length)],
        ];
        return newEmojis.length > 5 ? newEmojis.slice(1) : newEmojis;
      });
    }, 100); // increased interval for performance

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [emojis]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 mt-24  text-3xl sm:text-6xl  grid-flow-row auto-rows-min [clip-path:inset(1px_0_0_1px)] *:border-t *:border-l *:border-gray-200 border-[1px]">
      <div className="aspect-square flex flex-col justify-center items-center ">
        {chosenEmojis[0]}
      </div>
      <div className="aspect-square flex flex-col justify-center items-center ">
        {chosenEmojis[1]}
      </div>
      <div className="aspect-square flex flex-col justify-center items-center ">
        {chosenEmojis[2]}
      </div>
      <div className="aspect-square  flex-col justify-center items-center hidden sm:flex ">
        {chosenEmojis[3]}
      </div>
      <div className="aspect-square  flex-col justify-center items-center hidden sm:flex ">
        {chosenEmojis[4]}
      </div>
    </div>
  );
}
