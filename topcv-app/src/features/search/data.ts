export const popularKeywords = [
  "tiếng hàn",
  "lập trình viên php",
  "tiếng trung",
  "trợ lý giám đốc",
  "giáo viên tiếng anh",
] as const;

export const suggestedSearchJobs = [
  {
    id: "search-accounting-manager",
    title: "Kế Toán Trưởng - Lương Từ 20Tr Trở Lên...",
    company: "Tập Đoàn Công Nghiệp Đa Quốc Gia",
    salary: "20 - 35 triệu",
    location: "Hải Phòng",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&q=80",
    favorite: false,
  },
  {
    id: "search-recruitment-specialist",
    title: "Chuyên Viên Tuyển Dụng Cao Cấp",
    company: "Green Valley Group Ltd",
    salary: "Thỏa thuận",
    location: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=160&q=80",
    favorite: true,
  },
  {
    id: "search-coo",
    title: "Giám Đốc Vận Hành (COO)",
    company: "StartUp Unicorn Asia",
    salary: "Up to $4000",
    location: "TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=160&q=80",
    favorite: false,
  },
] as const;

export const searchedJobs = [
  {
    id: "back-end-developer",
    title: "Back-End Developer",
    company: "CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ TRIPLAYS",
    salary: "15 - 20 triệu",
    location: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=140&q=80",
    highlighted: true,
  },
  {
    id: "backend-engineer-vietnam",
    title: "Backend Engineer (Kỹ Sư Back-End) – Khu Vực Việt Nam",
    company: "CÔNG TY TNHH SONIC FUSION",
    salary: "26.5 - 55 triệu",
    location: "Hồ Chí Minh (mới)",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=140&q=80",
    highlighted: true,
  },
  {
    id: "senior-java-backend",
    title: "Senior Java Back-End Engineer",
    company: "Công ty Cổ Phần Bản Viên",
    salary: "Thỏa thuận",
    location: "Hồ Chí Minh (mới)",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=140&q=80",
    highlighted: false,
  },
  {
    id: "junior-laravel-backend",
    title: "Junior Laravel Back-End Developer",
    company: "Công ty Cổ Phần Dịch vụ Đào tạo trực tuyến OES",
    salary: "Thỏa thuận",
    location: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=140&q=80",
    highlighted: false,
  },
] as const;

export const searchFilters = [
  { key: "filter" },
  { key: "experience", label: "Kinh nghiệm" },
  { key: "salary", label: "Mức lương" },
] as const;
