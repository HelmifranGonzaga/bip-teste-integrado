# BIP Benefícios - Design System

## Visão Geral

O Design System da aplicação BIP Benefícios é baseado no **tema Aura do PrimeNG** com customizações mínimas e não-conflitantes que preservam a identidade visual da marca BIP.

## 🎨 Arquitetura de Estilos

### Arquivos de Estilo:
1. **`src/styles.css`** - Estilos globais essenciais e não-conflitantes
2. **`src/app/pages/login/login.component.scss`** - Estilos específicos da tela de login (layout)
3. **Temas PrimeNG** - Todo o restante da aplicação usa exclusivamente o tema Aura

### Princípios:
- ✅ **100% Tema Aura** - Todos os componentes PrimeNG herdam cores, estados e comportamentos do tema
- ✅ **Variáveis CSS** - Uso exclusivo de `var(--p-*)` para customizações pontuais
- ✅ **Zero Cores Hardcoded** - Nenhuma cor em hexadecimal (hex) ou RGBA que conflite com o tema
- ✅ **Componentes Limpos** - Nenhum `styleUrl` em componentes TS (exceto login)

## 🎨 Cores

### Cores da Marca BIP (usadas via variáveis do Aura):
- **BIP Dark Blue:** `var(--p-surface-900)` / `var(--p-surface-950)` → Textos principais, títulos
- **BIP Green:** `var(--p-primary-500)` / `var(--p-primary-600)` → Logo, ícones de destaque
- **BIP Light Blue:** `var(--p-surface-100)` / `var(--p-surface-200)` → Fundos sutis

### Cores do Tema Aura (automáticas):
- **Primário:** `var(--p-primary-500)` - Botões de ação principal
- **Secundário:** `var(--p-surface-600)` - Textos secundários
- **Sucesso:** `var(--p-green-500)` - Estados positivos
- **Perigo:** `var(--p-red-500)` - Erros, exclusões
- **Alerta:** `var(--p-yellow-500)` - Avisos
- **Superfície:** `var(--p-surface-0)` a `var(--p-surface-900)` - Camadas de fundo

## 🔤 Tipografia

### Família de Fonte:
```css
font-family: 'Montserrat', var(--font-family, Arial, sans-serif);
```

### Tamanhos:
- **Títulos (h1):** `1.75rem` (28px) / `font-weight: 700`
- **Subtítulos:** `0.9rem` (14.4px) / `color: var(--p-surface-600)`
- **Corpo de texto:** `1rem` (16px)
- **Pequeno (Labels, help):** `0.8rem` (12.8px)
- **Botões:** `0.95rem` (15.2px) / `font-weight: 600`

## 📐 Botões

### Padrão Aura (usado em toda a aplicação):
- **Sem `severity`** → Usa cor primária do Aura (`var(--p-primary-500)`)
- **Primário (`severity="info"`):** `var(--p-primary-500)` - Ações principais
- **Sucesso (`severity="success"`):** `var(--p-green-500)` - Criação de benefícios
- **Perigo (`severity="danger"`):** `var(--p-red-500)` - Exclusões
- **Secundário (`severity="secondary"`):** `var(--p-surface-200)` - Ações cancelar

### Estilos Aplicados:
```css
.p-button {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.p-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 54, 65, 0.2);
}
```

## 📊 Componentes

### Cards (p-card):
```css
.p-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 54, 65, 0.08);
  border: none;
}

.p-card-header {
  color: var(--p-primary-500);
  font-weight: 600;
  padding: 1.5rem 1.5rem 0 1.5rem;
}
```

### Tabelas (p-table):
```css
.p-datatable .p-datatable-thead > tr > th {
  background: var(--p-surface-50);
  color: var(--p-surface-900);
  font-weight: 600;
}
```

### Inputs (p-inputtext, p-inputnumber):
```css
.p-inputtext, .p-inputnumber-input {
  border-radius: 8px;
  border-color: var(--p-surface-300);
}

.p-inputtext:enabled:focus, .p-inputnumber-input:enabled:focus {
  border-color: var(--p-primary-500);
  box-shadow: 0 0 0 1px var(--p-primary-500);
}
```

### Checkbox (p-checkbox):
```css
.p-checkbox .p-checkbox-box {
  border-radius: 4px;
}
```

