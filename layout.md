## O que existe hoje no MVP

**Apenas 1 tela:** o chatbot básico (`mvp/index.html`) com CSS e JS mockados.

## O que deveria existir segundo o ![](<vscode-file://vscode-app/c:/Users/Renato/AppData/Local/Programs/Antigravity%20IDE/resources/app/extensions/theme-symbols/src/icons/files/markdown.svg>)

context.md e ![](<vscode-file://vscode-app/c:/Users/Renato/AppData/Local/Programs/Antigravity%20IDE/resources/app/extensions/theme-symbols/src/icons/files/markdown.svg>)

implementation.md

O MVP (Sprints 1-4) prevê  **várias telas** :

| Tela                               | Descrição                                       | Status                               |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------ |
| 🤖**Chatbot**                | Chat com triagem, orçamento e status de pedido   | ⚠️ Existe mas só com mock básico |
| 📋**Orçamento automático** | Consulta catálogo e gera proposta                | ❌ Não existe                       |
| 📦**Status de Pedido**       | Consulta status (Faturado, Entregue, Separado...) | ❌ Não existe                       |
| 📊**Dashboard**              | Métricas de aquisição, NPS, conversão         | ❌ Não existe                       |
| 👥**CRM / Kanban**           | Pipeline de leads e clientes                      | ❌ Não existe                       |
| 🔐**Login**                  | Firebase Auth                                     | ❌ Não existe                       |

**Ou seja: falta praticamente tudo além do esqueleto do chatbot.**

---

Quer que eu crie essas telas agora como um **MVP funcional estático** (HTML/CSS/JS puro, com dados mockados) para rodar no GitHub Pages? Seria um site multi-páginas bonito e funcional com:

1. **Landing Page** – apresentação da Dental Imperador
2. **Chatbot** – versão melhorada com triagem e orçamento mock
3. **Dashboard** – gráficos e métricas (mockados)
4. **Status de Pedido** – consulta de status (mock)
5. **CRM Kanban** – pipeline visual (mock)

Tudo estático, sem backend, pronto para GitHub Pages. Quer que eu faça?

me de todos esses com dados fake, e seguindo o layout abaixo, lembrando que esses são só para demonstrar o que será o app (# 🦷 DENTAL IMPERADOR - MEDIA KIT COM PLETO

## 📋 ÍNDICE

1. Sistema de Cores
2. Tipografia
3. Elementos Gráficos
4. Aplicações por Plataforma
5. Templates Prontos
6. Guidelines de Uso

---

## 1️⃣ SISTEMA DE CORES

### **PALETA PRIMÁRIA** (Extraída do Logo)

| Cor | Hex | RGB | Uso Principal |

|-----|-----|-----|---------------|

| **Verde Imperador** | `#00A650` | rgb(0, 166, 80) | Logo, CTAs, elementos principais |

| **Vermelho Dental** | `#E31E24` | rgb(227, 30, 36) | Destaques, alertas, ícones dentais |

| **Verde Escuro** | `#007A3D` | rgb(0, 122, 61) | Hover states, textos importantes |

### **PALETA SECUNDÁRIA**

| Cor | Hex | RGB | Uso |

|-----|-----|-----|-----|

| **Cinza Carbono** | `#2C2C2C` | rgb(44, 44, 44) | Textos principais |

| **Cinza Médio** | `#6B7280` | rgb(107, 114, 128) | Textos secundários |

| **Cinza Claro** | `#F3F4F6` | rgb(243, 244, 246) | Fundos, cards |

| **Branco Puro** | `#FFFFFF` | rgb(255, 255, 255) | Fundos alternativos |

### **GRADIENTES**

```css

/* Gradiente Principal - Header/Dashboard */

gradient-primary: linear-gradient(135deg, #00A650 0%, #007A3D 100%)



/* Gradiente Destaque - CTAs */

gradient-accent: linear-gradient(90deg, #E31E24 0%, #FF4757 100%)



/* Gradiente Suave - Backgrounds */

gradient-soft: linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)

```

---

## 2️⃣ TIPOGRAFIA

### **FAMÍLIA PRINCIPAL: Montserrat**

- **Bold (700)**: Títulos, headlines
- **SemiBold (600)**: Subtítulos, botões
- **Medium (500)**: Destaques em texto
- **Regular (400)**: Corpo de texto

### **FAMÍLIA SECUNDÁRIA: Inter**

- **Regular (400)**: Textos longos, descrições
- **Light (300)**: Legendas, informações secundárias

### **ESCALA TIPOGRÁFICA**

| Elemento | Fonte | Tamanho | Peso | Line Height |

|----------|-------|---------|------|-------------|

| **H1 - Hero** | Montserrat | 48px | Bold | 1.2 |

| **H2 - Seções** | Montserrat | 36px | Bold | 1.3 |

| **H3 - Subseções** | Montserrat | 28px | SemiBold | 1.3 |

| **H4 - Cards** | Montserrat | 22px | SemiBold | 1.4 |

| **Body Large** | Inter | 18px | Regular | 1.6 |

| **Body** | Inter | 16px | Regular | 1.6 |

| **Small** | Inter | 14px | Regular | 1.5 |

| **Caption** | Inter | 12px | Light | 1.4 |

---

## 3️⃣ ELEMENTOS GRÁFICOS

### **PADRÕES VISUAIS**

**Pattern Dental 1** (Backgrounds):

- Elementos geométricos sutis em verde #00A650 com 5% opacity
- Forma de dentes estilizados em repeat pattern
- Tamanho: 200x200px

**Pattern Tech** (Dashboard/PWA):

- Grid lines em #E5E7EB
- Dots pattern em verde com 10% opacity
- Espaçamento: 24px

### **ÍCONE SYSTEM**

**Biblioteca**: Lucide Icons ou Heroicons

- **Cores**:

  - Primário: #00A650
  - Secundário: #6B7280
  - Alerta: #E31E24
- **Tamanhos padrão**: 16px, 20px, 24px, 32px, 48px
- **Stroke width**: 2px

### **ELEMENTOS DENTAIS DECORATIVOS**

1. **Dente Stylized** (marca d'água):

   - Cor: #00A650 com 3% opacity
   - Posição: Cantos inferiores das páginas
2. **Linha Dental** (divisores):

   - Traço vermelho #E31E24 com 2px
   - Comprimento: 60px
   - Usado em separações de seção

---

## 4️⃣ APLICAÇÕES POR PLATAFORMA

### **📱 REDES SOCIAIS**

#### **Instagram/Facebook**

**Post Quadrado (1080x1080px)**

```

Layout:

- Fundo: Gradiente suave verde (#00A650 → #007A3D)

- Logo centralizado no topo (200px)

- Headline: Montserrat Bold 48px branco

- Subheadline: Inter Regular 24px branco 80%

- Elemento dental vermelho no canto inferior direito

- Hashtags: #DentalImperador #B2BDental

```

**Stories (1080x1920px)**

```

Layout:

- Background: Imagem com overlay verde 70%

- Logo no topo centralizado

- Texto principal: Montserrat Bold 56px

- CTA button: Vermelho #E31E24 arredondado

- Swipe up indicator: seta verde

```

**LinkedIn Post (1200x627px)**

```

Layout:

- Fundo: Branco #FFFFFF

- Faixa superior verde: 120px height

- Logo posicionado na faixa

- Conteúdo: Inter Regular 32px cinza #2C2C2C

- Dados/estatísticas: Verde #00A650 Bold

- Rodapé: Vermelho fino 4px

```

#### **Twitter/X (1200x675px)**

```

Layout:

- Background: Pattern tech sutil

- Card central branco com shadow

- Logo no canto superior esquerdo

- Headline: Montserrat SemiBold 40px

- Body: Inter Regular 24px

- CTA: Botão verde arredondado

```

---

### **💻 PLATAFORMA DIGITAL (PWA)**

#### **Dashboard Admin**

**Header/Top Bar**:

```css

Height: 64px

Background: gradient-primary

Logo: branco 40px height

Menu items: branco, Montserrat Medium 14px

Active state: fundo branco 20% opacity

Notificações: badge vermelho #E31E24

```

**Sidebar Navigation**:

```css

Width: 260px

Background: #FFFFFF

Border-right: 1px solid #E5E7EB

Icons: #00A650, 20px

Text: #2C2C2C, Inter Medium 14px

Active: background #F0FDF4 (verde 10%)

Hover: background #F3F4F6

```

**Cards de Métricas**:

```css

Background: #FFFFFF

Border: 1px solid #E5E7EB

Border-radius: 12px

Padding: 24px

Shadow: 0 1px 3px rgba(0,0,0,0.1)



Header:

- Ícone: 32px #00A650

- Título: Inter Medium 14px #6B7280

- Valor: Montserrat Bold 32px #2C2C2C

- Variação: Inter Regular 14px 

  - Positiva: #00A650

  - Negativa: #E31E24

```

**Tabelas de Dados**:

```css

Header:

- Background: #F9FAFB

- Text: Montserrat SemiBold 12px #6B7280

- Border-bottom: 2px solid #E5E7EB



Rows:

- Hover: #F0FDF4 (verde 10%)

- Border-bottom: 1px solid #F3F4F6

- Text: Inter Regular 14px #2C2C2C



Status badges:

- Entregue: bg #D1FAE5, text #007A3D

- Pendente: bg #FEF3C7, text #D97706

- Cancelado: bg #FEE2E2, text #E31E24

```

#### **Chatbot Interface**

**Bubble do Bot**:

```css

Background: #F0FDF4 (verde claro)

Border: 1px solid #A7F3D0

Border-radius: 16px 16px 16px 4px

Padding: 16px

Text: #2C2C2C, Inter Regular 15px

Icon: #00A650, 24px

```

**Bubble do Usuário**:

```css

Background: gradient-primary

Border-radius: 16px 16px 4px 16px

Padding: 16px

Text: #FFFFFF, Inter Regular 15px

```

**Quick Replies**:

```css

Background: #FFFFFF

Border: 2px solid #00A650

Border-radius: 24px

Padding: 12px 24px

Text: #00A650, Montserrat Medium 14px

Hover: background #00A650, text #FFFFFF

```

---

### **📄 MATERIAL INSTITUCIONAL**

#### **Apresentação (PowerPoint/Google Slides)**

**Slide de Capa**:

```

Dimensões: 1920x1080px

Background: Imagem dental com overlay verde 85%

Logo: centralizado, 300px width

Título: Montserrat Bold 64px branco

Subtítulo: Inter Regular 28px branco 90%

Linha decorativa: vermelha 4px, 200px width

Ano/versão: Inter Light 18px no rodapé

```

**Slide de Conteúdo**:

```

Background: #FFFFFF

Header: faixa verde 8px no topo

Título: Montserrat SemiBold 40px #2C2C2C

Body: Inter Regular 24px #6B7280

Bullet points: ícones verdes #00A650

Imagens: border-radius 8px, shadow suave

Número do slide: círculo vermelho 24px

```

**Slide de Dados/Gráficos**:

```

Background: #F9FAFB

Título: Montserrat SemiBold 36px

Gráficos: 

- Barras: gradiente verde

- Linhas: #00A650 stroke 3px

- Destaque: vermelho #E31E24

Legenda: Inter Medium 16px

```

#### **Cartão de Visita**

**Frente** (85x55mm):

```

Background: #FFFFFF

Logo: centralizado, 40mm width

Nome: Montserrat Bold 18pt #2C2C2C

Cargo: Inter Regular 12pt #00A650

Linha divisória: vermelha 1pt

```

**Verso** (85x55mm):

```

Background: gradient-primary

Logo branco: canto superior esquerdo

Contatos: 

- Inter Regular 10pt branco

- Ícones: 12pt branco

QR Code: canto inferior direito

Website: Montserrat Medium 11pt

```

#### **Papel Timbrado**

**A4 (210x297mm)**:

```

Header:

- Faixa verde 20mm height

- Logo branco posicionado esquerda

- Nome empresa: Montserrat Bold 24pt



Body:

- Margem superior: 35mm

- Texto: Inter Regular 11pt #2C2C2C

- Títulos: Montserrat SemiBold 16pt



Footer:

- Linha vermelha 1pt

- Informações: Inter Light 9pt #6B7280

- Centralizado

```

---

### **📧 EMAIL MARKETING**

#### **Template Newsletter**

**Header**:

```

Background: gradient-primary

Padding: 40px 20px

Logo: centralizado, 180px width

```

**Hero Section**:

```

Background: #FFFFFF

Padding: 60px 40px

Headline: Montserrat Bold 36px #2C2C2C

Subheadline: Inter Regular 18px #6B7280

CTA Button:

  - Background: #E31E24

  - Text: Montserrat SemiBold 16px branco

  - Padding: 16px 32px

  - Border-radius: 8px

```

**Content Blocks**:

```

Background: #F9FAFB

Padding: 40px

Border-radius: 12px

Margin: 20px 0

Icon: 48px #00A650

Title: Montserrat SemiBold 24px

Text: Inter Regular 16px #6B7280

Line-height: 1.6

```

**Footer**:

```

Background: #2C2C2C

Padding: 40px 20px

Text: Inter Regular 14px #9CA3AF

Links: #00A650

Social icons: 24px branco

Unsubscribe: Inter Light 12px

```

---

### **🎥 VÍDEOS/MOTION**

#### **YouTube Thumbnail (1280x720px)**

```

Background: Imagem com overlay gradiente verde

Logo: canto superior esquerdo, 120px

Título: Montserrat Bold 56px branco

Texto destaque: Montserrat Black 72px 

  - Stroke: 4px #E31E24

  - Shadow: 4px 4px 0px #00000030

Elemento dental: animação pulse vermelho

Duração: badge verde canto inferior direito

```

#### **Intro Animada (5 segundos)**

```

0-1s: Logo aparece scale 0→1, easing bounce

1-2s: Elemento dental vermelho gira 360°

2-3s: Texto "Dental Imperador" slide-in

3-4s: Linha vermelha draw animation

4-5s: Fade out suave

Cores: verde #00A650, vermelho #E31E24

Fundo: #FFFFFF

```

---

## 5️⃣ TEMPLATES PRONTOS (ESPECIFICAÇÕES)

### **A. SOCIAL MEDIA KIT**

**Pacote completo inclui**:

1. 10 templates Instagram feed
2. 5 templates Stories
3. 3 templates LinkedIn
4. 2 templates Twitter
5. 1 template YouTube thumbnail

**Cada template contém**:

- Camadas organizadas (Figma/PSD)
- Fontes especificadas
- Cores em styles/symbols
- Grid de segurança
- Versões claro/escuro

---

### **B. APRESENTAÇÃO CORPORATIVA**

**Estrutura (20 slides)**:

1. Capa
2. Sobre nós
3. Missão/Visão/Valores
4. Números/Resultados
5. Soluções (3 slides)
6. Plataforma (2 slides)
7. Diferenciais
8. Cases/Depoimentos
9. Equipe
10. Timeline
11. Investimento
12. Contato
13. Obrigado

**Formatos**:

- PowerPoint (.pptx)
- Google Slides
- PDF interativo
- Keynote

---

### **C. DOCUMENTOS OFICIAIS**

**Kit inclui**:

- Papel timbrado A4
- Envelope A4
- Cartão de visita
- Pasta institucional
- Proposta comercial template
- Contrato template
- Invoice/fatura

**Especificações técnicas**:

- Resolução: 300 DPI (impressão)
- Modo de cor: CMYK
- Sangria: 3mm
- Margem segurança: 5mm

---

### **D. UI KIT COMPLETO (PWA)**

**Componentes**:

**Atoms**:

- Buttons (5 variações)
- Inputs (text, select, checkbox, radio)
- Badges (status)
- Avatars (3 tamanhos)
- Icons (biblioteca completa)

**Molecules**:

- Cards (métrica, produto, cliente)
- Form groups
- Search bars
- Navigation items
- Alerts/Notifications

**Organisms**:

- Header/Top bar
- Sidebar navigation
- Tables (data grid)
- Chat interface
- Dashboard widgets
- Modal dialogs

**Templates**:

- Dashboard principal
- CRM view
- Chatbot interface
- Admin panel
- Mobile responsive

**Especificações**:

- Figma components library
- React components (se aplicável)
- CSS variables
- Spacing system (8px grid)
- Breakpoints definidos

---

### **E. EMAIL TEMPLATES**

**Tipos**:

1. Boas-vindas
2. Newsletter semanal
3. Promoção/oferta
4. Recuperação de churn
5. Confirmação de pedido
6. Status de entrega
7. NPS/Pesquisa
8. Reativação

**Specs técnicas**:

- HTML responsivo
- Inline CSS
- Compatível: Gmail, Outlook, Apple Mail
- Width: 600px
- Teste A/B ready

---

## 6️⃣ GUIDELINES DE USO

### **✅ FAÇA**

**Logo**:

- ✓ Use sempre em fundo com bom contraste
- ✓ Mantenha área de respiro mínima de 20px
- ✓ Use versão branca sobre fundos escuros
- ✓ Use versão colorida sobre fundos claros
- ✓ Redimensione proporcionalmente

**Cores**:

- ✓ Use verde como cor primária (60% do design)
- ✓ Use vermelho apenas para destaques (10%)
- ✓ Use neutros para textos e fundos (30%)
- ✓ Mantenha contraste mínimo 4.5:1 (WCAG AA)

**Tipografia**:

- ✓ Máximo 2 famílias por peça
- ✓ Hierarquia clara (tamanho/peso)
- ✓ Line-height adequado (1.4-1.6)
- ✓ Texto alinhado à esquerda (legibilidade)

**Imagens**:

- ✓ Qualidade mínima 1920px width
- ✓ Overlay em imagens para texto legível
- ✓ Pessoas reais (autenticidade)
- ✓ Iluminação natural/profissional

---

### **❌ NÃO FAÇA**

**Logo**:

- ✗ Não distorça ou altere proporções
- ✗ Não mude cores do logo
- Não adicione efeitos (shadow, glow)
- ✗ Não use sobre fundos poluídos
- ✗ Não rotacione ou incline

**Cores**:

- ✗ Não use vermelho como cor dominante
- ✗ Não combine com cores fora da paleta
- ✗ Não use verde neon ou saturado demais
- ✗ Não ignore acessibilidade (contraste)

**Tipografia**:

- ✗ Não use mais de 3 pesos diferentes
- ✗ Não justifique texto (ríos)
- ✗ Não use ALL CAPS em textos longos
- ✗ Não use fontes decorativas

**Elementos**:

- ✗ Não exagere em animações
- Não use ícones inconsistentes
- Não sobrecarregue com informações
- Não ignore espaçamento

---

### ** GRID E LAYOUT**

**Sistema de Grid (12 colunas)**:

```

Desktop (≥1200px):

- Columns: 12

- Gutter: 24px

- Margin: 80px



Tablet (768-1199px):

- Columns: 12

- Gutter: 16px

- Margin: 40px



Mobile (≤767px):

- Columns: 4

- Gutter: 16px

- Margin: 20px

```

**Breakpoints**:

```css

xs: 0-575px   (mobile portrait)

sm: 576-767px (mobile landscape)

md: 768-991px (tablet)

lg: 992-1199px (desktop small)

xl: 1200-1399px (desktop)

xxl: ≥1400px (desktop large)

```

---

### **🎨 ESPECIFICAÇÕES TÉCNICAS**

**Para Web/Digital**:

```

Formatos: PNG, SVG, WebP

Resolução: 72 DPI

Color mode: RGB

Compression: Lossless (qualidade)

Max file size: 2MB (imagens)

```

**Para Impressão**:

```

Formatos: PDF/X-1a, TIFF

Resolução: 300 DPI

Color mode: CMYK

Bleed: 3mm

Safe area: 5mm

```

**Para Vídeo**:

```

Resolution: 1920x1080 (Full HD)

Frame rate: 30fps

Codec: H.264

Audio: AAC 44.1kHz

Max duration: 60s (social)

```

---

### **📱 ARQUIVOS INCLUÍDOS**

**Estrutura de pastas**:

```

Dental_Imperador_MediaKit/

├── 01_Logo/

│   ├── Primary/

│   ├── Secondary/

│   ├── Monochrome/

│   └── Favicon/

├── 02_Colors/

│   ├── Palettes.ase

│   ├── CSS_Variables.css

│   └── SCSS_Variables.scss

── 03_Typography/

│   ├── Fonts/

│   ├── Styles.pdf

│   └── Webfonts/

├── 04_Social_Media/

│   ├── Instagram/

│   ├── Facebook/

│   ├── LinkedIn/

│   └── Twitter/

├── 05_Presentations/

│   ├── PowerPoint/

│   ├── Google_Slides/

│   └── Keynote/

├── 06_Print/

│   ├── Business_Cards/

│   ├── Letterhead/

│   ── Brochures/

├── 07_UI_Kit/

│   ├── Figma/

│   ├── Sketch/

│   └── Adobe_XD/

── 08_Email/

│   ├── Templates_HTML/

│   └── Images/

├── 09_Video/

│   ├── Intros/

│   ├── Thumbnails/

│   └── Lower_Thirds/

└── 10_Guidelines/

    ├── Brand_Guide.pdf

    ├── Do_Dont.pdf

    └── Cheat_Sheet.pdf

```

---

### **🔧 FERRAMENTAS RECOMENDADAS**

**Design**:

- Figma (colaboração)
- Adobe Creative Cloud (Photoshop, Illustrator)
- Canva (templates rápidos)

**Prototipagem**:

- Figma (UI/UX)
- InVision (interações)
- Principle (animações)

**Gestão**:

- Brandfolder (asset management)
- Dropbox/Google Drive (armazenamento)
- Notion (documentação))

use a logo logodental.png que esta na pasta raiz
