"use client";

import { findQuotesByArgument } from "@/actions";
import { useState, useTransition } from "react";
import Quote from "./Quote";
import Skeleton from "./Skeleton";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { EmojiType } from "@/types";
import {
  BackspaceIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { examples } from "@/examples";
import Link from "next/link";
import Slider from "./Slider";

export default function QuoteFinder({
  initialSearchTerm,
  initialSearchResults,
  initialHybridSearchCombination,
}: {
  initialSearchTerm?: string;
  initialSearchResults?: EmojiType[];
  initialHybridSearchCombination?: number;
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? "");
  const [quotesAndAuthorsArray, setQuotesAndAuthorsArray] = useState<
    EmojiType[]
  >(initialSearchResults ?? []);

  const wordSet = new Set(searchTerm.split(" "));

  const [isPending, startTransition] = useTransition();

  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const [hybridSearchCombination, setHybridSearchCombination] = useState([
    initialHybridSearchCombination ?? 0.5,
  ]);

  const handleSubmit = async (
    newSearchTerm?: string,
    newHybridSearchCombination?: number
  ) => {
    if ((newSearchTerm ?? searchTerm).length > 0) {
      startTransition(async () => {
        const quotesAndAuthorsArray = await findQuotesByArgument(
          newSearchTerm ?? searchTerm,
          newHybridSearchCombination ?? hybridSearchCombination[0]
        );
        console.log(quotesAndAuthorsArray);

        setQuotesAndAuthorsArray(quotesAndAuthorsArray);
        const encodedSearchTerm = encodeURIComponent(
          newSearchTerm?.trim() ?? searchTerm.trim()
        );
        const encodedHybridSearchCombination = encodeURIComponent(
          newHybridSearchCombination ?? hybridSearchCombination[0]
        );

        console.log(encodedSearchTerm);
        window.history.pushState(
          {},

          "",
          `
          /?hybridSearchCombination=${encodedHybridSearchCombination}
          &search=${encodedSearchTerm}
          
          `
        );
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          handleSubmit();
        }}
        className="flex flex-row gap-2   flex-grow-0 w-auto  max-w-[750px] py-2  "
      >
        <input
          className="w-full    sm:font-bold sm:text-3xl outline-none bg-transparent border-b-2 rounded-none sm:py-3 focus:border-highlight"
          type="text"
          placeholder="🕵️‍♂️ find your favorite emoji 🔥"
          value={searchTerm}
          onChange={(e) => {
            if (searchTerm !== "") {
              setQuotesAndAuthorsArray([]);
            }

            setSearchTerm(e.currentTarget.value);
          }}
        />
        <button
          className="  h-10  self-end border-2 flex flex-row items-center justify-center   hover:scale-105    py-2 px-4 rounded-lg"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setQuotesAndAuthorsArray([]);
            setSearchTerm("");
          }}
        >
          {/* <BackspaceIcon className="h-5 w-5" /> */}❌
        </button>
        <button
          type="submit"
          className={` ${
            isPending ? "animate-pulse" : ""
          } transition-all  h-10  self-end   hover:scale-105     flex  items-center justify-center border-2  text-2xl py-2 px-4 rounded-lg`}
        >
          {/* <MagnifyingGlassIcon className="h-5 w-5" /> */}
          <span className="whitespace-nowrap font-bold text-base">Search</span>
        </button>
      </form>

      <Slider
        value={hybridSearchCombination}
        setValue={setHybridSearchCombination}
        handleSubmit={handleSubmit}
        searchTerm={searchTerm}
      />

      {isPending ? (
        <Skeleton />
      ) : (
        <div className="pb-20">
          {quotesAndAuthorsArray.length > 0 ? (
            <div className="flex flex-row items-center justify-between max-w-[750px] py-5">
              <div className="uppercase text-sm">
                {quotesAndAuthorsArray.length} results
              </div>
              {/* <div>
                <button
                  className="sm:hidden bg-gradient-to-br hover:bg-gray-200 uppercase text-sm   border-[1px] border-gray-300 hover:text-black  py-1 px-2 rounded-lg"
                  onClick={() => {
                    navigator.share(
                      // current url
                      { url: window.location.href }
                    );
                  }}
                >
                  share
                </button>

                <button
                  className="hidden sm:block bg-gradient-to-br hover:bg-gray-200 uppercase text-sm   border-[1px] border-gray-300 hover:text-black  py-1 px-2 rounded-lg"
                  onClick={() => {
                    copyToClipboard(window.location.href);
                  }}
                >
                  copy link to results
                </button>
              </div> */}
            </div>
          ) : (
            <div className="py-5">
              <div className="uppercase text-sm ">Examples</div>
              <div className="flex flex-row gap-3 py-2">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchTerm(example);
                      handleSubmit(example);
                    }}
                    className="group cursor-pointer relative shrink-0 self-start z-10 rounded-lg border-2 px-2 py-1 text-sm hover:bg-gray-200 transition-all"
                  >
                    {example}
                    {/* <div className="absolute inset-x-0 bottom-0 h-2 group-hover:h-6  transition-all bg-highlight -z-10"></div> */}
                  </div>
                ))}
              </div>
            </div>
          )}
          {quotesAndAuthorsArray.length > 0 ? (
            <div className="grid sm:grid-cols-5 grid-cols-3 grid-flow-row auto-rows-min [clip-path:inset(1px_0_0_1px)] *:border-t *:border-l *:border-gray-200 border-[1px]">
              {quotesAndAuthorsArray.map((quoteAndAuthor, index) => (
                <Quote
                  key={quoteAndAuthor.name}
                  searchTermWordSet={wordSet}
                  searchTerm={searchTerm}
                  quote={quoteAndAuthor}
                  index={index}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
