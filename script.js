// 1. Tải ảnh lên và cập nhật data.json
async function uploadImages() {
  let files = document.getElementById("uploadImages").files;
  let response = await fetch("data.json");
  let data = await response.json();

  let today = new Date();
  let yearMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  if (!data[yearMonth]) {
    data[yearMonth] = [];
  }

  for (let file of files) {
    let filename = `img${Date.now()}.jpg`;
    data[yearMonth].push(filename);
  }

  await fetch("data.json", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  alert("Tải ảnh thành công!");
}
document.getElementById("playMusic").addEventListener("click", function () {
  let audio = document.getElementById("backgroundMusic");
  audio.play().catch((error) => console.log("Lỗi phát nhạc:", error));
});

// 2. Tìm kiếm ảnh theo khoảng thời gian và tạo slideshow
async function generateMemories() {
  let start = document.getElementById("startDate").value;
  let end = document.getElementById("endDate").value;
  let preview = document.getElementById("preview");
  preview.innerHTML = "";
  let images = [];

  if (!start || !end) {
    console.log("🔹 Chưa chọn ngày, lấy ảnh từ odd.json...");
    let response = await fetch("odd.json");
    let data = await response.json();
    playMusic();
    let shuffledImages = data.images.sort(() => Math.random() - 0.5);

    shuffledImages.forEach((img, index) => {
      let imgTag = document.createElement("img");
      imgTag.src = `images/${img}`;
      preview.appendChild(imgTag);
      images.push(imgTag);

      setTimeout(() => {
        imgTag.classList.add("show");
      }, index * 300);
    });
  } else {
    console.log("🔹 Tìm ảnh theo ngày...");
    let response = await fetch("data.json");
    let data = await response.json();

    Object.keys(data).forEach((date) => {
      if (date >= start && date <= end) {
        data[date].forEach((img, index) => {
          let imgTag = document.createElement("img");
          imgTag.src = `images/${img}`;
          preview.appendChild(imgTag);
          images.push(imgTag);

          setTimeout(() => {
            imgTag.classList.add("show");
          }, index * 300);
        });
      }
    });
  }

  setTimeout(() => startSlideshow(images), 2000); // Bắt đầu slideshow sau 2s
  playMusic();
}

// 3. Chạy slideshow ảnh
let slideshowInterval; // Biến lưu interval slideshow
let isSlideshowRunning = false; // Trạng thái slideshow

function startSlideshow(images) {
  if (images.length === 0 || isSlideshowRunning) return;

  let currentIndex = 0;
  let overlay = document.getElementById("slideshow-overlay");

  // Hiện nền tối và bật trạng thái slideshow
  overlay.style.display = "block";
  isSlideshowRunning = true;

  function showNextImage() {
    if (!isSlideshowRunning) return; // Dừng nếu trạng thái bị tắt

    images.forEach((img) => img.classList.remove("active", "hiding"));
    images[currentIndex].classList.add("active");

    setTimeout(() => {
      images[currentIndex].classList.add("hiding");
    }, 5000);

    currentIndex = (currentIndex + 1) % images.length;

    // Nếu đã hết ảnh, ẩn overlay
    if (currentIndex === 0) {
      setTimeout(() => {
        overlay.style.display = "none";
      }, 7000);
    }

    // Lặp lại nếu slideshow vẫn chạy
    slideshowInterval = setTimeout(showNextImage, 7000);
  }

  showNextImage();
}

function stopSlideshow() {
  isSlideshowRunning = false; // Dừng trạng thái slideshow
  clearTimeout(slideshowInterval); // Xóa interval
  document.getElementById("slideshow-overlay").style.display = "none"; // Ẩn overlay
}

function showWelcomeMessage() {
  // Tạo modal chào mừng
  let modal = document.createElement("div");
  modal.id = "welcomeModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0, 0, 0, 0.7)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  // Nội dung modal
  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
      <h2>Welcome to my site!</h2>
      <p>Click OK to start the experience.</p>
      <button id="okButton" style="padding: 10px 20px; font-size: 16px;">OK</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Khi nhấn OK, ẩn modal và phát nhạc
  document.getElementById("okButton").addEventListener("click", () => {
    modal.style.display = "none";
    playMusic();
  });
}
// 4. Phát nhạc nền
function playMusic() {
  let selectedMusic = document.getElementById("music").value;
  let audioPlayer = document.getElementById("backgroundMusic");
  audioPlayer.src = selectedMusic;
  audioPlayer.load();
  audioPlayer.play().catch((error) => console.error("Lỗi phát nhạc:", error));
}

// 5. Tự động chạy slideshow khi trang tải xong
window.onload = () => {
  loadMusicList().then(() => showWelcomeMessage()); // Đợi danh sách nhạc tải xong rồi mới gọi
  generateMemories(); // Nếu chưa chọn ngày -> Tự động chạy ảnh từ odd.json
};

// 4. Tải danh sách nhạc từ music.json
async function loadMusicList() {
  try {
    let response = await fetch("music.json");
    let data = await response.json();

    let musicSelect = document.getElementById("music");
    musicSelect.innerHTML = "";

    if (data.songs) {
      data.songs.forEach((song) => {
        let option = document.createElement("option");
        option.value = song;
        option.textContent = song.split("/").pop();
        musicSelect.appendChild(option);
      });
    } else {
      console.error("Danh sách nhạc không hợp lệ!");
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách nhạc:", error);
  }
}

// Gọi hàm load nhạc khi trang load xong
