import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useState } from "react";
import { EmojiType } from "@/types";
import CountUp from "react-countup";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function Quote({
  quote,
  searchTermWordSet,
  searchTerm,
  index,
}: {
  quote: EmojiType;
  searchTermWordSet: Set<string>;
  searchTerm: string;
  index: number;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  return (
    <div className="  aspect-square  ">
      <div className="flex flex-col z-40 h-full cursor-default">
        <div className="flex-row flex items-center relative h-full">
          <div className="  flex flex-row absolute  text-gray-600 font-bold  top-0 left-0 p-2 border-r-[1px] font-mono text-xs  border-b-[1px] shrink-0   ">
            {index + 1}. /&nbsp;
            <div className=" flex flex-row  ">
              <div className="group  cursor-pointer   flex flex-row justify-center items-center gap-1   text-center ">
                <span>
                  {quote.distance >= 1 ? (
                    "1.000"
                  ) : (
                    <div>
                      .<CountUp end={quote.distance * 1000} />
                    </div>
                  )}
                </span>
                {/* <ChevronDownIcon className="" height={12} width={12} /> */}
                {/* <div className="absolute text-xs rounded-lg p-2 mt-8 border-[1px] shadow-lg  w-48 z-40 text-center  bg-stone-100 hidden transition-all duration-250 group-hover:block">
                  The score {quote.distance.toFixed(3)} indicates the
                  quote&apos;s relevance to your query: &quot;{searchTerm}
                  &quot;. It&apos;s the added combination of the scores from the
                  keyword search results and the vector search results
                  multiplied by the alpha parameter. &nbsp;
                  <a
                    className="underline"
                    href="https://weaviate.io/blog/hybrid-search-fusion-algorithms#full-example"
                  >
                    Read more about the hybrid search fusion algorithms here
                  </a>
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center items-center w-full">
            <h2 className="text-xl font-semibold  font-serif  py-3">
              <span
                className={`relative hidden sm:inline-block transition-all duration-250 ${
                  false ? "opacity-100" : "opacity-0"
                }`}
              ></span>
              <div className="animate-pop-in sm:text-center text-3xl sm:text-6xl  ">
                {quote.representation}
              </div>
              <span
                className={`relative hidden sm:inline-block transition-all duration-250 ${
                  false ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </h2>
            <div className="flex flex-col justify-between gap-5">
              <p className=" italic text-center self-center">
                {" "}
                {/* {quote.description}{" "} */}
              </p>
            </div>
          </div>
          <button
            className=" self-end  absolute right-0 bottom-0 text-gray-600 hover:bg-gray-200  flex-grow-0   text-sm border-l-[1px] border-t-[1px]  py-2 px-2 "
            onClick={() => {
              copyToClipboard(`${quote.representation}`);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 4000);
            }}
          >
            {copied ? (
              <CheckIcon height={16} width={16} />
            ) : (
              <ClipboardDocumentIcon height={16} width={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
