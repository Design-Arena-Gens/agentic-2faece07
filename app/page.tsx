"use client";

import { useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

type Preset = 'Default' | 'Reader' | 'Dyslexia-friendly' | 'Large print';

function useSafeLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => initialValue);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (raw != null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export default function Page() {
  const [theme, setTheme] = useSafeLocalStorage<Theme>('readable:theme', 'light');
  const [fontFamily, setFontFamily] = useSafeLocalStorage<'system' | 'atkinson'>('readable:font', 'system');
  const [fontSize, setFontSize] = useSafeLocalStorage<number>('readable:fontSize', 18);
  const [lineHeight, setLineHeight] = useSafeLocalStorage<number>('readable:lineHeight', 1.65);
  const [letterSpacing, setLetterSpacing] = useSafeLocalStorage<number>('readable:letterSpacing', 0);
  const [wordSpacing, setWordSpacing] = useSafeLocalStorage<number>('readable:wordSpacing', 0);
  const [maxWidthCh, setMaxWidthCh] = useSafeLocalStorage<number>('readable:maxWidth', 68);
  const [paraSpacingEm, setParaSpacingEm] = useSafeLocalStorage<number>('readable:paraSpacing', 0.75);
  const [inputText, setInputText] = useSafeLocalStorage<string>('readable:text', '');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--reader-font', fontFamily === 'atkinson' ? 'var(--font-atkinson), var(--font-sans)' : 'var(--font-sans)');
    root.style.setProperty('--reader-font-size', `${fontSize}px`);
    root.style.setProperty('--reader-line-height', String(lineHeight));
    root.style.setProperty('--reader-letter-spacing', `${letterSpacing}em`);
    root.style.setProperty('--reader-word-spacing', `${wordSpacing}px`);
    root.style.setProperty('--reader-max-width', `${maxWidthCh}ch`);
    root.style.setProperty('--reader-paragraph-spacing', `${paraSpacingEm}em`);
  }, [fontFamily, fontSize, lineHeight, letterSpacing, wordSpacing, maxWidthCh, paraSpacingEm]);

  const presets: Record<Preset, () => void> = useMemo(() => ({
    'Default': () => {
      setFontFamily('system'); setFontSize(18); setLineHeight(1.65); setLetterSpacing(0); setWordSpacing(0); setMaxWidthCh(68); setParaSpacingEm(0.75); setTheme('light');
    },
    'Reader': () => {
      setFontFamily('system'); setFontSize(19); setLineHeight(1.7); setLetterSpacing(0.005); setWordSpacing(1); setMaxWidthCh(65); setParaSpacingEm(0.9); setTheme('light');
    },
    'Dyslexia-friendly': () => {
      setFontFamily('atkinson'); setFontSize(20); setLineHeight(1.8); setLetterSpacing(0.02); setWordSpacing(2); setMaxWidthCh(60); setParaSpacingEm(1.0); setTheme('light');
    },
    'Large print': () => {
      setFontFamily('system'); setFontSize(22); setLineHeight(1.9); setLetterSpacing(0.01); setWordSpacing(1); setMaxWidthCh(58); setParaSpacingEm(1.1); setTheme('high-contrast');
    }
  }), [setFontFamily, setFontSize, setLineHeight, setLetterSpacing, setWordSpacing, setMaxWidthCh, setParaSpacingEm, setTheme]);

  const sample = `Readable makes long-form text easier to consume.\n\nUse the controls to adjust font size, line-height, letter spacing, and contrast. Your preferences persist automatically.\n\nPrinciples:\n- Optimal line length: ~60?75 characters\n- Generous line-height improves scanability\n- Adequate contrast reduces eye strain`;

  return (
    <div className="container">
      <header className="header">
        <div className="header-inner">
          <div className="brand" aria-label="Readable">Readable</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['light','dark','high-contrast'] as Theme[]).map(t => (
              <button key={t} className="button" aria-pressed={theme===t} onClick={() => setTheme(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        <section className="panel" aria-labelledby="controls-heading">
          <h2 id="controls-heading" style={{ marginBottom: '0.75rem' }}>Readability controls</h2>
          <div className="controls" role="group" aria-label="Readability controls">
            <div className="field">
              <label htmlFor="font-family">Font</label>
              <select id="font-family" value={fontFamily} onChange={e => setFontFamily(e.target.value as any)}>
                <option value="system">System sans</option>
                <option value="atkinson">Atkinson Hyperlegible</option>
              </select>
              <small>Choose a legible typeface</small>
            </div>

            <div className="field">
              <label htmlFor="font-size">Font size: {fontSize}px</label>
              <input id="font-size" type="range" min={14} max={26} step={1} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
              <small>Base body size</small>
            </div>

            <div className="field">
              <label htmlFor="line-height">Line height: {lineHeight.toFixed(2)}</label>
              <input id="line-height" type="range" min={1.2} max={2.0} step={0.01} value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} />
              <small>Vertical spacing between lines</small>
            </div>

            <div className="field">
              <label htmlFor="letter-spacing">Letter spacing: {letterSpacing.toFixed(2)}em</label>
              <input id="letter-spacing" type="range" min={-0.02} max={0.1} step={0.005} value={letterSpacing} onChange={e => setLetterSpacing(Number(e.target.value))} />
              <small>Space between characters</small>
            </div>

            <div className="field">
              <label htmlFor="word-spacing">Word spacing: {wordSpacing}px</label>
              <input id="word-spacing" type="range" min={0} max={6} step={1} value={wordSpacing} onChange={e => setWordSpacing(Number(e.target.value))} />
              <small>Space between words</small>
            </div>

            <div className="field">
              <label htmlFor="max-width">Line length: {maxWidthCh}ch</label>
              <input id="max-width" type="range" min={50} max={85} step={1} value={maxWidthCh} onChange={e => setMaxWidthCh(Number(e.target.value))} />
              <small>Desired characters per line</small>
            </div>

            <div className="field">
              <label htmlFor="para-space">Paragraph spacing: {paraSpacingEm.toFixed(2)}em</label>
              <input id="para-space" type="range" min={0.4} max={1.4} step={0.05} value={paraSpacingEm} onChange={e => setParaSpacingEm(Number(e.target.value))} />
              <small>Space after paragraphs</small>
            </div>
          </div>

          <div className="preset-row" aria-label="Presets">
            {(['Default','Reader','Dyslexia-friendly','Large print'] as Preset[]).map(name => (
              <button key={name} className="button" onClick={() => presets[name]()}>{name}</button>
            ))}
          </div>
        </section>

        <section className="reader-shell">
          <div className="panel">
            <label htmlFor="paste" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Paste text to read</label>
            <textarea id="paste" className="textarea" placeholder="Paste or type text here..." value={inputText} onChange={e => setInputText(e.target.value)} />
          </div>

          <article className="panel reader" aria-label="Preview">
            <h1>Make everything readable</h1>
            {(inputText || sample).split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </article>
        </section>
      </main>

      <footer className="footer">
        <p>Preferences are saved to your device automatically.</p>
      </footer>
    </div>
  );
}
