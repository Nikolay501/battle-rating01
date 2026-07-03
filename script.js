// ===============================
// ДАННЫЕ ИГРОКОВ
// Добавь обычную картинку (avatar) и грустную (sadAvatar)
// ===============================
const players = [
  {
    name: "Николай",
    wins: 2,
    kills: 5,
    title: "Архимаг хаоса",
    avatar: "Nikolay.jpg",
    sadAvatar: "Nikolay-sad.jpg" // <-- Грустный Коля
  },
  {
    name: "Данила",
    wins: 1,
    kills: 1,
    title: "Повелитель критов",
    avatar: "Danila.jpg",
    sadAvatar: "Danila-sad.jpg" // <-- Грустный Данила
  },
  {
    name: "Александр",
    wins: 1,
    kills: 2,
    title: "Заклинатель боли",
    avatar: "Sasha.jpg",
    sadAvatar: "Sasha-sad.jpg" // <-- Грустный Саша
  },
  {
    name: "Никита",
    wins: 0,
    kills: 0,
    title: "Олух",
    avatar: "Nikita.jpg",
    sadAvatar: "Nikita-sad.jpg" // <-- Грустный Никита
  }
];

// ===============================
// СОРТИРОВКА РЕЙТИНГА
// ===============================
const sortedPlayers = [...players].sort((a, b) => {
  if (b.wins !== a.wins) {
    return b.wins - a.wins;
  }
  return b.kills - a.kills;
});

const ratingBody = document.getElementById("ratingBody");

// ===============================
// СОЗДАНИЕ ТАБЛИЦЫ
// ===============================
function renderRating() {
  ratingBody.innerHTML = "";

  sortedPlayers.forEach((player, index) => {
    const place = index + 1;
    const isLeader = place === 1;
    const isLoser = place === sortedPlayers.length; // Проверка на последнее место

    // Если игрок на последнем месте, ставим его личную грустную картинку
    // (Если вдруг забыл добавить sadAvatar, поставится обычная)
    const displayAvatar = isLoser ? (player.sadAvatar || player.avatar) : player.avatar;

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
window.addEventListener("load", () => {
  renderRating();
  initPreloader();
});

function initPreloader() {
  const stack = document.getElementById("preloaderCards");
  const preloader = document.getElementById("preloader");
  const app = document.getElementById("app");

  // Идеально рандомное перемешивание массива (Алгоритм Фишера-Йетса)
  const shuffledPlayers = [...players];
  for (let i = shuffledPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
  }

  // Создаем карты
  shuffledPlayers.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "preloader-player-card";
    
    // В прелоадере показываем всегда нормальные лица (чтобы не спойлерить кто проиграл)
    card.style.backgroundImage = `url('${p.avatar}')`;
    
    const rot = (Math.random() * 24 - 12).toFixed(1); 
    card.style.setProperty('--final-rot', `${rot}deg`);
    card.style.animationDelay = `${index * 0.6}s`; 
    
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
