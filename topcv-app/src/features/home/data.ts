import type { HomeArticleItem } from '@/src/features/home/types';

export const homeHeader = {
  botImage:
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80',
  profileImage:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
};

export const quickActions = [
  {
    label: 'Việc làm',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=140&q=80',
  },
  {
    label: 'TopCV Pro',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=140&q=80',
  },
  {
    label: 'Tạo CV',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=140&q=80',
  },
  {
    label: 'Công cụ',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=140&q=80',
  },
  {
    label: 'Blog',
    image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=140&q=80',
  },
];

export const suggestedJobs = [
  {
    title: 'Kế toán trưởng - 2 năm kinh nghiệm - Tại Hải Phòng',
    company: 'CÔNG TY TNHH TÂN HƯNG THỊNH HOLDINGS',
    salary: 'Thỏa thuận',
    location: 'Hải Phòng (mới)',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&q=80',
    highlighted: true,
  },
  {
    title: 'Kế toán tổng hợp nội bộ cho hệ thống bán lẻ',
    company: 'CÔNG TY CỔ PHẦN DỊCH VỤ TÀI CHÍNH HẢI ÂU',
    salary: '18 - 22 triệu',
    location: 'Hà Nội',
    image:
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=160&q=80',
  },
  {
    title: 'Chuyên viên nhân sự tổng hợp - ưu tiên có kinh nghiệm tuyển dụng',
    company: 'CÔNG TY TNHH NHÂN LỰC MINH TÂM',
    salary: '14 - 18 triệu',
    location: 'Hồ Chí Minh',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=160&q=80',
  },
  {
    title: 'Kế toán trưởng cho công ty sản xuất linh kiện điện tử',
    company: 'CÔNG TY TNHH GLOBAL HI-TEK PRECISION',
    salary: '45 - 50 triệu',
    location: 'Hải Phòng (mới)',
    image:
      'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=160&q=80',
  },
];

export const bestJobs = [
  {
    title: 'Nhân viên kinh doanh B2B - thị trường Hà Nội',
    company: 'CÔNG TY CỔ PHẦN OPEN HEALTHCARE',
    salary: 'Thỏa thuận',
    location: 'Hà Nội',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=160&q=80',
    highlighted: true,
  },
  {
    title: 'Trưởng phòng dự toán công trình nội thất cao cấp',
    company: 'CÔNG TY TNHH VMD VIỆT NAM',
    salary: '18 - 25 triệu',
    location: 'Hà Nội',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=160&q=80',
    badge: 'bolt' as const,
    highlighted: true,
  },
  {
    title: 'Ecommerce Business Manager cho ngành bán lẻ',
    company: 'CÔNG TY TNHH LEVER SPHERE VIỆT NAM',
    salary: 'Thỏa thuận',
    location: 'Hà Nội',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=160&q=80',
    highlighted: true,
  },
  {
    title: 'Kế toán tổng hợp - mức lương 18-25M tại Hà Nội',
    company: 'CÔNG TY CỔ PHẦN ĐẦU TƯ TÀI CHÍNH IFT',
    salary: '18 - 25 triệu',
    location: 'Hà Nội',
    image:
      'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=160&q=80',
    highlighted: true,
  },
];

