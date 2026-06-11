export default function MemoryPhoto({ memory, onClose }) {
  if (!memory) return null;

  return (
    <div className="memory-overlay" role="dialog" aria-modal="true" aria-label={memory.title}>
      <button className="memory-backdrop" type="button" aria-label="Đóng ảnh" onClick={onClose} />
      <article className="memory-card" style={{ "--memory-color": memory.color }}>
        <div className="memory-image-wrap">
          <img src={memory.image} alt={memory.title} />
          <span className="memory-number">{String(memory.id).padStart(2, "0")}</span>
          <div className="memory-sparkles" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="memory-copy">
          <span className="eyebrow">MỘT MẢNH KÝ ỨC</span>
          <h2>{memory.title}</h2>
          <p>{memory.caption}</p>
        </div>
        <button className="memory-close" type="button" onClick={onClose} aria-label="Đóng">
          ×
        </button>
      </article>
    </div>
  );
}
