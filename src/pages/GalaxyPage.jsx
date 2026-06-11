import { useCallback, useEffect, useState } from "react";
import GalaxyScene from "../components/GalaxyScene";
import HandControls from "../components/HandControls";
import MemoryPhoto from "../components/MemoryPhoto";
import { memories } from "../data/memories";

export default function GalaxyPage({ onBack }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [heldMemory, setHeldMemory] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [manualRotation, setManualRotation] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const focusByTurn = useCallback((delta) => {
    setManualRotation((current) => current + delta);
    setFocusedIndex((current) => {
      if (delta > 0.025) return (current + 1) % memories.length;
      if (delta < -0.025) return (current - 1 + memories.length) % memories.length;
      return current;
    });
  }, []);

  const holdFocused = useCallback(() => {
    setHeldMemory(memories[focusedIndex]);
  }, [focusedIndex]);

  const openHeld = useCallback(() => {
    if (heldMemory) setSelectedMemory(heldMemory);
  }, [heldMemory]);

  const closeMemory = useCallback(() => {
    setSelectedMemory(null);
    setHeldMemory(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMemory();
      if (event.key === "ArrowLeft") focusByTurn(-0.18);
      if (event.key === "ArrowRight") focusByTurn(0.18);
      if (event.key === "Enter") setSelectedMemory(memories[focusedIndex]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMemory, focusByTurn, focusedIndex]);

  return (
    <section className="galaxy-page screen-enter">
      <GalaxyScene
        memories={memories}
        manualRotation={manualRotation}
        focusedIndex={focusedIndex}
        heldMemory={heldMemory}
        selectedMemory={selectedMemory}
        onFocus={setFocusedIndex}
        onSelect={(memory) => {
          setHeldMemory(memory);
          setSelectedMemory(memory);
        }}
      />

      <header className="galaxy-header">
        <button className="ghost-button" type="button" onClick={onBack}>
          ← Bức thư
        </button>
        <div>
          <span className="eyebrow">MEMORY GALAXY</span>
          <h1>Vũ trụ của chúng mình</h1>
        </div>
        <button className="ghost-button guide-toggle" type="button" onClick={() => setShowGuide(true)}>
          Cách khám phá
        </button>
      </header>

      <div className="galaxy-hint">
        <span>✦</span>
        Kéo để xoay · Chạm một cụm sao để mở
      </div>

      <div className="memory-progress" aria-label={`Đang chọn kỷ niệm ${focusedIndex + 1}`}>
        {memories.map((memory, index) => (
          <button
            key={memory.id}
            type="button"
            className={focusedIndex === index ? "is-active" : ""}
            aria-label={`Chọn ${memory.title}`}
            onClick={() => setFocusedIndex(index)}
          />
        ))}
      </div>

      <HandControls
        onTurn={focusByTurn}
        onHold={holdFocused}
        onOpen={openHeld}
        onClose={closeMemory}
      />

      {showGuide && (
        <div className="guide-overlay">
          <button className="memory-backdrop" type="button" onClick={() => setShowGuide(false)} aria-label="Đóng" />
          <article className="guide-card">
            <span className="eyebrow">ĐIỀU KHIỂN BẰNG TAY</span>
            <h2>Ba cử chỉ, cả một vũ trụ</h2>
            <div className="gesture-grid">
              <div><b>☝</b><strong>Một ngón tay</strong><p>Di chuyển sang trái hoặc phải để xoay vòng sao.</p></div>
              <div><b>✊</b><strong>Nắm tay</strong><p>Giữ cụm sao đang được đánh dấu.</p></div>
              <div><b>✋</b><strong>Xòe tay</strong><p>Mở ảnh đã giữ. Nắm tay lại để đóng.</p></div>
            </div>
            <button className="primary-button" type="button" onClick={() => setShowGuide(false)}>Đã hiểu</button>
          </article>
        </div>
      )}

      <MemoryPhoto memory={selectedMemory} onClose={closeMemory} />
    </section>
  );
}
