import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import path from "path";
import fs from "fs";

// --- 1. НАДЕЖНАЯ ЗАГРУЗКА ШРИФТОВ ---
const loadFont = (filename: string) => {
  try {
    const filePath = path.join(process.cwd(), "public", "fonts", filename);
    return fs.readFileSync(filePath);
  } catch (e) {
    console.error(`❌ Ошибка чтения шрифта ${filename}:`, e);
    return null;
  }
};

try {
  // Roboto (основной)
  const robotoRegular = loadFont("Roboto-Regular.ttf");
  const robotoBold = loadFont("Roboto-Bold.ttf");
  if (robotoRegular && robotoBold) {
    Font.register({
      family: "Roboto",
      fonts: [
        { src: robotoRegular, fontWeight: 400 },
        { src: robotoBold, fontWeight: 700 },
      ],
    });
  }

  // Playfair (Serif)
  const playfair = loadFont("PlayfairDisplay-Regular.ttf");
  if (playfair) {
    Font.register({
      family: "Playfair",
      src: playfair,
    });
  }

  // Cursive (Handwritten)
  const cursive = loadFont("MarckScript-Regular.ttf");
  if (cursive) {
    Font.register({
      family: "Cursive",
      src: cursive,
    });
  }
} catch (error) {
  console.error("🔥 Ошибка регистрации шрифтов:", error);
}

// --- 2. СТИЛИ (TOЧНАЯ КОПИЯ ПРЕВЬЮ) ---
const styles = StyleSheet.create({
  page: {
    padding: 24, // Соответствует p-6 (24px)
    flexDirection: "column",
  },
  // Основной контейнер на всю страницу
  container: {
    flex: 1,
    flexDirection: "column",
  },
  // 1. Картинка (45% высоты, отступ снизу 20px)
  imageSection: {
    height: "45%",
    width: "100%",
    marginBottom: 20, // mb-5
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  // 2. Блок контента (Текст + Подпись)
  // Занимает все оставшееся место (flex-1)
  contentSection: {
    flexGrow: 1,
    flexDirection: "column",
    // Важно: БЕЗ justifyContent: center, чтобы текст был сверху
  },
  text: {
    fontSize: 14,
    textAlign: "center", // text-center
    color: "#334155", // slate-700
    lineHeight: 1.5,
  },
  // 3. Подпись (прижата к низу блока контента)
  signatureWrapper: {
    marginTop: "auto", // Аналог mt-auto: прижимает к низу
    paddingTop: 10, // pt-2
    width: "100%",
    alignItems: "flex-end", // Выравнивание контейнера вправо
  },
  signature: {
    fontSize: 16, // Чуть крупнее текста (text-xl vs text-lg)
    textAlign: "right", // text-right
    color: "#334155",
    opacity: 0.9,
  },
  // 4. Футер (Магазин) - Отдельно в самом низу
  footer: {
    height: 30,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  brandName: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Roboto",
    fontWeight: 700,
  },
});

interface DesignConfig {
  url: string;
  color: string;
  mode: "contain" | "cover";
}

const DESIGNS: Record<string, DesignConfig> = {
  gentle_0: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770203577/1-12574_watercolor-flower-png-free-flower-pink-vector-png_kyet2r.png",
    color: "#fff0f5",
    mode: "contain",
  },
  gentle_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770203578/1000_F_612026850_6JlSZVdzOqa3sPiePleg5nqMtBVYWuib_ul4ah2.png",
    color: "#fff5f5",
    mode: "contain",
  },
  fun_0: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207274/Gemini_Generated_Image_40q4kt40q4kt40q4_prll00.png",
    color: "#fef9c3",
    mode: "cover",
  },
  fun_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207273/Gemini_Generated_Image_30blr30blr30blr3_u4r5wx.png",
    color: "#fff8e1",
    mode: "cover",
  },
  minimal_0: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770206593/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEyL3Jhd3BpeGVsb2ZmaWNlMTFfc2ltcGxlX3dhdGVyY29sb3JfcHJpbnRfb2Zfd2hpdGVfYW5kX2dyZWVuX3dlZF9hYWQ3ZmY3MC01MTJiLTQ3YjUtYjkyZS03MTM5N2ExOTRjYTEucG5n_1_bvjyjc.png",
    color: "#ffffff",
    mode: "contain",
  },
  minimal_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207052/png-clipart-watercolor-flowers-watercolor-painting-floral-design-painted-white-lotus-white-flowers-illustration-texture-flower-arranging_fjoiqy.png",
    color: "#f8fafc",
    mode: "contain",
  },
  holiday_0: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770204700/blue-flower-bouquet-with-watercolor-for-background-wedding-fabric-textile-greeting-card-wallpaper-banner-sticker-decoration-etc-vector_bmzhxg.png",
    color: "#f0f8ff",
    mode: "contain",
  },
  holiday_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770205210/ai-generated-watercolor-purple-floral-bouquet-clipart-gothic-flowers-illustration-free-png_jtgd4a.png",
    color: "#f0f8ff",
    mode: "contain",
  },
};

interface PdfProps {
  text: string;
  signature?: string;
  designId: string;
  fontId?: string;
  shopName: string;
}

export const CardPdfDocument = ({
  text,
  signature,
  designId,
  fontId,
  shopName,
}: PdfProps) => {
  const config = DESIGNS[designId] || DESIGNS["gentle_0"];

  let activeFontFamily = "Roboto";
  if (fontId === "font-playfair") activeFontFamily = "Playfair";
  if (fontId === "font-vibes") activeFontFamily = "Cursive";

  return (
    <Document>
      <Page size="A6" style={[styles.page, { backgroundColor: config.color }]}>
        <View style={styles.container}>
          {/* Верх: Картинка */}
          <View style={styles.imageSection}>
            <Image
              src={config.url}
              style={[styles.image, { objectFit: config.mode }]}
            />
          </View>

          {/* Середина: Текст (сверху) и Подпись (снизу) */}
          <View style={styles.contentSection}>
            <Text style={[styles.text, { fontFamily: activeFontFamily }]}>
              {text}
            </Text>

            {/* Подпись прижимается к низу секции */}
            {signature && (
              <View style={styles.signatureWrapper}>
                <Text
                  style={[styles.signature, { fontFamily: activeFontFamily }]}
                >
                  {signature}
                </Text>
              </View>
            )}
          </View>

          {/* Низ: Брендинг магазина */}
          <View style={styles.footer}>
            <Text style={styles.brandName}>{shopName}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
