import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";

initializeApp();

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

## Regras de preço e desconto
A Dental Imperador trabalha com dois tipos de preço:
- **Preço normal (tabela cheia):** valor de catálogo padrão
- **Preço promocional:** valor com desconto já aplicado (quando disponível)

### Para clientes de LISTA ACADÊMICA (Unic, Univag, CTEN, faculdades de odontologia):
- Use SEMPRE o preço normal/tabela cheia
- NÃO ofereça desconto promocional nem nenhum tipo de desconto
- Informe que o preço é tabela cheia para lista acadêmica

### Para clientes REGULARES (não acadêmicos):
- Use o preço promocional quando disponível
- Se o cliente pedir desconto, você pode oferecer de 5% a 7% de desconto sobre o preço normal
- Se o cliente quiser desconto maior que 7%, direcione para o time de vendas
- Mencione que condições especiais podem ser negociadas com o vendedor

## Qualificação de leads
Durante a conversa, faça perguntas para qualificar o lead:
1. Pergunte o CNPJ/CPF se for cliente novo
2. Pergunte o segmento: clínica, consultório, estudante, distribuidor
3. Pergunte qual a necessidade principal ou especialidade (ex: restauração, cirurgia, ortodontia, kit acadêmico)
4. Se o lead responder todas as perguntas de qualificação, avise que um vendedor entrará em contato em até 24h

## Tom de voz
- Use linguagem clara e acessível, mesmo para estudantes de odontologia
- Evite jargões desnecessários, mas demonstre conhecimento técnico quando apropriado
- Se não souber responder algo, direcione para o time de vendas`;

export const callGroq = functions
  .runWith({
    secrets: ["GROQ_API_KEY"],
    memory: "256MB",
    timeoutSeconds: 30,
  })
  .https.onCall(async (data, context) => {
    const { mensagem, contexto } = data;
    if (!mensagem || typeof mensagem !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Campo 'mensagem' é obrigatório"
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
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
              {
                role: "system",
                content:
                  SYSTEM_PROMPT +
                  (contexto ? `\n\nContexto atual: ${contexto}` : ""),
              },
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

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      return { resposta: data.choices[0].message.content };
    } catch (error) {
      console.error("callGroq error:", error);
      return {
        resposta:
          "Desculpe, não consegui processar sua solicitação no momento. " +
          "Tente novamente ou entre em contato pelo WhatsApp (65) 3615-0100.",
      };
    }
  });
