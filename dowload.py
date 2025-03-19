import os
import requests

# Tạo thư mục lưu ảnh
save_folder = "messenger_images"
os.makedirs(save_folder, exist_ok=True)

# Đọc danh sách ảnh và timestamp
with open("images_with_time.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

for i, line in enumerate(lines):
    try:
        timestamp, url = line.strip().split(" - ")
        filename = f"{save_folder}/{timestamp.replace(':', '-').replace(' ', '_')}.jpg"  # Định dạng lại tên file
        
        response = requests.get(url)
        if response.status_code == 200:
            with open(filename, "wb") as file:
                file.write(response.content)
        
        print(f"Đã tải {i+1}/{len(lines)}: {filename}")

    except Exception as e:
        print(f"Lỗi tải ảnh {i+1}: {e}")

print("Tải ảnh hoàn tất!")
