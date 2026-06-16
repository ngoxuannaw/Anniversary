const captions = [
  ["Sự Khởi Đầu", "Cái nắm tay đầu tiên trước khi chúng mình chính thức đến với nhau"],
  ["Những Bức ảnh chung", "Cùng em, chụp những tấm hình mà có lẽ là đầu tiên với anh."],
  ["Cùng em thử những món", "Những món ăn có lẽ để trở nên ngon hơn nhiều khi ăn với em."],
  ["Cái nắm tay và đôi mắt", "Với anh, anh luôn quý mỗi khi nắm lấy đôi tay em, anh chọn nắm tay em thật chặt."],
  ["Đến sinh nhật bất ngờ của anh", "Sinh nhật, em thật giản dị, khi ở cạnh anh và không lấy 1 tấm hình."],
  ["Một ngày thật vui", "Khoảnh khắc chẳng cần hoàn hảo vẫn là kỷ niệm hoàn hảo, với cái ôm em thật chặt."],
  ["Chuyến đi chơi tới cổ tích", "có lẽ đây nơi đáng nhớ, vì cổ tích cũng lấp lánh tựa thứ nằm tại tay em."],
  ["Những món đồ để luôn nhớ", "Những món đồ không chỉ là đồ mà còn nhắc chúng ta nhớ đến nhau nhiều hơn."],
  ["Những điều bé xíu", "Hạnh phúc đôi khi chỉ là những khoảng khắc đáng yêu của nhau."],
  ["Những điều bé xíu part 2", "thêm thật nhiều điều để cùng chờ đợi."],
  ["Khoảnh khắc bình yên", "Giữa thế giới rộng lớn, bình yên là khi có em ở đây."],
  ["Ngôi sao sáng nhất", "Kỷ niệm đẹp nhất chưa xảy ra, vì mình vẫn còn cả tương lai."],
];

const colors = [
  "#ff9ab8",
  "#9f9cff",
  "#7bd7ff",
  "#ffc88a",
  "#c59cff",
  "#ff88cf",
  "#94e4d4",
  "#8eb7ff",
  "#f6a5ff",
  "#ffd18c",
  "#ae9dff",
  "#ffb2c8",
];

const publicAssetPath = (path) => `${import.meta.env.BASE_URL}${path}`;

export const memories = captions.map(([title, caption], index) => ({
  id: index + 1,
  title,
  caption,
  image: `${import.meta.env.BASE_URL}memories/memory-${String(index + 1).padStart(2, "0")}.jpg`,
  color: colors[index],
  orbitRadius: 3.5 + (index % 4) * 0.72,
  orbitSpeed: 0.055 + (index % 5) * 0.009,
  angle: (Math.PI * 2 * index) / captions.length,
  height: ((index % 5) - 2) * 0.55,
  tilt: ((index % 3) - 1) * 0.2,
}));
