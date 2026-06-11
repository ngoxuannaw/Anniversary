import { letter } from "../data/letter";

export default function LetterPage({ onBack, onEnter }) {
  return (
    <section className="letter-page screen-enter">
      <div className="letter-orb letter-orb-one" />
      <div className="letter-orb letter-orb-two" />
      <button className="ghost-button back-button" type="button" onClick={onBack}>
        ← Quay lại
      </button>

      <article className="letter-paper">
        <div className="paper-flower" aria-hidden="true">✦</div>
        <span className="eyebrow">{letter.eyebrow}</span>
        <h2>{letter.title}</h2>
        <div className="letter-body">
          {letter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="letter-ending">{letter.ending}</p>
        <p className="letter-signature">{letter.signature}</p>
        <button className="primary-button" type="button" onClick={onEnter}>
          Bước vào vũ trụ ký ức
          <span aria-hidden="true">✦</span>
        </button>
      </article>
    </section>
  );
}
