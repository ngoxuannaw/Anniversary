function Flower({ className, delay = "0s" }) {
  return (
    <span className={`flower ${className}`} style={{ "--delay": delay }}>
      <i className="petal petal-a" />
      <i className="petal petal-b" />
      <i className="petal petal-c" />
      <i className="petal petal-d" />
      <i className="petal petal-e" />
      <i className="flower-heart" />
    </span>
  );
}

function Bouquet() {
  return (
    <div className="bouquet" aria-label="Một bó hoa trắng">
      <div className="bouquet-halo" />
      <div className="stems">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <Flower className="flower-one" delay="0s" />
      <Flower className="flower-two" delay=".3s" />
      <Flower className="flower-three" delay=".6s" />
      <Flower className="flower-four" delay=".9s" />
      <Flower className="flower-five" delay="1.2s" />
      <span className="leaf leaf-one" />
      <span className="leaf leaf-two" />
      <span className="leaf leaf-three" />
      <div className="envelope">
        <span className="envelope-flap" />
        <span className="wax-seal">N</span>
      </div>
    </div>
  );
}

export default function HomePage({ onOpen }) {
  return (
    <button className="home-page screen-enter" type="button" onClick={onOpen}>
      <div className="home-stars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="home-copy">
        <span className="eyebrow">A LITTLE SOMETHING FOR YOU</span>
        <h1>
          Hi love, <em>I made this bouquet for you.</em>
        </h1>
      </div>
      <Bouquet />
      <div className="open-prompt">
        <span>Chạm để mở bức thư</span>
        <i aria-hidden="true">↓</i>
      </div>
    </button>
  );
}
