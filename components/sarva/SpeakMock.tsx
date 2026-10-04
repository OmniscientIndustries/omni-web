import { Check, Chip, MockPanel } from "./MockPanel";

const languages = [
  { label: "English", lang: "en" },
  { label: "Polski", lang: "pl" },
  { label: "اردو", lang: "ur" },
  { label: "ਪੰਜਾਬੀ", lang: "pa" },
  { label: "हिन्दी", lang: "hi" },
  { label: "العربية", lang: "ar" },
];

const wave = [4, 9, 14, 7, 18, 24, 12, 20, 28, 16, 10, 22, 14, 8, 18, 26, 12, 6, 15, 9, 20, 11, 5, 13];

export function SpeakMock() {
  return (
    <MockPanel
      title="SARVA · New report"
      label="Illustrative reporting interface: choose a language, write or speak, attach evidence, review before submitting, give explicit consent and receive a private reference."
    >
      <div className="flex flex-wrap gap-2">
        {languages.map((l, i) => (
          <span key={l.lang} lang={l.lang}>
            <Chip active={i === 0}>{l.label}</Chip>
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-line p-1">
        <span className="rounded-lg py-2 text-center text-[0.8125rem] text-stone">Write</span>
        <span className="flex items-center justify-center gap-2 rounded-lg bg-gold/12 py-2 text-[0.8125rem] text-gold-bright">
          <span className="size-1.5 rounded-full bg-gold-bright" /> Speak
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-ink-950/60 p-4">
        <div className="flex h-10 items-center gap-[3px]">
          {wave.map((h, i) => (
            <span key={i} className="w-[3px] rounded-full bg-gold/70" style={{ height: `${h + 6}px`, opacity: 0.4 + (i % 5) * 0.12 }} />
          ))}
        </div>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-stone">
          Describe what happened, in your own words and language. You can pause, re-record or switch to writing at any time.
        </p>
      </div>

      <div className="mt-4">
        <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Evidence (optional)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip>▣ Photo</Chip>
          <Chip>◉ Audio note</Chip>
          <Chip>+ Add</Chip>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-[0.8125rem] text-bone/85">
        <p className="flex items-center gap-3"><Check /> I have reviewed my report before submitting</p>
        <p className="flex items-center gap-3"><Check /> I consent to authorised staff reviewing this report</p>
        <p className="flex items-center gap-3"><Check on={false} /> <span className="text-stone">Share anonymised details for community patterns</span></p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-line-strong bg-gold/[0.06] px-4 py-3">
        <span className="text-[0.75rem] text-stone">Private reference</span>
        <span className="font-mono text-[0.8125rem] tracking-[0.12em] text-gold-bright">SRV-7Q4K-••••</span>
      </div>
    </MockPanel>
  );
}
