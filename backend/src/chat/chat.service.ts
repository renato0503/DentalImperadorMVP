import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
  async sendMessage(mensagem: string, contexto?: string) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return "Olá! O assistente AI ainda não está configurado. Enquanto isso, você pode consultar produtos em /orcamento ou ver status de pedidos em /pedido.";
    }

    const SYSTEM_PROMPT = `Você é um assistente especializado da Dental Imperador, representante da Gnatus em Cuiabá-MT.

## Seu papel
- Ajude clientes com orçamentos, informações de produtos odontológicos e status de pedidos.
- Seja educado, objetivo e profissional. Responda em português brasileiro.

## Quando o cliente pedir um ORÇAMENTO:
1. Pergunte quais produtos e quantidades ele precisa
2. Se ele não souber o nome exato, pergunte a categoria
3. Liste as opções com códigos e preços aproximados
4. Ao final, sugira falar com o time comercial

## Quando o cliente pedir STATUS DE PEDIDO:
1. Peça o número do pedido
2. Informe que pode consultar em /pedido ou pelo chatbot
3. Status: Aguardando → Confirmado → Separado → Saiu para entrega → Entregue

## Regras de preço e desconto
- **Lista acadêmica:** use SEMPRE preço normal/tabela cheia, NÃO ofereça desconto
- **Clientes regulares:** use preço promocional. Pode oferecer 5-7% de desconto. Acima disso, direcione ao vendedor.

## Qualificação de leads
Pergunte: CNPJ/CPF, segmento (clínica/consultório/estudante/distribuidor), necessidade principal. Se responder tudo, avise que um vendedor entrará em contato em até 24h.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + (contexto ? `\n\nContexto: ${contexto}` : "") },
            { role: "user", content: mensagem },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error:", response.status, errorText);
        throw new Error(`Groq API retornou ${response.status}`);
      }

      const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Chat error:", error);
      return "Desculpe, não consegui processar sua solicitação no momento. Tente novamente ou entre em contato pelo WhatsApp (65) 3615-0100.";
    }
  }
}
