// ===============================
// ССЫЛКА НА ТВОЮ GOOGLE ТАБЛИЦУ (CSV)
// ===============================
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTloYyzz7VIh04NraWDeVELCRKLoW3qfsP2lwWV3M3qiOIBKlcZl6PNkWm4WdKYyz8OH7Ml1bED46Iw/pub?gid=0&single=true&output=csv";

let players = [];
let sortedPlayers = [];

// ===============================
// ЗАГРУЗКА ДАННЫХ ИЗ ТАБЛИЦЫ
// ===============================
async function fetchPlayers() {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    
    // Разбиваем текст на строки и убираем пустые
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    // Заголовки (первая строка: name, wins, kills, title, avatar, sadAvatar)
    const headers = lines[0].split(',').map(h => h.trim());
    
    players = [];
    
    // Читаем со второй строки (индекс 1)
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const player = {};
      
      headers.forEach((header, index) => {
        // Убираем лишние пробелы и возможные невидимые символы
        let val = values[index] ? values[index].trim() : ""; 
        
        // Если это цифры, превращаем текст в числа
        if (header === 'wins' || header === 'kills') {
          val = parseInt(val) || 0;
        }
        
        player[header] = val;
      });
      
      players.push(player);
    }

    // Сортируем: сначала победы, потом жертвы
    sortedPlayers = [...players].sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return b.kills - a.kills;
    });

  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

const ratingBody = document.getElementById("ratingBody");

// ===============================
// СОЗДАНИЕ ТАБЛИЦЫ
// ===============================
function renderRating() {
  ratingBody.innerHTML = "";

  sortedPlayers.forEach((player, index) => {
    const place = index + 1;
    const isLeader = place === 1;
    const isLoser = place === sortedPlayers.length; // Последнее место

    // Если игрок на последнем месте, ставим грустную картинку (если она есть в таблице)
    const displayAvatar = isLoser && player.sadAvatar ? player.sadAvatar : player.avatar;

    const tr = document.createElement("tr");
    tr.className = isLeader ? "leader" : "";
    tr.style.animationDelay = `${index * 0.13}s`;

    tr.innerHTML = `
      <td>
        <div class="place">#${place}</div>
      </td>

      <td>
        <div class="player-cell">
          <div class="avatar-wrap">
            <img class="avatar" src="${displayAvatar}" alt="${player.name}">
            ${isLeader ? `<div class="leader-crown">👑</div>` : ""}
          </div>

          <div>
            <div class="player-name">${player.name}</div>
            <div class="player-title">${player.title}</div>
          </div>
        </div>
      </td>

      <td>
        <div class="stat wins">${player.wins}</div>
      </td>

      <td>
        <div class="stat kills">${player.kills}</div>
      </td>

      <td>
        <span class="status ${isLeader ? "leader-status" : ""}">
          ${getStatus(place)}
        </span>
      </td>
    `;

    ratingBody.appendChild(tr);
  });
}

function getStatus(place) {
  switch (place) {
    case 1:
      return "🏆 Лидер арены";
    case 2:
      return "🔥 Дышит в спину";
    case 3:
      return "⚔️ Опасный маг";
    default:
      return "🧪 Варит план";
  }
}

// ===============================
// ПРЕЛОАДЕР И СТАРТОВЫЕ АНИМАЦИИ
// ===============================
window.addEventListener("load", async () => {
  // Ждем, пока скачаются данные из Google Таблицы
  await fetchPlayers();
  
  // Рисуем рейтинг
  renderRating();
  
  // Запускаем прелоадер с картами
  initPreloader();
});

function initPreloader() {
  const stack = document.getElementById("preloaderCards");
  const preloader = document.getElementById("preloader");
  const app = document.getElementById("app");

  // Рандомное перемешивание карточек
  const shuffledPlayers = [...players];
  for (let i = shuffledPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
  }

  shuffledPlayers.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "preloader-player-card";
    card.style.backgroundImage = `url('${p.avatar}')`;
    
    const rot = (Math.random() * 24 - 12).toFixed(1); 
    card.style.setProperty('--final-rot', `${rot}deg`);
    card.style.animationDelay = `${index * 0.3}s`; 
    
    stack.appendChild(card);
  });

  const totalPreloaderTime = (shuffledPlayers.length * 0.6 + 0.6 + 0.5) * 1000;

  setTimeout(() => {
    preloader.classList.add("hidden");
    app.classList.add("visible");

    setTimeout(() => {
      startLeaderCelebration();
    }, 650);
  }, totalPreloaderTime);
}

// ===============================
// КУБОК И КОНФЕТТИ У ЛИДЕРА
// ===============================
function startLeaderCelebration() {
  const leaderRow = document.querySelector(".rating-table tbody tr.leader");
  if (!leaderRow) return;

  leaderRow.style.position = "relative";

  const burst = document.createElement("div");
  burst.className = "trophy-burst";

  const trophy = document.createElement("div");
  trophy.className = "trophy";
  trophy.textContent = "🏆";

  burst.appendChild(trophy);
  leaderRow.appendChild(burst);

  createConfetti(burst);

  setTimeout(() => {
    const confettiPieces = burst.querySelectorAll(".confetti");
    confettiPieces.forEach(piece => piece.remove());
  }, 2300);
}

function createConfetti(container) {
  const colors = ["#ff2bd6", "#ffe66d", "#31e6ff", "#43ff9a", "#ff9b21", "#ff3b3b", "#ffffff"];
  const piecesCount = 42;

  for (let i = 0; i < piecesCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";

    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 115;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 50;

    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.22}s`;

    if (Math.random() > 0.5) piece.style.borderRadius = "999px";
    if (Math.random() > 0.55) {
      piece.style.width = "12px";
      piece.style.height = "6px";
    }

    container.appendChild(piece);
  }
}
