const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";
const ANTHROPIC_VERSION = "2023-06-01";

export class AiError extends Error {}

interface AnthropicTextBlock {
  type: "text";
  text: string;
}

interface AnthropicToolUseBlock {
  type: "tool_use";
  name: string;
  input: unknown;
}

type AnthropicContentBlock = AnthropicTextBlock | AnthropicToolUseBlock | { type: string };

interface AnthropicMessageResponse {
  content: AnthropicContentBlock[];
}

async function callAnthropic(apiKey: string, body: Record<string, unknown>): Promise<AnthropicMessageResponse> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AiError("Kon geen verbinding maken met Anthropic. Controleer je internetverbinding.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new AiError("Ongeldige API key. Controleer je key bij Instellingen.");
    }
    if (response.status === 429) {
      throw new AiError("Te veel verzoeken of onvoldoende tegoed bij Anthropic. Probeer het straks opnieuw.");
    }
    const text = await response.text().catch(() => "");
    throw new AiError(`Anthropic gaf een fout terug (${response.status}). ${text.slice(0, 200)}`);
  }

  return response.json() as Promise<AnthropicMessageResponse>;
}

export interface GeneratedFlashcard {
  front: string;
  back: string;
}

interface FlashcardsToolInput {
  cards: unknown;
}

export async function generateFlashcards(
  apiKey: string,
  subjectName: string,
  topic: string,
  count: number,
): Promise<GeneratedFlashcard[]> {
  const data = await callAnthropic(apiKey, {
    model: MODEL,
    max_tokens: 2048,
    system:
      "Je bent een studieassistent voor een Nederlandse gymnasiumleerling. " +
      "Maak korte, heldere flashcards (vraag/antwoord) in het Nederlands, op gymnasiumniveau, " +
      "over het opgegeven onderwerp binnen het vak. Antwoorden zijn bondig (max 2 zinnen). " +
      "Zorg dat de kaarten verschillende deelaspecten van het onderwerp dekken, geen herhaling.",
    messages: [
      {
        role: "user",
        content: `Vak: ${subjectName}\nOnderwerp: ${topic}\nMaak precies ${count} flashcards.`,
      },
    ],
    tools: [
      {
        name: "return_flashcards",
        description: "Geef de gegenereerde flashcards terug",
        input_schema: {
          type: "object",
          properties: {
            cards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  front: { type: "string", description: "De vraag of term (voorkant)" },
                  back: { type: "string", description: "Het antwoord of de betekenis (achterkant)" },
                },
                required: ["front", "back"],
              },
            },
          },
          required: ["cards"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "return_flashcards" },
  });

  const toolUse = data.content.find((block): block is AnthropicToolUseBlock => block.type === "tool_use");
  const cards = (toolUse?.input as FlashcardsToolInput | undefined)?.cards;

  if (!Array.isArray(cards)) {
    throw new AiError("Kon geen flashcards genereren. Probeer het opnieuw.");
  }

  const parsed = cards.filter(
    (c): c is GeneratedFlashcard =>
      !!c && typeof c === "object" && typeof c.front === "string" && typeof c.back === "string",
  );

  if (parsed.length === 0) {
    throw new AiError("Kon geen bruikbare flashcards genereren. Probeer een ander onderwerp.");
  }

  return parsed.slice(0, count);
}

export async function summarizePhoto(
  apiKey: string,
  subjectName: string,
  imageBase64: string,
  mediaType: string,
): Promise<string> {
  const data = await callAnthropic(apiKey, {
    model: MODEL,
    max_tokens: 2000,
    system:
      "Je bent een studieassistent voor een Nederlandse gymnasiumleerling. " +
      "Je krijgt een foto van handgeschreven of gedrukte aantekeningen. " +
      "Vat de inhoud samen en leg de kernbegrippen helder uit, in het Nederlands, op gymnasiumniveau. " +
      "Structureer je antwoord als Markdown met koppen (##) en opsommingen. " +
      "Als je iets niet goed kunt lezen, geef dat kort aan in plaats van te raden.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Vak: ${subjectName}\nHieronder een foto van mijn aantekeningen. Vat samen en leg uit.`,
          },
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: imageBase64 },
          },
        ],
      },
    ],
  });

  const textBlock = data.content.find((block): block is AnthropicTextBlock => block.type === "text");
  if (!textBlock?.text) {
    throw new AiError("Kon geen samenvatting genereren. Probeer het opnieuw.");
  }
  return textBlock.text;
}
