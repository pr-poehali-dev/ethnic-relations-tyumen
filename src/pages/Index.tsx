import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "intro", label: "Введение" },
  { id: "literature", label: "Обзор литературы" },
  { id: "analysis", label: "Анализ" },
  { id: "statistics", label: "Статистика" },
  { id: "conclusions", label: "Выводы" },
  { id: "sources", label: "Источники" },
];

const ETHNIC_DATA = [
  { name: "Русские", percent: 73.3, color: "#1a3a5c" },
  { name: "Татары", percent: 7.8, color: "#2e6da4" },
  { name: "Украинцы", percent: 2.1, color: "#4a90c4" },
  { name: "Башкиры", percent: 1.4, color: "#6baed6" },
  { name: "Казахи", percent: 1.2, color: "#9ecae1" },
  { name: "Азербайджанцы", percent: 1.1, color: "#c6dbef" },
  { name: "Ненцы", percent: 0.9, color: "#a8c8e8" },
  { name: "Прочие", percent: 12.2, color: "#d9d9d9" },
];

const INTERACTION_DATA = [
  { year: "2010", positive: 62, neutral: 28, negative: 10 },
  { year: "2015", positive: 67, neutral: 25, negative: 8 },
  { year: "2018", positive: 71, neutral: 22, negative: 7 },
  { year: "2020", positive: 69, neutral: 24, negative: 7 },
  { year: "2023", positive: 74, neutral: 20, negative: 6 },
];

const MIGRATION_DATA = [
  { region: "Тюмень (юг)", value: 42 },
  { region: "ХМАО", value: 31 },
  { region: "ЯНАО", value: 16 },
  { region: "Другие регионы", value: 11 },
];

const CULTURAL_DATA = [
  { aspect: "Межэтн. браки", value: 18, max: 30 },
  { aspect: "Двуязычие", value: 24, max: 30 },
  { aspect: "Совм. праздники", value: 27, max: 30 },
  { aspect: "Культ. обмен", value: 21, max: 30 },
  { aspect: "Смеш. коллективы", value: 26, max: 30 },
];

