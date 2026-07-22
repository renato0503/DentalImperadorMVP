import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";

initializeApp();

const groqApiKey = defineSecret("GROQ_API_KEY");

const SYSTEM_PROMPT = `Você é um assistente especializado da Dental Imperador, representante da Gnatus em Cuiabá-MT.

## Seu papel
- Ajude clientes com orçamentos, informações de produtos odontológicos e status de pedidos.
- Seja educado, objetivo e profissional. Responda em português brasileiro.

## Quando o cliente pedir um ORÇAMENTO:
1. Pergunte quais produtos e quantidades ele precisa
2. Se ele não souber o nome exato, pergunte a categoria (ex: resina, anestésico, alginato)
3. Liste as opções disponíveis com códigos e preços aproximados
4. Ao final, sugira falar com o time comercial para condições especiais

## Quando o cliente pedir STATUS DE PEDIDO:
1. Peça o número do pedido
2. Informe que pode consultar em /pedido ou pelo chatbot
3. estados possíveis: Aguardando → Confirmado → Separado → Saiu para entrega → Entregue

## Quando o cliente pedir SUGESTÃO DE PRODUTO:
1. Pergunte a finalidade de uso (ex: restauração, moldagem, anestesia)
2. Sugira produtos compatíveis com base na categoria
3. Mencione alternativas de diferentes faixas de preço

## Tom de voz
- Use linguagem clara e acessível, mesmo para estudantes de odontologia
- Evite jargões desnecessários, mas demonstre conhecimento técnico quando apropriado
- Se não souber responder algo, direcione para o time de vendas`;

export const callGroq = onCall(
  {
    secrets: [groqApiKey],
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { mensagem, contexto } = request.data;
    if (!mensagem || typeof mensagem !== "string") {
      throw new HttpsError("invalid-argument", "Campo 'mensagem' é obrigatório");
    }

    const apiKey = groqApiKey.value();
    if (!apiKey) {
      return {
        resposta:
          "Olá! O assistente AI ainda não está configurado. " +
          "Enquanto isso, você pode:\n" +
          "• Consultar produtos em /orcamento\n" +
          "• Ver status de pedidos em /pedido\n" +
          "• Falar conosco pelo WhatsApp (65) 3615-0100",
      };
    }

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: SYSTEM_PROMPT + (contexto ? `\n\nContexto atual: ${contexto}` : "") },
              { role: "user", content: mensagem },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error:", response.status, errorText);
        throw new Error(`Groq API retornou ${response.status}`);
      }

      const data = await response.json();
      return { resposta: data.choices[0].message.content };
    } catch (error) {
      console.error("callGroq error:", error);
      return {
        resposta:
          "Desculpe, não consegui processar sua solicitação no momento. " +
          "Tente novamente ou entre em contato pelo WhatsApp (65) 3615-0100.",
      };
    }
  }
);
