import weaviate from "weaviate-client";
import { parse } from "csv-parse/sync";
import fs from "fs";
import OpenAI from "openai";

import { EmojiType } from "./types";
import { group } from "console";

const client = await weaviate.connectToWCS(process.env.WCS_URL!!, {
  authCredentials: new weaviate.ApiKey(process.env.WCS_API_KEY!!),
  headers: {
    "X-OpenAI-Api-Key": process.env.OPENAI_APIKEY!!,
  },
});

if (await client.collections.exists("Emojis")) {
  await client.collections.delete("Emojis");
}

const emojisCollection = await client.collections.create({
  name: "Emojis",
  properties: [
    // Group,Subgroup,CodePoint,Status,Representation,Name,Section
    {
      name: "group",
      dataType: weaviate.configure.dataType.TEXT,
    },
    {
      name: "subgroup",
      dataType: weaviate.configure.dataType.TEXT,
    },
    {
      name: "codepoint",
      dataType: weaviate.configure.dataType.TEXT,
    },
    {
      name: "status",
      dataType: weaviate.configure.dataType.TEXT,
      description: "The status of the emoji",
    },
    {
      name: "representation",
      dataType: weaviate.configure.dataType.TEXT,
      description: "The representation of the emoji",
    },
    {
      name: "name",
      dataType: weaviate.configure.dataType.TEXT,
      description: "The name of the emoji",
    },
    {
      name: "section",
      dataType: weaviate.configure.dataType.TEXT,
      description: "The section of the emoji",
    },
  ],
  vectorizer: weaviate.configure.vectorizer.text2VecOpenAI(),
});

const emojisDataset: string[] = parse(fs.readFileSync("emojis.csv", "utf8"));

console.log(emojisDataset);

const representationsWithoutSkinTone = new Set<string>();

function removeEmojiSkinTone(text: string): string {
  // Regular expression to match emoji skin tone modifiers
  const skinToneModifierRegex = /[\u{1F3FB}-\u{1F3FF}]/gu;

  // Replace skin tone modifiers with empty string
  return text.replace(skinToneModifierRegex, "");
}

const openai = new OpenAI({
  apiKey: process.env["OPENAI_APIKEY"], // This is the default and can be omitted
});

async function getDescriptionFromChatGpt(text: string): Promise<string> {
  const prompt = `Write about the different ways in which people might use the following emoji: ${text}`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const description = response.choices[0].message.content;

  return description!!;
}

emojisDataset.forEach(async (emoji) => {
  const emojiWithoutSkinTone = removeEmojiSkinTone(emoji[4]);

  if (representationsWithoutSkinTone.has(emojiWithoutSkinTone)) {
    return;
  }

  console.log(emojiWithoutSkinTone);

  representationsWithoutSkinTone.add(emojiWithoutSkinTone);

  const properties = {
    group: emoji[0],
    subgroup: emoji[1],
    codepoint: emoji[2],
    status: emoji[3],
    representation: emojiWithoutSkinTone,
    name: emoji[5],
    section: emoji[6],
    description: await getDescriptionFromChatGpt(emojiWithoutSkinTone),
  };
  await emojisCollection.data.insert(properties);
});

// const emojisCollection = await client.collections.get<EmojiType>("Emojis");

// console.log(await emojisCollection.metrics.aggregate.length);