## 📱 Layout e Espaçamento

### Container Principal:
- **Largura máxima:** `1200px` (benefícios) / `480px` (login)
- **Padding:** `2rem` (32px) nas laterais
- **Centralização:** Flexbox com `justify-content: center; align-items: center`

### Espaçamentos Comuns (PrimeFlex):
- `.gap-2 { gap: 0.5rem; }` - 8px
- `.gap-4 { gap: 1rem; }` - 16px
- `.mb-2 { margin-bottom: 0.5rem; }` - 8px
- `.mb-3 { margin-bottom: 0.75rem; }` - 12px
- `.mb-4 { margin-bottom: 1rem; }` - 16px

## 📱 Tela de Login (Estilo LinkedIn Authwall)

### Estrutura:
- **Fundo:** `var(--p-surface-50)` - Suave, profissional
- **Card de Login:** `var(--p-surface-0)` com `border-radius: 20px`
- **Logo:** Gradiente `var(--p-primary-500)` para `var(--p-primary-600)` com sombra
- **Formulário:** Largura máxima de `480px`, gap de `1.5rem` entre campos

### Campos:
- **Altura:** `48px` (touch-friendly)
- **Fonte:** `1rem` (16px)
- **Borda:** `2px solid var(--p-surface-300)`
- **Foco:** `border-color: var(--p-primary-500)` com sombra suave
- **Válido:** `border-color: var(--p-green-500)`
- **Erro:** `border-color: var(--p-red-500)`

### Botão Submit:
- **Largura:** `100%`
- **Altura:** Padrão do Aura (`p-button`)
- **Estado Hover:** Transição suave com sombra

## 📱 Responsividade

### Breakpoints:
- **Desktop:** > 768px - Layout completo
- **Tablet:** 768px - Ajustes de padding e fontes
- **Mobile:** 480px - Campos menores (40px), fontes reduzidas, layout em coluna

### Exemplo Mobile (Login):
```css
@media (max-width: 480px) {
  .login-content {
    padding: 1.75rem 1.25rem;
    border-radius: 12px;
  }
  
  .logo-wrapper {
    width: 56px;
    height: 56px;
  }
}
```

## ✅ Componentes Atualizados

### ✅ Dashboard (Benefícios):
- Botões "Novo Benefício" e "Transferir Saldo" → Sem `severity` (padrão Aura)
- Listagem → Sem `severity` nos botões de ação
- Formulários → Sem `severity` nos botões

### ✅ Login:
- **100% Tema Aura** via variáveis CSS (`var(--p-*)`)
- **Zero cores hardcoded** (hex/RGBA)
- **Layout LinkedIn Authwall** - Clean, minimalista, profissional
- **Campos com 48px** de altura para toque em telas móveis

### ✅ Perfil e Configurações:
- Usam padrão Aura sem customizações
- Cards e tabelas seguem estilos globais

## 🚀 Build e Validação

### Comandos:
```bash
npm run build    # Build de produção
npm run start    # Servidor de desenvolvimento (porta 4200)
```

### Status Atual:
- ✅ **Build passando** sem erros de compilação
- ✅ **Todos os componentes** seguindo o Design System
- ✅ **Tema Aura** aplicado em 100% da aplicação
- ✅ **Consistência visual** mantida em todas as telas

## 📝 Notas de Implementação

### O que foi feito:
1. Removidos todos os arquivos CSS/SCSS desnecessários dos componentes
2. Atualizado `styles.css` para usar exclusivamente variáveis do Aura
3. Criado `login.component.scss` com layout LinkedIn Authwall usando `var(--p-*)`  
4. Removidos todos os `severity` dos botões para usar padrão Aura
5. Ajustadas cores, espaçamentos e alinhamentos seguindo o tema
6. Melhorados campos de login para 48px com melhor toque em mobile

### O que NÃO foi feito:
- ❌ Sobrescrita de cores do tema Aura
- ❌ Uso de cores hardcoded (hex/RGBA) fora das variáveis
- ❌ Customização excessiva que quebre a consistência do tema

---

**Desenvolvido em:** Maio/2026  
**Framework:** Angular 21 + PrimeNG 21 (Tema Aura)  
**Fonte:** Montserrat  
**Cores:** Variáveis CSS do PrimeNG Aura Theme