function PieChart() {
  let cum = 0;
  const cx = 50, cy = 50, r = 40;
  const getCoord = (p: number) => ({
    x: cx + r * Math.cos(2 * Math.PI * p - Math.PI / 2),
    y: cy + r * Math.sin(2 * Math.PI * p - Math.PI / 2),
  });
  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      <svg viewBox="0 0 100 100" className="w-52 h-52 flex-shrink-0">
        {ETHNIC_DATA.map((item) => {
          const start = cum;
          cum += item.percent / 100;
          const s = getCoord(start), e = getCoord(cum);
          const large = item.percent / 100 > 0.5 ? 1 : 0;
          return (
            <path
              key={item.name}
              d={`M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`}
              fill={item.color}
              stroke="white"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
      <div className="grid grid-cols-1 gap-2 w-full">
        {ETHNIC_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-[var(--ac-body)] font-medium flex-1">{item.name}</span>
            <span className="text-sm font-bold text-[var(--ac-dark)] tabular-nums">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedBar() {
  return (
    <div className="space-y-4">
      {INTERACTION_DATA.map((row) => (
        <div key={row.year}>
          <p className="text-xs font-semibold text-[var(--ac-muted)] tracking-wider uppercase mb-1">{row.year}</p>
          <div className="flex h-8 rounded overflow-hidden gap-px">
            <div className="flex items-center justify-center text-xs text-white font-semibold" style={{ width: `${row.positive}%`, backgroundColor: "#1a3a5c" }}>
              {row.positive}%
            </div>
            <div className="flex items-center justify-center text-xs text-[var(--ac-dark)] font-semibold" style={{ width: `${row.neutral}%`, backgroundColor: "#d0dce9" }}>
              {row.neutral}%
            </div>
            <div className="flex items-center justify-center text-xs text-white font-semibold" style={{ width: `${row.negative}%`, backgroundColor: "#8b1a1a" }}>
              {row.negative}%
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-6 pt-2 flex-wrap">
        {[["#1a3a5c","Позитивное"],["#d0dce9","Нейтральное"],["#8b1a1a","Негативное"]].map(([c,l]) => (
          <div key={l} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            <span className="text-xs text-[var(--ac-muted)]">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart() {
  const cx = 130, cy = 130, maxR = 95, n = CULTURAL_DATA.length, levels = 5;
  const angle = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;
  const pt = (i: number, val: number, mx: number) => {
    const a = angle(i), rr = (val / mx) * maxR;
    return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
  };
  const gridPts = (lvl: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = angle(i), rr = ((lvl + 1) / levels) * maxR;
      return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
    }).join(" ");
  const dataPts = CULTURAL_DATA.map((d, i) => pt(i, d.value, d.max));
  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto">
      {Array.from({ length: levels }, (_, l) => (
        <polygon key={l} points={gridPts(l)} fill="none" stroke="#d0dce9" strokeWidth="0.8" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const a = angle(i);
        return <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(a)} y2={cy + maxR * Math.sin(a)} stroke="#d0dce9" strokeWidth="0.8" />;
      })}
      <polygon points={dataPts.map(p => `${p.x},${p.y}`).join(" ")} fill="rgba(26,58,92,0.18)" stroke="#1a3a5c" strokeWidth="2" />
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1a3a5c" />)}
      {CULTURAL_DATA.map((d, i) => {
        const a = angle(i), lr = maxR + 24;
        const lx = cx + lr * Math.cos(a), ly = cy + lr * Math.sin(a);
        const anchor = Math.cos(a) > 0.1 ? "start" : Math.cos(a) < -0.1 ? "end" : "middle";
        return <text key={i} x={lx} y={ly} textAnchor={anchor} fontSize="9" fill="#4a5568" fontFamily="IBM Plex Sans">{d.aspect}</text>;
      })}
    </svg>
  );
}

function MigrationChart() {
  return (
    <div className="space-y-4">
      {MIGRATION_DATA.map((item) => (
        <div key={item.region} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[var(--ac-dark)]">{item.region}</span>
            <span className="font-bold text-[var(--ac-accent)] tabular-nums">{item.value}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: "#1a3a5c" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ number, title, icon }: { number: string; title: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--ac-border)]">
      <div className="w-8 h-8 bg-[var(--ac-accent)] text-white rounded flex items-center justify-center text-sm font-bold flex-shrink-0">
        {number}
      </div>
      <Icon name={icon} size={18} className="text-[var(--ac-accent)]" />
      <h2 className="text-xl font-bold text-[var(--ac-dark)]" style={{ fontFamily: "'Cormorant', serif" }}>{title}</h2>
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("intro");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--ac-bg)", color: "var(--ac-dark)" }}>

      {/* Шапка */}
      <header style={{ borderBottom: "1px solid var(--ac-border)", backgroundColor: "white" }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded" style={{ backgroundColor: "var(--ac-accent)" }}>
                <Icon name="BookOpen" size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest leading-none" style={{ color: "var(--ac-muted)" }}>Научная работа</p>
                <p className="text-xs font-semibold leading-tight" style={{ color: "var(--ac-dark)" }}>ТюмГУ · ПИНб-25-1</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-3 py-1.5 text-xs rounded font-medium transition-all"
                  style={{
                    backgroundColor: activeSection === item.id ? "var(--ac-accent)" : "transparent",
                    color: activeSection === item.id ? "white" : "var(--ac-body)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              <Icon name="Menu" size={20} />
            </button>
          </div>
          {mobileOpen && (
            <div className="md:hidden py-2 flex flex-wrap gap-1" style={{ borderTop: "1px solid var(--ac-border)" }}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-3 py-1.5 text-xs rounded font-medium"
                  style={{
                    backgroundColor: activeSection === item.id ? "var(--ac-accent)" : "var(--ac-grid)",
                    color: activeSection === item.id ? "white" : "var(--ac-body)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Титульная страница */}
      <div style={{ borderBottom: "1px solid var(--ac-border)", backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "var(--ac-muted)" }}>
            Министерство науки и высшего образования Российской Федерации
          </p>
          <p className="text-sm mb-1" style={{ color: "var(--ac-body)" }}>
            Федеральное государственное автономное образовательное учреждение
          </p>
          <p className="font-semibold mb-8" style={{ color: "var(--ac-dark)" }}>
            «Тюменский государственный университет»
          </p>
          <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: "var(--ac-accent)" }} />
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--ac-muted)" }}>Научная работа</p>
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Cormorant', serif", color: "var(--ac-dark)" }}
          >
            Этнические и межрегиональные<br />отношения в Тюменской области
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: "var(--ac-accent)" }} />
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm">
            {[["Автор","Гниденко П. А."],["Группа","ПИНб-25-1"],["Год","2026"]].map(([label, val]) => (
              <div key={label} className="text-left">
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--ac-muted)" }}>{label}</p>
                <p className="font-semibold" style={{ color: "var(--ac-dark)" }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-16">

        {/* 1. Введение */}
        <section id="intro" className="scroll-mt-20">
          <SectionHeader number="1" title="Введение" icon="FileText" />
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--ac-body)" }}>
            <p>
              Тюменская область является одним из наиболее многонациональных регионов Российской Федерации.
              На её территории исторически складывалось взаимодействие народов с различными языковыми,
              культурными и религиозными традициями. Современный облик региона формировался под воздействием
              как исторических процессов — включая колонизацию Сибири и нефтегазовое освоение Севера, —
              так и актуальных миграционных потоков.
            </p>
            <p>
              Актуальность исследования обусловлена усилением межрегиональной мобильности населения,
              трансформацией этнической идентичности в условиях урбанизации и необходимостью выработки
              эффективной региональной национальной политики.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { label: "Объект исследования", text: "Этнические группы Тюменской области" },
                { label: "Предмет", text: "Межэтническое и межрегиональное взаимодействие" },
                { label: "Цель", text: "Комплексный анализ этнических отношений в регионе" },
              ].map((card) => (
                <div key={card.label} className="rounded p-4 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--ac-muted)" }}>{card.label}</p>
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--ac-dark)" }}>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Обзор литературы */}
        <section id="literature" className="scroll-mt-20">
          <SectionHeader number="2" title="Обзор литературы" icon="Library" />
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--ac-body)" }}>
            <p>
              Проблематика этнических отношений в Западной Сибири нашла отражение в трудах ряда
              отечественных исследователей. Работы Н. А. Томилова (1992) и В. И. Молодина (2001)
              посвящены историко-этнографическому описанию народов Тюменского Севера. Социологические
              аспекты межэтнического взаимодействия рассматриваются в трудах Г. Ф. Шафранова-Куцева
              (2003, 2015), изучавшего процессы регионального самоопределения населения.
            </p>
            <p>
              Вопросы культурной интеграции и конфликтогенности исследовали учёные Тюменского
              государственного университета (Коньков, 2011; Белоусов, 2017). Региональные особенности
              миграционных процессов освещены в докладах Тюменьстата (2010–2023) и аналитических
              материалах ВНИИ труда.
            </p>
            <div className="mt-4 pl-4 py-1" style={{ borderLeft: "3px solid var(--ac-accent)" }}>
              <p className="text-sm italic" style={{ color: "var(--ac-body)" }}>
                «Тюменская область представляет собой уникальный полигон для изучения этнических
                процессов, объединяя коренные народы Севера, старожильческое русское население
                и новейшие миграционные потоки» — Шафранов-Куцев Г. Ф., 2015.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Анализ */}
        <section id="analysis" className="scroll-mt-20">
          <SectionHeader number="3" title="Анализ этнических отношений" icon="Users" />
          <div className="space-y-6">
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--ac-body)" }}>
              <p>
                Изучение культурных различий и межэтнического взаимодействия в Тюменской области
                позволяет выделить несколько ключевых моделей: интеграционную, ассимиляционную
                и мультикультурную. Преобладающей тенденцией в городской среде является
                бытовая интеграция при сохранении этнической самоидентификации.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Факторы сближения",
                  color: "var(--ac-accent)",
                  icon: "Check",
                  items: ["Общее экономическое пространство","Смешанные трудовые коллективы","Единая система образования","Межэтнические браки (18%)"],
                },
                {
                  title: "Факторы напряжённости",
                  color: "#8b1a1a",
                  icon: "AlertCircle",
                  items: ["Языковые барьеры","Конкуренция на рынке труда","Различия в правовом статусе мигрантов","Бытовые стереотипы"],
                },
              ].map((block) => (
                <div key={block.title} className="rounded-lg p-5 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--ac-dark)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: block.color }} />
                    {block.title}
                  </h3>
                  <ul className="space-y-2">
                    {block.items.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--ac-body)" }}>
                        <Icon name={block.icon} size={14} className="mt-0.5 flex-shrink-0" style={{ color: block.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rounded-lg p-6 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--ac-muted)" }}>Диаграмма 1</p>
              <h3 className="font-semibold mb-4" style={{ color: "var(--ac-dark)" }}>
                Показатели культурного взаимодействия (балл, max 30)
              </h3>
              <RadarChart />
              <p className="text-xs text-center mt-3" style={{ color: "var(--ac-muted)" }}>
                Источник: социологический опрос, ТюмГУ, 2023 г., n = 1 200
              </p>
            </div>
          </div>
        </section>

        {/* 4. Статистика */}
        <section id="statistics" className="scroll-mt-20">
          <SectionHeader number="4" title="Диаграммы и статистика" icon="BarChart2" />
          <div className="space-y-8">

            <div className="rounded-lg p-6 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--ac-muted)" }}>Диаграмма 2</p>
              <h3 className="font-semibold mb-5" style={{ color: "var(--ac-dark)" }}>
                Этнический состав населения Тюменской области (2021 г.)
              </h3>
              <PieChart />
              <p className="text-xs mt-4" style={{ color: "var(--ac-muted)" }}>
                Источник: Всероссийская перепись населения 2020 г. (итоги опубликованы в 2021–2022 гг.)
              </p>
            </div>

            <div className="rounded-lg p-6 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--ac-muted)" }}>Диаграмма 3</p>
              <h3 className="font-semibold mb-5" style={{ color: "var(--ac-dark)" }}>
                Динамика оценки межэтнического взаимодействия, 2010–2023 гг. (% опрошенных)
              </h3>
              <StackedBar />
              <p className="text-xs mt-4" style={{ color: "var(--ac-muted)" }}>
                Источник: Тюменский социологический мониторинг, ТюмГУ, 2010–2023 гг.
              </p>
            </div>

            <div className="rounded-lg p-6 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--ac-muted)" }}>Диаграмма 4</p>
              <h3 className="font-semibold mb-5" style={{ color: "var(--ac-dark)" }}>
                Структура межрегиональных миграционных потоков в Тюменскую область (2022 г.)
              </h3>
              <MigrationChart />
              <p className="text-xs mt-4" style={{ color: "var(--ac-muted)" }}>
                Источник: Тюменьстат, форма № 2-ТП (миграция), 2022 г.
              </p>
            </div>

            {/* Ключевые показатели */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "161", sub: "народность", label: "национальностей проживает в регионе" },
                { value: "74%", sub: "", label: "положительно оценивают межэтнические отношения" },
                { value: "3,7 млн", sub: "", label: "численность населения области (2023)" },
                { value: "+12%", sub: "", label: "рост миграционного потока за 2018–2023 гг." },
              ].map((s) => (
                <div key={s.label} className="rounded-lg p-4 bg-white text-center" style={{ border: "1px solid var(--ac-border)" }}>
                  <p className="text-2xl font-bold" style={{ color: "var(--ac-accent)" }}>{s.value}</p>
                  {s.sub && <p className="text-xs" style={{ color: "var(--ac-muted)" }}>{s.sub}</p>}
                  <p className="text-xs mt-1 leading-snug" style={{ color: "var(--ac-body)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Выводы */}
        <section id="conclusions" className="scroll-mt-20">
          <SectionHeader number="5" title="Выводы и рекомендации" icon="CheckSquare" />
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--ac-body)" }}>
            <p>Проведённый анализ позволяет сформулировать следующие основные выводы.</p>
            <div className="space-y-3">
              {[
                "Тюменская область характеризуется в целом стабильной межэтнической обстановкой: доля позитивных оценок межэтнического взаимодействия возросла с 62% (2010) до 74% (2023).",
                "Преобладающей формой межэтнического взаимодействия остаётся бытовая интеграция при сохранении этнокультурной самобытности коренных народов Севера.",
                "Ключевым вызовом является интеграция трудовых мигрантов из государств СНГ и сохранение межэтнического баланса в условиях урбанизации.",
                "Межрегиональная мобильность формирует смешанную культурную среду в городах, что требует целенаправленной работы по формированию общегражданской идентичности.",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 rounded-lg p-4 bg-white" style={{ border: "1px solid var(--ac-border)" }}>
                  <div className="w-6 h-6 text-white rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: "var(--ac-accent)" }}>
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ac-body)" }}>{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg p-5" style={{ backgroundColor: "var(--ac-grid)", border: "1px solid var(--ac-border)" }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--ac-dark)" }}>Рекомендации</h3>
              <ul className="space-y-2">
                {[
                  "Развитие программ культурного обмена между районами области",
                  "Совершенствование языковой адаптации трудовых мигрантов",
                  "Поддержка институтов сохранения культур коренных народов (ненцы, ханты, манси)",
                  "Регулярный мониторинг межэтнической напряжённости на районном уровне",
                ].map((rec) => (
                  <li key={rec} className="flex items-start gap-2 text-sm" style={{ color: "var(--ac-body)" }}>
                    <Icon name="ArrowRight" size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--ac-accent)" }} />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Источники */}
        <section id="sources" className="scroll-mt-20">
          <SectionHeader number="6" title="Список источников" icon="BookMarked" />
          <ol className="space-y-3">
            {[
              "Томилов Н. А. Этническая история тюркоязычного населения Западно-Сибирской равнины в конце XVI — начале XX в. — Новосибирск: НГУ, 1992.",
              "Молодин В. И. Коренные народы Западной Сибири. — Новосибирск: ИАЭТ СО РАН, 2001.",
              "Шафранов-Куцев Г. Ф. Современный университет в условиях регионализации высшего образования. — Тюмень: ТюмГУ, 2003.",
              "Коньков А. Т. Этнокультурные процессы в Тюменской области. — Тюмень, 2011.",
              "Белоусов С. Н. Миграция и межэтнические конфликты в Западной Сибири // Регионология. — 2017. — № 3.",
              "Шафранов-Куцев Г. Ф. Регион и его социокультурная идентичность. — Тюмень: ТюмГУ, 2015.",
              "Всероссийская перепись населения 2020 года: итоги (том 5. Национальный состав). — М.: Росстат, 2022.",
              "Тюменьстат. Численность и миграция населения Тюменской области: статистический бюллетень. — Тюмень: Тюменьстат, 2022.",
              "Тюменский социологический мониторинг / НИЛ региональных социальных исследований ТюмГУ. — Тюмень: ТюмГУ, 2023.",
              "Концепция государственной национальной политики Российской Федерации: Указ Президента РФ от 19.12.2012 № 1666.",
            ].map((source, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--ac-body)" }}>
                <span className="font-bold flex-shrink-0 tabular-nums" style={{ color: "var(--ac-accent)" }}>{i + 1}.</span>
                <span>{source}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* Подвал */}
      <footer className="mt-16 bg-white" style={{ borderTop: "1px solid var(--ac-border)" }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs" style={{ color: "var(--ac-muted)" }}>
          <p>Гниденко П. А. · Группа ПИНб-25-1 · ТюмГУ · 2026</p>
          <p>Этнические и межрегиональные отношения в Тюменской области</p>
        </div>
      </footer>
    </div>
  );
}