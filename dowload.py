import os

folder_path = "D:\From C\Downloads\Imgae_Mess"  # Đường dẫn đến thư mục ảnh

# Lấy danh sách file ảnh
files = [f for f in os.listdir(folder_path) if f.endswith(('.jpg', '.png', '.jpeg'))]

# Duyệt qua từng file và đổi tên
for index, file in enumerate(files, start=1):
    ext = file.split(".")[-1]  # Lấy đuôi file (jpg, png, ...)
    new_name = f"odd_mg_{index}.{ext}"  # Đặt tên mới (image_1.jpg, image_2.jpg,...)
    old_path = os.path.join(folder_path, file)
    new_path = os.path.join(folder_path, new_name)
    
    os.rename(old_path, new_path)
    print(f"Đã đổi: {file} → {new_name}")

print("✅ Hoàn thành!")