export const successArticles: HomeArticleItem[] = [
  {
    id: 'nhan-vien-san-xuat-la-gi',
    title: 'Nhân viên sản xuất là gì? Mức lương và cơ hội việc làm',
    subtitle:
      'Bức tranh nghề nghiệp, kỹ năng và lộ trình phát triển trong lĩnh vực sản xuất.',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=420&q=80',
    category: 'Kinh nghiệm thành công',
    author: 'TopCV Career Lab',
    publishedAt: '22/04/2026',
    readTime: '6 phút đọc',
    highlight:
      'Hiểu đúng về vai trò, mức thu nhập và lộ trình phải đi qua để theo đuổi công việc sản xuất ổn định.',
    sections: [
      {
        heading: 'Công việc chủ yếu',
        paragraphs: [
          'Nhân viên sản xuất tham gia trực tiếp vào dây chuyền, theo dõi tiến độ và đảm bảo sản phẩm đạt tiêu chuẩn.',
          'Ngoài thao tác máy móc, vị trí này còn yêu cầu khả năng phối hợp với QA, kho và tổ trưởng để xử lý lỗi nhanh.',
        ],
        bullets: [
          'Kiểm tra nguyên vật liệu đầu vào và chất lượng đầu ra.',
          'Tuân thủ an toàn lao động, 5S và quy trình vận hành.',
          'Ghi nhận sản lượng, bất thường và báo cáo cuối ca.',
        ],
      },
      {
        heading: 'Mức lương và cơ hội',
        paragraphs: [
          'Thu nhập phụ thuộc vào ngành, quy mô doanh nghiệp và cơ chế tăng ca. Ở nhiều khu công nghiệp, nhân sự có tay nghề ổn định có thể đi lên tổ phó, tổ trưởng hoặc giám sát.',
          'Người mới bắt đầu nên nhìn vào cả lương cơ bản, trợ cấp ca, bảo hiểm và cơ hội đào tạo thay vì chỉ nhìn vào con số cứng.',
        ],
      },
      {
        heading: 'Kỹ năng nên chuẩn bị',
        paragraphs: [
          'Doanh nghiệp thường đánh giá cao sự kỷ luật, khả năng làm việc theo ca và tinh thần hợp tác.',
        ],
        bullets: [
          'Đọc hiểu quy trình và thao tác tiêu chuẩn.',
          'Giữ tốc độ làm việc ổn định mà vẫn chắc chắn.',
          'Biết ghi nhận và phản hồi sự cố đúng luồng.',
        ],
      },
    ],
  },
  {
    id: 'cau-hoi-phong-van-thuong-gap',
    title: 'Câu hỏi phỏng vấn thường gặp và cách trả lời ấn tượng',
    subtitle:
      'Những mẫu trả lời gọn, đúng ý và đủ sắc để vượt qua vòng phỏng vấn đầu tiên.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=420&q=80',
    category: 'Phỏng vấn',
    author: 'TopCV Career Lab',
    publishedAt: '20/04/2026',
    readTime: '5 phút đọc',
    highlight:
      'Chuẩn bị trước khung trả lời giúp bạn ngắn gọn, rõ ràng và tạo ấn tượng chuyên nghiệp ngay từ vấn đề đầu tiên.',
    sections: [
      {
        heading: 'Cách mở đầu gây thiện cảm',
        paragraphs: [
          'Câu hỏi giới thiệu bản thân luôn xuất hiện. Điều nhà tuyển dụng cần không phải một bài kể dài, mà là bức tranh nhanh về năng lực và hướng phù hợp với vị trí.',
        ],
        bullets: [
          '1 câu về hiện trạng công việc.',
          '1 câu về kinh nghiệm liên quan nhất.',
          '1 câu về lý do bạn hợp vai trò.',
        ],
      },
      {
        heading: 'Trả lời câu hỏi về điểm mạnh',
        paragraphs: [
          'Nên gắn điểm mạnh với kết quả công việc. Thay vì nói "em chịu áp lực tốt", hãy nói bạn đã xử lý deadline hay điều phối việc như thế nào.',
          'Câu trả lời hiệu quả nhất thường có tình huống, hành động và kết quả.',
        ],
      },
      {
        heading: 'Khi được hỏi về điểm yếu',
        paragraphs: [
          'Không nên trả lời quá an toàn kiểu "em cầu toàn". Hãy chọn điểm còn thiếu thật, nhưng phải có hướng khắc phục cụ thể.',
        ],
      },
    ],
  },
  {
    id: 'doi-viec-khong-mat-da-tang-truong',
    title: 'Làm sao để đổi việc mà không mất đà tăng trưởng sự nghiệp',
    subtitle:
      'Cách đánh giá thời điểm nhảy việc và thương lượng mức lương tốt hơn.',
    image:
      'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=420&q=80',
    category: 'Chuyển việc',
    author: 'TopCV Career Lab',
    publishedAt: '18/04/2026',
    readTime: '7 phút đọc',
    highlight:
      'Nghỉ việc đúng nhịp là quyết định chiến lược, không phải phản xạ cảm xúc. Bạn cần đổi việc khi có đích đến rõ ràng.',
    sections: [
      {
        heading: 'Dấu hiệu nên chuyển việc',
        paragraphs: [
          'Nếu bạn không còn học thêm được gì, lộ trình thăng tiến mờ nhạt hoặc môi trường không phù hợp giá trị làm việc, đó là tín hiệu nên đánh giá lại.',
        ],
      },
      {
        heading: 'Chuẩn bị trước khi rời đi',
        paragraphs: [
          'Hãy cập nhật CV, portfolio và danh sách thành tựu có thể đo lường được. Đây là chất liệu để bạn thương lượng với công ty mới.',
        ],
        bullets: [
          'Chốt 3-5 thành tựu có số liệu.',
          'Xác định ngưỡng lương mong muốn.',
          'Lọc công ty theo vai trò, văn hóa và quyền tự chủ.',
        ],
      },
    ],
  },
];

