import { callAIEndpoint } from './aiClient';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | unknown[];
  cache_control?: { type: string };
}

export interface ChatParameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string | string[];
  reasoning_effort?: 'low' | 'medium' | 'high' | 'xhigh';
  tools?: unknown[];
  tool_choice?: string | object;
  response_format?: object;
  web_search_options?: object;
  parallel_tool_calls?: boolean;
  user?: string;
  extra_headers?: object;
  context_management?: object;
}

export async function getChatCompletion(
  provider: string,
  model: string,
  messages: ChatMessage[],
  parameters: ChatParameters = {}
): Promise<{
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
      tool_calls?: unknown[];
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}> {
  const result = await callAIEndpoint('/api/ai/chat-completion', {
    provider,
    model,
    messages,
    stream: false,
    parameters,
  });

  return result as ReturnType<typeof getChatCompletion> extends Promise<infer T> ? T : never;
}

export function useChatCompletion() {
  const sendMessage = async (messages: ChatMessage[], parameters: ChatParameters = {}) => {
    const result = await getChatCompletion('anthropic', 'claude-3-5-sonnet-20241022', messages, parameters);
    const choice = result?.choices?.[0];
    if (!choice) return null;
    return { role: choice.message.role, content: choice.message.content as string };
  };

  return { sendMessage };
}

export async function getStreamingChatCompletion(
  provider: string,
  model: string,
  messages: ChatMessage[],
  onChunk: (chunk: any) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  parameters: ChatParameters = {}
) {
  const ENDPOINT = '/api/ai/chat-completion';
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, model, messages, stream: true, parameters }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk' && data.chunk) {
              onChunk(data.chunk);
            } else if (data.type === 'done') {
              onComplete();
            } else if (data.type === 'error') {
              onError(new Error(data.error));
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Streaming error'));
  }
}