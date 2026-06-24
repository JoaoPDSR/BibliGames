# Banco de Dados - Projeto Jogos Zerados

## Instalação e Configuração

### 1. Instalar dependências Python
```bash
python3 -m pip install -r requirements.txt
```

### 2. Executar o servidor
```bash
python3 app.py
```

O servidor vai rodar em `http://localhost:5000`

### 3. Usar o novo JavaScript
Substitua a linha no `index.html`:
```html
<!-- De: -->
<script src="script.js"></script>

<!-- Para: -->
<script src="script-db.js"></script>
```

## Estrutura do Banco de Dados

### Tabela: games
- `id` (Integer) - Identificador único
- `title` (String) - Título do jogo
- `platform` (String) - Plataforma (PC, PlayStation, etc)
- `year` (String) - Ano de lançamento
- `rating` (Float) - Nota geral
- `soundtrack` (Float) - Nota da trilha sonora
- `gameplay` (Float) - Nota da jogabilidade
- `story` (Float) - Nota do enredo
- `notes` (Text) - Observações
- `logo` (LongText) - Imagem em Base64
- `created_at` (DateTime) - Data de criação

## Endpoints da API

### GET /api/games
Obtém todos os jogos ordenados por data (mais recentes primeiro)

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Elden Ring",
    "platform": "PC",
    "year": "2022",
    "rating": 9.5,
    "soundtrack": 9.0,
    "gameplay": 9.5,
    "story": 8.5,
    "notes": "Jogo incrível",
    "logo": "data:image/png;base64,...",
    "created_at": "2026-06-24T10:30:00"
  }
]
```

### POST /api/games
Adiciona um novo jogo

**Corpo da requisição:**
```json
{
  "title": "Elden Ring",
  "platform": "PC",
  "year": "2022",
  "rating": 9.5,
  "soundtrack": 9.0,
  "gameplay": 9.5,
  "story": 8.5,
  "notes": "Jogo incrível",
  "logo": "data:image/png;base64,..."
}
```

### DELETE /api/games/{id}
Remove um jogo específico

### DELETE /api/games/clear
Remove todos os jogos

## Banco de Dados

O arquivo `games.db` é criado automaticamente na primeira execução.

Para resetar o banco de dados, delete o arquivo `games.db` e reinicie o servidor.

## Recursos

- ✅ Persistência de dados em SQLite
- ✅ API REST completa
- ✅ CORS habilitado (funciona com frontend)
- ✅ Validação de dados
- ✅ Armazenamento de imagens em Base64
- ✅ Ordenação automática por data
