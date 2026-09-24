/**
 * Lesson page — the "learn" half of a course.
 *
 * A learner lands here before they ever see a code editor: analogy first, then
 * the explanation, then worked examples, then the traps, then interview prep.
 * The Practice button at the end is the hand-off to the problem solver.
 *
 * Language follows the global preference from the navbar. Every section falls
 * back to English when a Hinglish translation has not been written yet, so a
 * half-translated lesson still renders completely.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePreferences } from '../../hooks/usePreferences';
import { Markdown } from '../../components/Markdown';
import { Teleprompter } from '../../components/Teleprompter';
import { SpeakButton } from '../../components/SpeakButton';
import { GuitarPracticePlayer, type PracticeSequence } from '../../components/GuitarPracticePlayer';
import { GuitarHearingTest } from '../../components/GuitarHearingTest';
import '../styles/topic-lesson.css';

interface Example {
  title: string;
  titleHi?: string;
  code: string;
  /** Textual result. Omitted for visual lessons, where `preview` carries it. */
  output?: string;
  /**
   * A complete HTML document rendered in a sandboxed iframe. CSS and HTML have
   * to be seen rather than described, so visual lessons ship this instead of
   * (or as well as) a text output.
   */
  preview?: string;
  /** Rendered height in px; tall demos such as grids need more room. */
  previewHeight?: number;
  /**
   * JS/TS pair (React course). When both are present, the single page-level
   * JS ⇄ TS toggle picks between these instead of `code`/`output`.
   */
  codeJs?: string;
  codeTs?: string;
  outputJs?: string;
  outputTs?: string;
  explain: string;
  explainHi?: string;
}

interface Mistake {
  wrong: string;
  right: string;
  /** Side-by-side previews, so the reader sees the breakage before the fix. */
  previewWrong?: string;
  previewRight?: string;
  previewHeight?: number;
  why: string;
  whyHi?: string;
}

interface QA {
  q: string;
  qHi?: string;
  a: string;
  aHi?: string;
  code?: string;
}

interface Exercise {
  task: string;
  taskHi?: string;
  hint: string;
  hintHi?: string;
}

interface VocabWord {
  word: string;
  wordHi?: string;
  meaning: string;
  meaningHi?: string;
  example: string;
  exampleHi?: string;
  pronunciation: string;
}

interface Topic {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  simple?: string;
  simpleHi?: string;
  content?: string;
  contentHi?: string;
  readingPassage?: string;
  readingPassageHi?: string;
  vocabulary?: VocabWord[];
  guitarPractice?: {
    sequences?: PracticeSequence[];
    earTraining?: { string: number; fret: number }[];
  };
  difficulty: string;
  duration: number;
  analogy?: { en?: string; hi?: string };
  examples?: Example[];
  mistakes?: Mistake[];
  realWorld?: { en: string; hi?: string }[];
  interviewQA?: QA[];
  exercises?: Exercise[];
  keyTakeaways?: string[];
  keyTakeawaysHi?: string[];
  module?: { slug: string; name: string; nameHi?: string; order: number };
  problems?: { slug: string; title: string; difficulty: string; xpReward: number }[];
}

interface LessonResponse {
  course: { slug: string; name: string; nameHi?: string; icon: string; color: string };
  topic: Topic;
  prev: { slug: string; title: string; titleHi?: string } | null;
  next: { slug: string; title: string; titleHi?: string } | null;
  position: number;
  total: number;
}

/**
 * Renders a lesson's HTML/CSS demo.
 *
 * The document is authored by us in the seed, never by a user, but it still
 * runs in a sandboxed iframe with no `allow-scripts`: a lesson demo has no
 * reason to execute JavaScript, and denying it means a mistake in seed content
 * can never become a script running on the app's origin.
 */
function Preview({ html, height = 140, label }: { html: string; height?: number; label?: string }) {
  return (
    <figure className="preview">
      <figcaption className="preview-label">{label ?? 'Result'}</figcaption>
      <iframe
        className="preview-frame"
        style={{ height }}
        srcDoc={html}
        sandbox=""
        loading="lazy"
        title={label ?? 'Rendered result'}
      />
    </figure>
  );
}

