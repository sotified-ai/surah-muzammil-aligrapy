import { useRef, useState, useCallback } from "react";
import CircularCalligraphy from "./CircularCalligraphy";

// ── Locked plain Arabic (no harakat) ─────────────────────────────────────────
const PLAIN_SURAH = `يا ايها المزمل ۝١ قم الليل الا قليلا ۝٢ نصفه او انقص منه قليلا ۝٣ او زد عليه ورتل القران ترتيلا ۝٤ انا سنلقي عليك قولا ثقيلا ۝٥ ان ناشئة الليل هي اشد وطئا واقوم قيلا ۝٦ ان لك في النهار سبحا طويلا ۝٧ واذكر اسم ربك وتبتل اليه تبتيلا ۝٨ رب المشرق والمغرب لا اله الا هو فاتخذه وكيلا ۝٩ واصبر على ما يقولون واهجرهم هجرا جميلا ۝١٠ وذرني والمكذبين اولي النعمة ومهلهم قليلا ۝١١ ان لدينا انكالا وجحيما ۝١٢ وطعاما ذا غصة وعذابة اليما ۝١٣ يوم ترجف الارض والجبال وكانت الجبال كثيبا مهيلا ۝١٤ انا ارسلنا اليكم رسولا شاهدا عليكم كما ارسلنا الى فرعون رسولا ۝١٥ فعصى فرعون الرسول فاخذناه اخذا وبيلا ۝١٦ فكيف تتقون ان كفرتم يوما يجعل الولدان شيبا ۝١٧ السماء منفطر به كان وعده مفعولا ۝١٨ ان هذه تذكرة فمن شاء اتخذ الى ربه سبيلا ۝١٩ ان ربك يعلم انك تقوم ادنى من ثلثي الليل ونصفه وثلثه وطائفة من الذين معك والله يقدر الليل والنهار علم ان لن تحصوه فتاب عليكم فاقرءوا ما تيسر من القران علم ان سيكون منكم مرضى واخرون يضربون في الارض يبتغون من فضل الله واخرون يقاتلون في سبيل الله فاقرءوا ما تيسر منه واقيموا الصلاة واتوا الزكاة واقرضوا الله قرضا حسنا وما تقدموا لانفسكم من خير تجدوه عند الله هو خيرا واعظم اجرا واستغفروا الله ان الله غفور رحيم ۝٢٠`;

// ── Vowelized Arabic (full tashkeel / harakat) ────────────────────────────────
const VOWELIZED_SURAH = `يَا أَيُّهَا الْمُزَّمِّلُ ۝١ قُمِ اللَّيْلَ إِلَّا قَلِيلًا ۝٢ نِصْفَهُ أَوِ انقُصْ مِنْهُ قَلِيلًا ۝٣ أَوْ زِدْ عَلَيْهِ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ۝٤ إِنَّا سَنُلْقِي عَلَيْكَ قَوْلًا ثَقِيلًا ۝٥ إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا ۝٦ إِنَّ لَكَ فِي النَّهَارِ سَبْحًا طَوِيلًا ۝٧ وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا ۝٨ رَبُّ الْمَشْرِقِ وَالْمَغْرِبِ لَا إِلَهَ إِلَّا هُوَ فَاتَّخِذْهُ وَكِيلًا ۝٩ وَاصْبِرْ عَلَى مَا يَقُولُونَ وَاهْجُرْهُمْ هَجْرًا جَمِيلًا ۝١٠ وَذَرْنِي وَالْمُكَذِّبِينَ أُولِي النَّعْمَةِ وَمَهِّلْهُمْ قَلِيلًا ۝١١ إِنَّ لَدَيْنَا أَنكَالًا وَجَحِيمًا ۝١٢ وَطَعَامًا ذَا غُصَّةٍ وَعَذَابًا أَلِيمًا ۝١٣ يَوْمَ تَرْجُفُ الْأَرْضُ وَالْجِبَالُ وَكَانَتِ الْجِبَالُ كَثِيبًا مَّهِيلًا ۝١٤ إِنَّا أَرْسَلْنَا إِلَيْكُمْ رَسُولًا شَاهِدًا عَلَيْكُمْ كَمَا أَرْسَلْنَا إِلَى فِرْعَوْنَ رَسُولًا ۝١٥ فَعَصَى فِرْعَوْنُ الرَّسُولَ فَأَخَذْنَاهُ أَخْذًا وَبِيلًا ۝١٦ فَكَيْفَ تَتَّقُونَ إِن كَفَرْتُمْ يَوْمًا يَجْعَلُ الْوِلْدَانَ شِيبًا ۝١٧ السَّمَاءُ مُنفَطِرٌ بِهِ كَانَ وَعْدُهُ مَفْعُولًا ۝١٨ إِنَّ هَذِهِ تَذْكِرَةٌ فَمَن شَاءَ اتَّخَذَ إِلَى رَبِّهِ سَبِيلًا ۝١٩ إِنَّ رَبَّكَ يَعْلَمُ أَنَّكَ تَقُومُ أَدْنَى مِن ثُلُثَيِ اللَّيْلِ وَنِصْفَهُ وَثُلُثَهُ وَطَائِفَةٌ مِّنَ الَّذِينَ مَعَكَ وَاللَّهُ يُقَدِّرُ اللَّيْلَ وَالنَّهَارَ عَلِمَ أَن لَّن تُحْصُوهُ فَتَابَ عَلَيْكُمْ فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ عَلِمَ أَن سَيَكُونُ مِنكُم مَّرْضَى وَآخَرُونَ يَضْرِبُونَ فِي الْأَرْضِ يَبْتَغُونَ مِن فَضْلِ اللَّهِ وَآخَرُونَ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ فَاقْرَءُوا مَا تَيَسَّرَ مِنْهُ وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَأَقْرِضُوا اللَّهَ قَرْضًا حَسَنًا وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ هُوَ خَيْرًا وَأَعْظَمَ أَجْرًا وَاسْتَغْفِرُوا اللَّهَ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ ۝٢٠`;

