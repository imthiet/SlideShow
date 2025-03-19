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

// 2. Tìm kiếm ảnh theo khoảng thời gian và tạo slideshow
async function generateMemories() {
  let start = document.getElementById("startDate").value;
  let end = document.getElementById("endDate").value;

  // Lấy dữ liệu ảnh
  let response = await fetch("data.json");
  let data = await response.json();

  let preview = document.getElementById("preview");
  preview.innerHTML = "";

  let images = [];

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

  setTimeout(() => startSlideshow(images), 2000); // Bắt đầu slideshow sau 2s

  // 🔹 Phát nhạc nền
  let selectedMusic = document.getElementById("music").value;
  let audioPlayer = document.getElementById("backgroundMusic");
  audioPlayer.src = selectedMusic;
  audioPlayer.load();
  audioPlayer.play().catch((error) => console.error("Lỗi phát nhạc:", error));
}

// 3. Chạy slideshow ảnh
function startSlideshow(images) {
  if (images.length === 0) return;

  let currentIndex = 0;

  function showNextImage() {
    images.forEach((img) => img.classList.remove("active", "hiding")); // Xóa trạng thái cũ
    images[currentIndex].classList.add("active"); // Hiện ảnh mới

    setTimeout(() => {
      images[currentIndex].classList.add("hiding"); // Bắt đầu thu nhỏ dần
    }, 5000); // Ảnh giữ nguyên kích thước lớn trong 3s trước khi thu nhỏ

    currentIndex = (currentIndex + 1) % images.length;
    setTimeout(showNextImage, 7000); // Chuyển ảnh sau 4.5s
  }

  showNextImage();
}

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
window.onload = loadMusicList;
