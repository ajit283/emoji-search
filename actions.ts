"use server";

import weaviate from "weaviate-client";
import { CohereClient } from "cohere-ai";
import { EmojiType } from "./types";
import { kv } from "@vercel/kv";

const client = await weaviate.connectToWCS(process.env.WCS_URL!!, {
  authCredentials: new weaviate.ApiKey(process.env.WCS_API_KEY!!),
  headers: {
    "X-OpenAI-Api-Key": process.env.OPENAI_APIKEY!!,
  },
});

const cohere = new CohereClient({
  token: process.env.COHERE_APIKEY!!,
});

export async function findQuotesByArgument(searchTerm: string, alpha: number) {
  // const cachedResult = await kv.get<EmojiType[]>(searchTerm + alpha.toString());

  // if (cachedResult) {
  //   return cachedResult;
  // }

  const collection = await client.collections.get<Omit<EmojiType, "distance">>(
    "Emojis"
  );

  const { objects } = await collection.query.hybrid(searchTerm, {
    limit: 50,
    alpha: alpha,
    returnMetadata: ["score", "explainScore"],
  });

  let quotesAndAuthorsArray: EmojiType[] = objects.map((quote) => ({
    ...quote.properties,
    distance: quote.metadata?.score!!,
  }));

  quotesAndAuthorsArray = quotesAndAuthorsArray.filter((quote, index) => {
    return (
      quotesAndAuthorsArray.findIndex(
        (q) => q.representation === quote.representation
      ) === index
    );
  });

  const rerankResults = await cohere.rerank({
    documents: quotesAndAuthorsArray.map((quote) => ({
      text: quote.name,
      ...quote,
    })),
    query: searchTerm,
    topN: 30,
    model: "rerank-multilingual-v3.0",
  });

  const rerankedQuotesAndAuthorsArray = rerankResults.results.map(
    (result) => quotesAndAuthorsArray[result.index]
  );

  // const rerankedQuotesAndAuthorsArray = quotesAndAuthorsArray;

  console.log(rerankedQuotesAndAuthorsArray.map((q) => q.representation));
  // await kv.set(
  //   searchTerm + alpha.toString(),
  //   JSON.stringify(rerankedQuotesAndAuthorsArray)
  // );

  return rerankedQuotesAndAuthorsArray;
}

const filterDuplicates = (quotes: EmojiType[]) => {
  const filteredQuotes = quotes.filter((quote, index) => {
    return (
      quotes.findIndex((q) => q.representation === quote.representation) ===
      index
    );
  });

  return filteredQuotes;
};
