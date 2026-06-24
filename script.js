const form = document.getElementById('game-form');
const gamesList = document.getElementById('games-list');
const clearButton = document.getElementById('clear-storage');
const storageKey = 'zerouGames';

function getStoredGames() {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : [];
}

function setStoredGames(games) {
  localStorage.setItem(storageKey, JSON.stringify(games));
}

function createGameCard(game, index) {
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
  removeButton.addEventListener('click', () => removeGame(index));

  actions.append(removeButton);

  card.append(details, actions);
  return card;
}

function renderGames() {
  const games = getStoredGames();
  gamesList.innerHTML = '';

  if (games.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nenhum jogo registrado ainda. Adicione um jogo acima.';
    gamesList.appendChild(empty);
    return;
  }

  games.forEach((game, index) => {
    gamesList.appendChild(createGameCard(game, index));
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

function saveGameWithLogo(formData, logoBase64) {
  const newGame = {
    title: formData.get('title').trim(),
    platform: formData.get('platform').trim(),
    year: formData.get('year').trim(),
    rating: formData.get('rating').trim(),
    soundtrack: formData.get('soundtrack').trim(),
    gameplay: formData.get('gameplay').trim(),
    story: formData.get('story').trim(),
    notes: formData.get('notes').trim(),
    logo: logoBase64,
  };

  if (!newGame.title || !newGame.platform) {
    alert('Título e plataforma são obrigatórios.');
    return;
  }

  const games = getStoredGames();
  games.unshift(newGame);
  setStoredGames(games);
  form.reset();
  renderGames();
}

function removeGame(index) {
  const games = getStoredGames();
  games.splice(index, 1);
  setStoredGames(games);
  renderGames();
}

function clearGames() {
  if (!confirm('Tem certeza que quer apagar todos os jogos?')) {
    return;
  }

  localStorage.removeItem(storageKey);
  renderGames();
}

form.addEventListener('submit', addGame);
clearButton.addEventListener('click', clearGames);

renderGames();
