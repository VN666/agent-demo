import { createAgent, tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const getWeather = tool(
  async ({ city }: { city: string }) => {
    return {
      city,
      temperature: 35,
      weather: "sunny"
    };
  },
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for")
    })
  }
);

const recommendClothes = tool(
  async ({ temperature }: { temperature: number }) => {
    if (temperature > 30) return "T-shirt and shorts";
    if (temperature > 20) return "Light jacket";
    return "Coat";
  },{
    name: "recommend_clothes",
    description: "Recommend clothes based on temperature",
    schema: z.object({
      temperature: z.number()
    })
  }
);

const model = new ChatOpenAI({
  model: "qwen3.7-max",
  apiKey: process.env.ALIBAILIAN_API_KEY,
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  }
});

const agent = createAgent({
  model,
  tools: [getWeather, recommendClothes]
});

async function main() {
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "我在杭州应该怎么穿衣服"
      }
    ]
  });
  console.log(result);
}

main().catch(console.error);

