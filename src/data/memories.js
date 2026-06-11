const captions = [
  ["Lần đầu mình gặp nhau", "Một khởi đầu thật nhẹ nhàng, nhưng đã thay đổi cả bầu trời."],
  ["Chuyến đi đầu tiên", "Cùng em, nơi xa lạ nào cũng trở thành nơi đáng nhớ."],
  ["Một chiều đầy nắng", "Ánh nắng hôm ấy đẹp, nụ cười của em còn đẹp hơn."],
  ["Quán quen của chúng mình", "Một góc nhỏ, hai món quen, và rất nhiều chuyện để kể."],
  ["Ngày mưa bất chợt", "Mưa khiến mình đi chậm lại, vừa đủ để ở cạnh nhau lâu hơn."],
  ["Một ngày thật vui", "Khoảnh khắc chẳng cần hoàn hảo vẫn là kỷ niệm hoàn hảo."],
  ["Bữa tối đặc biệt", "Món ngon nhất luôn là món được ăn cùng em."],
  ["Lần mình đi thật xa", "Thêm một nơi trên bản đồ mang tên ký ức của chúng mình."],
  ["Những điều bé xíu", "Hạnh phúc đôi khi chỉ là một cái nhìn hiểu ý."],
  ["Sinh nhật đáng nhớ", "Thêm một tuổi mới, thêm thật nhiều điều để cùng chờ đợi."],
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

export const memories = captions.map(([title, caption], index) => ({
  id: index + 1,
  title,
  caption,
  image: `/memories/memory-${String(index + 1).padStart(2, "0")}.svg`,
  color: colors[index],
  orbitRadius: 3.5 + (index % 4) * 0.72,
  orbitSpeed: 0.055 + (index % 5) * 0.009,
  angle: (Math.PI * 2 * index) / captions.length,
  height: ((index % 5) - 2) * 0.55,
  tilt: ((index % 3) - 1) * 0.2,
}));