type Tab = "plain" | "vowelized";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("plain");
  const [downloading, setDownloading] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const surahText = activeTab === "plain" ? PLAIN_SURAH : VOWELIZED_SURAH;

  // ── Download as high-res SVG (vector, best for print) ───────────────────────
  const downloadSVG = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", "3000");
    clone.setAttribute("height", "3000");
    // White background — remove parchment grain
    const rects = Array.from(clone.querySelectorAll("rect"));
    if (rects[0]) rects[0].setAttribute("fill", "#ffffff");
    if (rects[1]) rects[1].setAttribute("display", "none");
    const serialized = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `surah-al-muzzammil-${activeTab}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeTab]);

  // ── Download as PDF (4× resolution, white background) ───────────────────────
  const downloadPDF = useCallback(async () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    setDownloading(true);

    try {
      // Build off-screen container with white background
      const wrap = document.createElement("div");
      wrap.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;background:#fff;width:1000px;height:1000px;";
      document.body.appendChild(wrap);

      // Clone SVG with white background, remove parchment
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", "1000");
      clone.setAttribute("height", "1000");
      clone.style.maxWidth = "1000px";
      clone.style.maxHeight = "1000px";
      const rects = Array.from(clone.querySelectorAll("rect"));
      if (rects[0]) rects[0].setAttribute("fill", "#ffffff");
      if (rects[1]) rects[1].setAttribute("display", "none");
      wrap.appendChild(clone);

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(wrap, {
        scale: 4,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 1000,
        height: 1000,
      });

      document.body.removeChild(wrap);

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      // Centre 210×210 mm square on A4 (210×297 mm)
      const margin = 0;
      const size = 210 - margin * 2;
      const yOffset = (297 - size) / 2;
      pdf.addImage(imgData, "PNG", margin, yOffset, size, size);
      pdf.save(`surah-al-muzzammil-${activeTab}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setDownloading(false);
    }
  }, [activeTab]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5 py-6 px-4"
      style={{ background: "linear-gradient(160deg,#0d0d1a 0%,#1a1232 100%)" }}
    >
      {/* ── Header ── */}
      <div className="text-center">
        <h1
          className="text-4xl font-bold"
          style={{
            fontFamily: "'Scheherazade New', serif",
            color: "#e8c97e",
            textShadow: "0 0 24px #e8c97e55",
            letterSpacing: "0.05em",
          }}
        >
          سورة المزمل
        </h1>
        <p className="text-sm mt-1" style={{ color: "#a89060" }}>
          Surah Al-Muzzammil — Circular Calligraphy Design
        </p>
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {(["plain", "vowelized"] as Tab[]).map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={
              activeTab === tab
                ? { background: "#c9a84c", color: "#0d0d1a", fontWeight: 700 }
                : { color: "#a89060" }
            }
          >
            {tab === "plain" ? "Plain Arabic" : "With Tashkeel (حركات)"}
          </button>
        ))}
      </div>

      {/* ── Design ── */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ boxShadow: "0 0 60px rgba(200,160,60,0.15)" }}
      >
        <CircularCalligraphy
          ref={svgRef}
          surahText={surahText}
          charW={7}
          showParchment={true}
        />
      </div>

      {/* ── Download buttons ── */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          id="btn-download-svg"
          onClick={downloadSVG}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#d4b87a",
          }}
        >
          <span>⬇</span> Download SVG
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)", color: "#a89060" }}
          >
            Vector · Best Quality
          </span>
        </button>

        <button
          id="btn-download-pdf"
          onClick={downloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: downloading ? "#7a6030" : "#c9a84c",
            color: "#0d0d1a",
            opacity: downloading ? 0.7 : 1,
            cursor: downloading ? "wait" : "pointer",
          }}
        >
          {downloading ? (
            <>
              <span className="animate-spin inline-block">⟳</span> Generating PDF…
            </>
          ) : (
            <>
              <span>⬇</span> Download PDF
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,0,0,0.2)", color: "#3d2800" }}
              >
                A4 · White BG · Print Ready
              </span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-center max-w-xs" style={{ color: "#5a4a30" }}>
        PDF exports at 4× resolution with white background. For professional printing, SVG is recommended (infinitely scalable vector).
      </p>
    </div>
  );
}