/** Sections are collapsible so a long lesson stays scannable. */
function Section({
  id,
  icon,
  title,
  children,
  defaultOpen = true,
}: {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="lesson-section" id={id}>
      <button className="section-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="section-icon">{icon}</span>
        <h2>{title}</h2>
        <span className={`chevron ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && <div className="section-body">{children}</div>}
    </section>
  );
}

export default function TopicLesson() {
  const { courseSlug, topicSlug } = useParams<{ courseSlug: string; topicSlug: string }>();
  const navigate = useNavigate();
  const { lang, t } = usePreferences();

  const [data, setData] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openQA, setOpenQA] = useState<number | null>(null);
  const [openHint, setOpenHint] = useState<number | null>(null);
  const [codeLang, setCodeLang] = useState<'js' | 'ts'>('js');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseSlug}/topics/${topicSlug}`);
        if (!res.ok) throw new Error('Lesson not found');
        const json = (await res.json()) as LessonResponse;
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load lesson');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // Collapsed answers from the previous lesson should not carry over.
    setOpenQA(null);
    setOpenHint(null);
    window.scrollTo({ top: 0 });

    return () => {
      cancelled = true;
    };
  }, [courseSlug, topicSlug]);

  if (loading) {
    return (
      <div className="lesson-page state">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="lesson-page state">
        <h2>{error ?? 'Lesson not found'}</h2>
        <button className="primary-btn" onClick={() => navigate(`/courses/${courseSlug}`)}>
          Back to course
        </button>
      </div>
    );
  }

  const { course, topic, prev, next, position, total } = data;
  const practice = topic.problems?.[0];
  const takeaways =
    lang === 'hi' && topic.keyTakeawaysHi?.length ? topic.keyTakeawaysHi : topic.keyTakeaways ?? [];
  const analogy = topic.analogy ? t(topic.analogy.en ?? '', topic.analogy.hi) : '';
  // Vocabulary only exists on language-course lessons (English Speaking) —
  // mistakes elsewhere are code snippets, where a "listen" button makes no
  // sense, so gate pronunciation playback on the same signal.
  const isLanguageLesson = !!topic.vocabulary?.length;
  // The guitar course is a physical-skill course: a learner wants to play,
  // not read, first. For this course only, practice/visuals move ahead of
  // prose and the deep-theory section starts collapsed — every other course
  // keeps its original, explanation-first order untouched.
  const isGuitarCourse = course.slug === 'guitar-complete';

  const simpleSection = (topic.simple || topic.simpleHi) && (
    <Section id="explain" icon="📖" title={lang === 'hi' ? 'Aasaan Samjhao' : 'In Simple Words'}>
      <Markdown content={t(topic.simple ?? '', topic.simpleHi)} />
    </Section>
  );

  const detailSection = (topic.content || topic.contentHi) && (
    <Section
      id="detail"
      icon="🔍"
      title={lang === 'hi' ? 'Thoda Gehrai Mein' : 'Going Deeper'}
      defaultOpen={!isGuitarCourse}
    >
      <Markdown content={t(topic.content ?? '', topic.contentHi)} />
    </Section>
  );

  const guitarPracticeSection = !!topic.guitarPractice?.sequences?.length && (
    <Section id="guitar-practice" icon="🎸" title={lang === 'hi' ? 'Practice Karo' : 'Practice This'}>
      <GuitarPracticePlayer
        sequences={topic.guitarPractice.sequences}
        lang={lang}
        hint={
          lang === 'hi'
            ? 'Speed slider se apni comfortable speed set karo, phir play dabao. Har note apne sahi pitch par bajega jab wo laal line cross karega.'
            : 'Use the speed slider to set your own comfortable pace, then press play. Each note sounds at its real pitch as it crosses the red line.'
        }
      />
    </Section>
  );

  const guitarHearingTestSection = !!topic.guitarPractice?.earTraining?.length && (
    <Section id="guitar-hearing-test" icon="👂" title={lang === 'hi' ? 'Hearing Test' : 'Hearing Test'}>
      <p className="speaking-intro">
        {lang === 'hi'
          ? 'Note bajega — sun kar pehchaano ki kaunsa note tha, ya wo kaunsi string/fret par hai.'
          : 'Listen to the note, then pick which one it was — or which string and fret it lives on.'}
      </p>
      <GuitarHearingTest notePool={topic.guitarPractice.earTraining} lang={lang} />
    </Section>
  );

  const readingSection = !!(topic.readingPassage || topic.readingPassageHi) && (
    <Section id="speaking" icon="🗣️" title={lang === 'hi' ? 'Bol Kar Padho' : 'Read It Out Loud'}>
      <p className="speaking-intro">
        {lang === 'hi'
          ? 'Play dabao aur zor se, saaf awaaz mein bolo — jaise text scroll ho, waise bolte jao. Muscle memory isi tarah banti hai.'
          : 'Press play and read out loud, clearly, keeping pace with the scroll. This is how muscle memory for speaking gets built.'}
        {topic.readingPassage && (
          <SpeakButton text={topic.readingPassage} label="Hear this passage read aloud first" rate={0.95} />
        )}
      </p>
      <Teleprompter
        text={t(topic.readingPassage ?? '', topic.readingPassageHi) || ''}
        label={
          lang === 'hi'
            ? 'Speed slider se apni comfortable speaking speed set karo.'
            : 'Use the speed slider to match your own comfortable speaking pace.'
        }
        labelReset={lang === 'hi' ? 'Shuru se' : 'Restart'}
      />
    </Section>
  );

  const vocabSection = !!topic.vocabulary?.length && (
    <Section
      id="vocabulary"
      icon="📚"
      title={`${lang === 'hi' ? 'Naye Shabd' : 'Vocabulary'} (${topic.vocabulary.length})`}
    >
      <div className="vocab-grid">
        {topic.vocabulary.map((v, i) => (
          <article className="vocab-card" key={i}>
            <header className="vocab-head">
              <h3>
                {t(v.word, v.wordHi)}
                <SpeakButton text={v.word} label={`Listen to "${v.word}"`} />
              </h3>
              <span className="vocab-pronunciation">/{v.pronunciation}/</span>
            </header>
            <p className="vocab-meaning">{t(v.meaning, v.meaningHi)}</p>
            <p className="vocab-example">
              “{t(v.example, v.exampleHi)}”
              <SpeakButton text={v.example} label="Listen to the example sentence" />
            </p>
          </article>
        ))}
      </div>
    </Section>
  );

  const examplesSection =
    !!topic.examples?.length &&
    (() => {
      const hasJsTs = topic.examples.some((ex) => ex.codeJs && ex.codeTs);
      return (
        <Section
          id="examples"
          icon="💻"
          title={`${lang === 'hi' ? 'Code Examples' : 'Code Examples'} (${topic.examples.length})`}
        >
          {hasJsTs && (
            <div className="lang-toggle" role="group" aria-label="JavaScript or TypeScript">
              <button
                className={`lang-toggle-btn ${codeLang === 'js' ? 'active' : ''}`}
                onClick={() => setCodeLang('js')}
                aria-pressed={codeLang === 'js'}
              >
                JavaScript
              </button>
              <button
                className={`lang-toggle-btn ${codeLang === 'ts' ? 'active' : ''}`}
                onClick={() => setCodeLang('ts')}
                aria-pressed={codeLang === 'ts'}
              >
                TypeScript
              </button>
            </div>
          )}

          <div className="examples">
            {topic.examples.map((ex, i) => {
              const isPaired = !!(ex.codeJs && ex.codeTs);
              const shownCode = isPaired ? (codeLang === 'ts' ? ex.codeTs! : ex.codeJs!) : ex.code;
              const shownOutput = isPaired
                ? codeLang === 'ts'
                  ? ex.outputTs ?? ex.outputJs
                  : ex.outputJs ?? ex.outputTs
                : ex.output;

              return (
                <article className="example" key={i}>
                  <header className="example-head">
                    <span className="example-num">{i + 1}</span>
                    <h3>{t(ex.title, ex.titleHi)}</h3>
                    {isPaired && (
                      <span className="example-lang-pill">{codeLang === 'ts' ? '.tsx' : '.jsx'}</span>
                    )}
                    {isLanguageLesson && shownCode && (
                      <SpeakButton text={shownCode} label="Listen to this example" rate={0.95} />
                    )}
                  </header>

                  <pre className="code-block">
                    <code>{shownCode}</code>
                  </pre>

                  {ex.preview && (
                    <Preview
                      html={ex.preview}
                      height={ex.previewHeight}
                      label={lang === 'hi' ? 'Aisa dikhta hai' : 'What it looks like'}
                    />
                  )}

                  {shownOutput && (
                    <div className="output-block">
                      <span className="output-label">Output</span>
                      <pre>
                        <code>{shownOutput}</code>
                      </pre>
                    </div>
                  )}

                  <div className="example-explain">
                    <Markdown content={t(ex.explain, ex.explainHi)} />
                  </div>
                </article>
              );
            })}
          </div>
        </Section>
      );
    })();

  return (
    <div className="lesson-page">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="lesson-header" style={{ borderColor: course.color }}>
        <div className="crumbs">
          <Link to="/courses">Courses</Link>
          <span>/</span>
          <Link to={`/courses/${course.slug}`}>
            {course.icon} {t(course.name, course.nameHi)}
          </Link>
          {topic.module && (
            <>
              <span>/</span>
              <span className="crumb-current">{t(topic.module.name, topic.module.nameHi)}</span>
            </>
          )}
        </div>

        <h1>{t(topic.title, topic.titleHi)}</h1>
        <p className="lesson-sub">{t(topic.description, topic.descriptionHi)}</p>

        <div className="lesson-meta">
          <span className="pill" data-difficulty={topic.difficulty}>
            {topic.difficulty}
          </span>
          <span className="pill muted">⏱️ {topic.duration} min</span>
          <span className="pill muted">
            Lesson {position} of {total}
          </span>
        </div>

        <div className="lesson-progress">
          <div className="bar" style={{ width: `${(position / total) * 100}%` }} />
        </div>
      </header>

      {/* ── Analogy: the hook, before any code ──────────────────── */}
      {analogy && (
        <div className="analogy-card">
          <span className="analogy-icon">💡</span>
          <div className="analogy-body">
            <Markdown content={analogy} />
          </div>
        </div>
      )}

      {/* ── Order: guitar course leads with practice+visuals and tucks
           theory away collapsed; every other course keeps its original,
           explanation-first order. ─────────────────────────────────── */}
      {isGuitarCourse ? (
        <>
          {guitarPracticeSection}
          {guitarHearingTestSection}
          {examplesSection}
          {simpleSection}
          {detailSection}
        </>
      ) : (
        <>
          {simpleSection}
          {detailSection}
          {guitarPracticeSection}
          {guitarHearingTestSection}
          {readingSection}
          {vocabSection}
          {examplesSection}
        </>
      )}

      {/* ── Common mistakes ─────────────────────────────────────── */}
      {!!topic.mistakes?.length && (
        <Section
          id="mistakes"
          icon="⚠️"
          title={lang === 'hi' ? 'Aam Galtiyan' : 'Common Mistakes'}
        >
          <div className="mistakes">
            {topic.mistakes.map((m, i) => (
              <article className="mistake" key={i}>
                <div className="mistake-pair">
                  <div className="mistake-col wrong">
                    <span className="tag">❌ {lang === 'hi' ? 'Galat' : 'Wrong'}</span>
                    <div className="code-with-speak">
                      <pre>
                        <code>{m.wrong}</code>
                      </pre>
                      {isLanguageLesson && (
                        <SpeakButton text={m.wrong} label="Listen to the mistake" rate={0.85} />
                      )}
                    </div>
                    {m.previewWrong && (
                      <Preview
                        html={m.previewWrong}
                        height={m.previewHeight}
                        label={lang === 'hi' ? 'Ye toota hua hai' : 'This is broken'}
                      />
                    )}
                  </div>
                  <div className="mistake-col right">
                    <span className="tag">✅ {lang === 'hi' ? 'Sahi' : 'Right'}</span>
                    <div className="code-with-speak">
                      <pre>
                        <code>{m.right}</code>
                      </pre>
                      {isLanguageLesson && (
                        <SpeakButton text={m.right} label="Listen to the correct version" />
                      )}
                    </div>
                    {m.previewRight && (
                      <Preview
                        html={m.previewRight}
                        height={m.previewHeight}
                        label={lang === 'hi' ? 'Ab theek hai' : 'Now it works'}
                      />
                    )}
                  </div>
                </div>
                <div className="mistake-why">
                  <Markdown content={t(m.why, m.whyHi)} />
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ── Real-world use ──────────────────────────────────────── */}
      {!!topic.realWorld?.length && (
        <Section
          id="real-world"
          icon="🌍"
          title={lang === 'hi' ? 'Asli Duniya Mein Kahan' : 'Where You Will Use This'}
        >
          <div className="real-world">
            {topic.realWorld.map((r, i) => (
              <div className="real-item" key={i}>
                <Markdown content={t(r.en, r.hi)} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Interview Q&A ───────────────────────────────────────── */}
      {!!topic.interviewQA?.length && (
        <Section
          id="interview"
          icon="🎤"
          title={`${lang === 'hi' ? 'Interview Sawaal' : 'Interview Questions'} (${topic.interviewQA.length})`}
        >
          <div className="qa-list">
            {topic.interviewQA.map((qa, i) => (
              <article className={`qa ${openQA === i ? 'open' : ''}`} key={i}>
                <button className="qa-q" onClick={() => setOpenQA(openQA === i ? null : i)}>
                  <span className="qa-badge">Q{i + 1}</span>
                  <span className="qa-text">
                    <Markdown content={t(qa.q, qa.qHi)} />
                  </span>
                  <span className={`chevron ${openQA === i ? 'open' : ''}`}>▾</span>
                </button>

                {openQA === i && (
                  <div className="qa-a">
                    <Markdown content={t(qa.a, qa.aHi)} />
                    {qa.code && (
                      <pre className="code-block">
                        <code>{qa.code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ── Practice exercises ──────────────────────────────────── */}
      {!!topic.exercises?.length && (
        <Section id="exercises" icon="✏️" title={lang === 'hi' ? 'Khud Try Karo' : 'Try It Yourself'}>
          <div className="exercises">
            {topic.exercises.map((ex, i) => (
              <article className="exercise" key={i}>
                <div className="exercise-head">
                  <span className="exercise-num">{i + 1}</span>
                  <div className="exercise-task">
                    <Markdown content={t(ex.task, ex.taskHi)} />
                  </div>
                </div>
                <button
                  className="hint-btn"
                  onClick={() => setOpenHint(openHint === i ? null : i)}
                >
                  {openHint === i
                    ? lang === 'hi'
                      ? 'Hint chhupao'
                      : 'Hide hint'
                    : lang === 'hi'
                      ? '💡 Hint dikhao'
                      : '💡 Show hint'}
                </button>
                {openHint === i && (
                  <div className="hint-body">
                    <Markdown content={t(ex.hint, ex.hintHi)} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ── Key takeaways ───────────────────────────────────────── */}
      {!!takeaways.length && (
        <div className="takeaways">
          <h2>🎯 {lang === 'hi' ? 'Yaad Rakhne Wali Baatein' : 'Key Takeaways'}</h2>
          <ul>
            {takeaways.map((k, i) => (
              <li key={i}>
                <Markdown content={k} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Hand-off to the code editor ─────────────────────────── */}
      {practice && (
        <div className="practice-cta">
          <div className="cta-text">
            <h2>{lang === 'hi' ? 'Ab Code Likho' : 'Now Write the Code'}</h2>
            <p>
              {lang === 'hi'
                ? 'Padh liya. Ab is problem ko solve karke pakka karo.'
                : 'You have read it. Now lock it in by solving the problem.'}
            </p>
          </div>
          <button
            className="primary-btn large"
            onClick={() => navigate(`/courses/${courseSlug}/problems/${practice.slug}`)}
          >
            {practice.title} · +{practice.xpReward} XP →
          </button>
        </div>
      )}

      {/* ── Prev / next ─────────────────────────────────────────── */}
      <nav className="lesson-nav">
        {prev ? (
          <Link className="nav-card prev" to={`/courses/${courseSlug}/topics/${prev.slug}`}>
            <span className="nav-dir">← {lang === 'hi' ? 'Pichla' : 'Previous'}</span>
            <span className="nav-title">{t(prev.title, prev.titleHi)}</span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link className="nav-card next" to={`/courses/${courseSlug}/topics/${next.slug}`}>
            <span className="nav-dir">{lang === 'hi' ? 'Agla' : 'Next'} →</span>
            <span className="nav-title">{t(next.title, next.titleHi)}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
