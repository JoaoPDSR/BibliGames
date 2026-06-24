// Configuração da API
const API_URL = 'http://localhost:5000/api';

const form = document.getElementById('game-form');
const gamesList = document.getElementById('games-list');
const clearButton = document.getElementById('clear-storage');

// Funções de API

async function getGames() {
  try {
    const response = await fetch(`${API_URL}/games`);
    if (!response.ok) throw new Error('Erro ao buscar jogos');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function addGameToDatabase(gameData) {
  try {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao adicionar jogo');
    }
    
    return await response.json();
  } catch (error) {
    alert('Erro ao salvar: ' + error.message);
    return null;
  }
}

async function deleteGameFromDatabase(gameId) {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro ao remover jogo');
    return true;
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
}

async function clearAllGames() {
  try {
    const response = await fetch(`${API_URL}/games/clear`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro ao limpar jogos');
    return true;
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
}

// Funções de UI

function createGameCard(game) {
  const card = document.createElement('article');
  card.className = 'game-card';

  const titleAndLogo = document.createElement('div');
  titleAndLogo.className = 'title-and-logo';

  const title = document.createElement('h3');
  title.textContent = game.title;

  titleAndLogo.append(title);

  if (game.logo) {
    const logoImg = document.createElement('img');
    logoImg.src = game.logo;
    logoImg.alt = `Logo de ${game.title}`;
    logoImg.className = 'game-logo';
    titleAndLogo.append(logoImg);
  }

  card.append(titleAndLogo);

  const metaRow = document.createElement('div');
  metaRow.className = 'game-meta';

  const platform = document.createElement('span');
  platform.className = 'badge';
  platform.textContent = game.platform || 'Plataforma não informada';

  const year = document.createElement('span');
  year.className = 'badge';
  year.textContent = game.year || 'Ano não informado';

  const rating = document.createElement('span');
  rating.className = 'badge';
  rating.textContent = game.rating ? `Nota ${game.rating}` : 'Sem nota';

  metaRow.append(platform, year, rating);

  card.append(metaRow);

  const details = document.createElement('div');
  details.className = 'game-details';
  details.innerHTML = `
    <p>Trilha sonora: ${game.soundtrack ? game.soundtrack : 'Não avaliada'}</p>
    <p>Jogabilidade: ${game.gameplay ? game.gameplay : 'Não avaliada'}</p>
    <p>Enredo: ${game.story ? game.story : 'Não avaliado'}</p>
    <p>${game.notes || 'Sem observações.'}</p>
  `;

  const actions = document.createElement('div');
  actions.className = 'game-actions';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remover';
  removeButton.className = 'secondary';
  removeButton.addEventListener('click', () => removeGame(game.id));

  actions.append(removeButton);

  card.append(details, actions);
  return card;
}

async function renderGames() {
  const games = await getGames();
  gamesList.innerHTML = '';

  if (games.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nenhum jogo registrado ainda. Adicione um jogo acima.';
    gamesList.appendChild(empty);
    return;
  }

  games.forEach((game) => {
    gamesList.appendChild(createGameCard(game));
  });
}

function addGame(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const logoFile = formData.get('logo');
  
  let logoBase64 = '';
  if (logoFile && logoFile.size > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      logoBase64 = e.target.result;
      saveGameWithLogo(formData, logoBase64);
    };
    reader.readAsDataURL(logoFile);
  } else {
    saveGameWithLogo(formData, '');
  }
}

async function saveGameWithLogo(formData, logoBase64) {
  const newGame = {
    title: formData.get('title').trim(),
    platform: formData.get('platform').trim(),
    year: formData.get('year').trim(),
    rating: formData.get('rating').trim() ? parseFloat(formData.get('rating')) : null,
    soundtrack: formData.get('soundtrack').trim() ? parseFloat(formData.get('soundtrack')) : null,
    gameplay: formData.get('gameplay').trim() ? parseFloat(formData.get('gameplay')) : null,
    story: formData.get('story').trim() ? parseFloat(formData.get('story')) : null,
    notes: formData.get('notes').trim(),
    logo: logoBase64,
  };

  if (!newGame.title || !newGame.platform) {
    alert('Título e plataforma são obrigatórios.');
    return;
  }

  const result = await addGameToDatabase(newGame);
  if (result) {
    form.reset();
    renderGames();
  }
}

async function removeGame(gameId) {
  if (!confirm('Tem certeza que quer remover este jogo?')) {
    return;
  }

  const success = await deleteGameFromDatabase(gameId);
  if (success) {
    renderGames();
  }
}

async function clearGames() {
  if (!confirm('Tem certeza que quer apagar todos os jogos?')) {
    return;
  }

  const success = await clearAllGames();
  if (success) {
    renderGames();
  }
}

form.addEventListener('submit', addGame);
clearButton.addEventListener('click', clearGames);

// Carrega os jogos quando a página inicia
renderGames();
