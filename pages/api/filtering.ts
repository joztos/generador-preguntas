import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const filter = async (req: Request): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 3000,
    stream: true,
    n: 1,
  };
  // filter request language
  function onParse(event: ParsedEvent | ReconnectInterval) {
    if (event.type === "event") {
      const data = event.data;
      // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (data === "[DONE]") {
        return;
      }
      try {
        const json = JSON.parse(data);
        const text = json.choices[0].delta?.content || "";
        let counter = 1;
        if (counter < 2 && (text.match(/\n/) || []).length) {
          // this is a prefix character (i.e., "\n\n"), do nothing
          return;
        }
        // const queue = encoder.encode(text);
        counter++;
      } catch (e) {
        // maybe parse error
      }
    }
  }

  // stream response (SSE) from OpenAI may be fragmented into multiple chunks
  // this ensures we properly read chunks and invoke an event for each SSE event stream
  const parser = createParser(onParse);
  // https://web.dev/streams/#asynchronous-iteration
  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default filter;
