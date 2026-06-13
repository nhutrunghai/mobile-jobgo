<div align="center">

# 💼 JobGo Mobile App

### Ứng dụng mobile cho nền tảng tuyển dụng JobGo

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Mobile](https://img.shields.io/badge/Mobile_App-2563EB?style=for-the-badge)

</div>

---

## 🎯 Mục tiêu dự án

**JobGo Mobile App** là phiên bản mobile dành cho hệ sinh thái JobGo, tập trung vào trải nghiệm tìm việc và quản lý thông tin tuyển dụng trên điện thoại.

Project này giúp luyện tập:

- Xây dựng giao diện mobile bằng React Native
- Tổ chức màn hình với Expo Router
- Tách component/hook dùng chung
- Chuẩn bị nền tảng kết nối với backend JobGo

---

## 🧭 Luồng chức năng hướng tới

```text
👤 Ứng viên đăng nhập / quản lý hồ sơ
🔎 Tìm kiếm công việc phù hợp
💼 Xem chi tiết tin tuyển dụng
❤️ Lưu việc làm quan tâm
📨 Theo dõi ứng tuyển
🏢 Xem thông tin công ty tuyển dụng
```

---

## 🗂️ Cấu trúc thư mục

```text
mobile-jobgo/
├── app/          # Route và màn hình chính
├── src/          # Source code mở rộng
├── hooks/        # Custom hooks
├── assets/       # Hình ảnh, icon, splash
├── scripts/      # Script tiện ích
├── app.json      # Cấu hình Expo
└── package.json  # Scripts và dependencies
```

---

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Framework | Expo, React Native |
| Language | TypeScript |
| Navigation | Expo Router, React Navigation |
| UI runtime | React Native Gesture Handler, Reanimated |
| Tooling | ESLint, npm |

---

## 🚀 Chạy dự án

```bash
npm install
npx expo start
```

Sau đó chọn môi trường:

- 📱 Expo Go
- 🤖 Android Emulator
- 🍎 iOS Simulator
- 🌐 Web Browser

---

## 📜 Scripts thường dùng

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

---

## 📌 Roadmap

- [ ] Hoàn thiện UI danh sách việc làm
- [ ] Thêm màn hình chi tiết job
- [ ] Thêm đăng nhập/đăng ký
- [ ] Kết nối API JobGo backend
- [ ] Thêm lưu công việc yêu thích
- [ ] Thêm profile ứng viên
- [ ] Tối ưu UI/UX mobile

---

<div align="center">

Một mảnh ghép mobile trong hệ sinh thái **JobGo**.  
Developed by [Nhữ Trung Hải](https://github.com/nhutrunghai)

</div>
