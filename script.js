// ===============================
// ДАННЫЕ ИГРОКОВ
// Меняй победы, жертвы и ссылки на аватарки здесь
// ===============================

const players = [
  {
    name: "Николай",
    wins: 5,
    kills: 18,
    title: "Архимаг хаоса",
    avatar: "Nikolay.jpg"
  },
  {
    name: "Данила",
    wins: 3,
    kills: 22,
    title: "Повелитель критов",
    avatar: "Danila.jpg"
  },
  {
    name: "Александр",
    wins: 4,
    kills: 14,
    title: "Заклинатель боли",
    avatar: "Sasha.jpg"
  },
  {
    name: "Никита",
    wins: 2,
    kills: 27,
    title: "Олух",
    avatar: "Nikita.jpg"
  }
];

// ===============================
// СОРТИРОВКА РЕЙТИНГА
// Сначала по победам, потом по жертвам
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
            <img class="avatar" src="${player.avatar}" alt="${player.name}">
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

  const preloader = document.getElementById("preloader");
  const app = document.getElementById("app");

  // Минимальное время показа прелоадера, чтобы он выглядел красиво
  setTimeout(() => {
    preloader.classList.add("hidden");
    app.classList.add("visible");

    // Запускаем кубок и конфетти после появления сайта
    setTimeout(() => {
      startLeaderCelebration();
    }, 650);
  }, 1500);
});

// ===============================
// КУБОК И КОНФЕТТИ У ЛИДЕРА
// ===============================

function startLeaderCelebration() {
  const leaderRow = document.querySelector(".rating-table tbody tr.leader");

  if (!leaderRow) return;

  // Чтобы кубок позиционировался относительно строки
  leaderRow.style.position = "relative";

  const burst = document.createElement("div");
  burst.className = "trophy-burst";

  const trophy = document.createElement("div");
  trophy.className = "trophy";
  trophy.textContent = "🏆";

  burst.appendChild(trophy);
  leaderRow.appendChild(burst);

  createConfetti(burst);

  // Через пару секунд конфетти исчезнет, кубок останется
  setTimeout(() => {
    const confettiPieces = burst.querySelectorAll(".confetti");
    confettiPieces.forEach(piece => piece.remove());
  }, 2300);
}

function createConfetti(container) {
  const colors = [
    "#ff2bd6",
    "#ffe66d",
    "#31e6ff",
    "#43ff9a",
    "#ff9b21",
    "#ff3b3b",
    "#ffffff"
  ];

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

    if (Math.random() > 0.5) {
      piece.style.borderRadius = "999px";
    }

    if (Math.random() > 0.55) {
      piece.style.width = "12px";
      piece.style.height = "6px";
    }

    container.appendChild(piece);
  }
}