export const cvGuides: HomeArticleItem[] = [
  {
    id: 'mau-muc-tieu-nghe-nghiep-nhan-su',
    title: 'Lưu lại ngay các mẫu mục tiêu nghề nghiệp nhân sự ấn tượng nhất',
    subtitle:
      'Viết gọn, đúng trọng tâm và vẫn thể hiện được định hướng nghề nghiệp rõ ràng.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=420&q=80',
    category: 'Hướng dẫn viết CV',
    author: 'TopCV CV Studio',
    publishedAt: '16/04/2026',
    readTime: '4 phút đọc',
    highlight:
      'Mục tiêu nghề nghiệp tốt không cần dài, nhưng phải cho thấy bạn nhắm đúng vai trò và có giá trị gì cho doanh nghiệp.',
    sections: [
      {
        heading: 'Khung viết ngắn gọn',
        paragraphs: [
          'Mục tiêu nghề nghiệp nên trong 2-3 dòng, trả lời được bạn là ai, mong muốn gì và sẽ đóng góp ra sao.',
        ],
        bullets: [
          'Nêu vai trò hoặc chuyên môn.',
          'Gắn với kinh nghiệm hoặc điểm mạnh chính.',
          'Kết bằng giá trị mang lại cho công ty.',
        ],
      },
      {
        heading: 'Lỗi thực tế cần tránh',
        paragraphs: [
          'Tránh copy mẫu chung chung như "mong muốn được làm việc trong môi trường năng động". Nhà tuyển dụng đọc rất nhiều CV và nhận ra ngay nội dung khuôn mẫu.',
        ],
      },
    ],
  },
  {
    id: 'viet-ky-nang-chuyen-mon-cho-sinh-vien',
    title: 'Hướng dẫn viết kỹ năng chuyên môn trong CV cho sinh viên mới ra trường',
    subtitle:
      'Cách chọn kỹ năng, diễn đạt mức độ thành thạo và tránh liệt kê lan man.',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=420&q=80',
    category: 'CV cho người mới',
    author: 'TopCV CV Studio',
    publishedAt: '14/04/2026',
    readTime: '5 phút đọc',
    highlight:
      'Nhà tuyển dụng không cần bạn biết mọi thứ, nhưng cần thấy bạn hiểu mình biết gì và dùng nền tảng đó cho vị trí đang ứng tuyển.',
    sections: [
      {
        heading: 'Nên liệt kê kiểu nào',
        paragraphs: [
          'Hãy chia kỹ năng theo nhóm: chuyên môn, công cụ và kỹ năng bổ trợ. Cách này giúp CV dễ thở và nhìn có tổ chức hơn.',
        ],
        bullets: [
          'Chọn kỹ năng khóa theo JD.',
          'Ưu tiên thứ bạn từng dùng trong đồ án, thực tập hoặc freelance.',
          'Không liệt kê quá 8-10 đầu mục.',
        ],
      },
      {
        heading: 'Cách thể hiện mức độ',
        paragraphs: [
          'Thay vì thấm sao mơ hồ, hãy dùng minh chứng ngắn: "Excel - làm dashboard bán hàng", "Figma - thiết kế wireframe mobile".',
        ],
      },
    ],
  },
  {
    id: 'checklist-ra-soat-cv-truoc-khi-gui',
    title: 'Checklist rà soát CV trước khi bấm gửi cho nhà tuyển dụng',
    subtitle:
      'Một vòng kiểm tra cuối để tránh lỗi trình bày, lỗi chính tả và nội dung dư thừa.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=420&q=80',
    category: 'Checklist CV',
    author: 'TopCV CV Studio',
    publishedAt: '12/04/2026',
    readTime: '3 phút đọc',
    highlight:
      'Trước khi gửi CV, nên dành 5 phút rà soát lại những điểm cơ bản như file, chính tả và sự phù hợp với JD.',
    sections: [
      {
        heading: 'Những điểm không được bỏ qua',
        paragraphs: [
          'Nhiều CV bị loại không phải vì thiếu năng lực mà vì sử dụng file khó mở, email thiếu chuyên nghiệp hoặc trình bày rối.',
        ],
        bullets: [
          'Tên file chuyên nghiệp, dễ tìm.',
          'Số điện thoại, email, link portfolio còn dùng được.',
          'Mô tả công việc nhất quán, không sai mốc thời gian.',
        ],
      },
      {
        heading: 'Sau cùng hãy nhìn theo góc nhà tuyển dụng',
        paragraphs: [
          'Mở lại JD và tự hỏi: CV này đã cho thấy 2-3 lý do nên phỏng vấn bạn chưa? Nếu chưa, hãy chỉnh lại phần summary và kinh nghiệm trước khi gửi.',
        ],
      },
    ],
  },
];

export const allHomeArticles = [...successArticles, ...cvGuides];

export function findHomeArticleById(articleId?: string) {
  if (!articleId) {
    return undefined;
  }

  return allHomeArticles.find((article) => article.id === articleId);
}

export const bottomNavItems = [
  { key: 'home', label: 'Trang chủ', icon: 'home', active: true },
  { key: 'cv', label: 'Đã ứng tuyển', icon: 'briefcase' },
  { key: 'match', label: 'JobBot AI', icon: 'message-circle', badge: 'New' },
  { key: 'notice', label: 'Thông báo', icon: 'bell' },
  { key: 'profile', label: 'Tài khoản', icon: 'user' },
] as const;
