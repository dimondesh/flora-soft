// src/components/pdf-template.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Svg,
  Line,
} from "@react-pdf/renderer";
import path from "path";
import fs from "fs";

// --- Font Loading Logic ---
let fontsLoaded = false;
let robotoRegular: string | undefined;
let robotoBold: string | undefined;
let marckScript: string | undefined;
let greatVibes: string | undefined;
let playfair: string | undefined;

const loadFont = (filename: string) => {
  try {
    const filePath = path.join(process.cwd(), "public", "fonts", filename);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return `data:font/ttf;base64,${buffer.toString("base64")}`;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

const registerFonts = () => {
  if (fontsLoaded) return;

  // Спробуємо завантажити шрифти
  try {
    robotoRegular = loadFont("Roboto-Regular.ttf");
    robotoBold = loadFont("Roboto-Bold.ttf");
    marckScript = loadFont("MarckScript-Regular.ttf");
    greatVibes = loadFont("GreatVibes-Regular.ttf");
    playfair = loadFont("PlayfairDisplay-Regular.ttf");

    if (robotoRegular && robotoBold) {
      Font.register({
        family: "Roboto",
        fonts: [
          { src: robotoRegular, fontWeight: 400 },
          { src: robotoBold, fontWeight: 700 },
        ],
      });
    }
    if (marckScript) Font.register({ family: "MarckScript", src: marckScript });
    if (greatVibes) {
      Font.register({ family: "GreatVibes", src: greatVibes });
    } else if (marckScript) {
      Font.register({ family: "GreatVibes", src: marckScript });
    }
    if (playfair) Font.register({ family: "Playfair", src: playfair });

    // Вважаємо, що шрифти завантажені, якщо хоча б основний є
    if (robotoRegular) fontsLoaded = true;
  } catch (error) {
    console.error("Font registration error:", error);
    // fontsLoaded залишається false
  }
};

registerFonts();

// --- CONSTANTS & DIMENSIONS ---
const MM_TO_PT = 2.83465;

// Page (A4)
const A4_WIDTH = 210 * MM_TO_PT;
const A4_HEIGHT = 297 * MM_TO_PT;

// Card Final Size (Clean A6)
const CARD_WIDTH = 105 * MM_TO_PT;
const CARD_HEIGHT = 148 * MM_TO_PT;

// Bleed
const BLEED_MM = 3;
const BLEED = BLEED_MM * MM_TO_PT;

// Card with Bleed (Image Size)
const FULL_WIDTH = CARD_WIDTH + BLEED * 2; // 111mm
const FULL_HEIGHT = CARD_HEIGHT + BLEED * 2; // 154mm

// Crop Marks Configuration
const CROP_OFFSET = 3 * MM_TO_PT;
const CROP_LENGTH = 5 * MM_TO_PT;

// Safe Area (Padding inside the clean card)
const SAFE_PADDING = 8 * MM_TO_PT;

// Styles
const styles = StyleSheet.create({
  page: {
    width: A4_WIDTH,
    height: A4_HEIGHT,
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Контейнер (Wrapper) тепер просто задає розміри і є точкою відліку (relative)
  wrapper: {
    width: FULL_WIDTH,
    height: FULL_HEIGHT,
    position: "relative",
  },
  // Фон (картинка) - абсолютне позиціювання
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: FULL_WIDTH,
    height: FULL_HEIGHT,
    objectFit: "cover",
  },
  // Безпечна зона - ТАКОЖ абсолютне позиціювання, щоб гарантовано бути зверху
  safeArea: {
    position: "absolute",
    top: BLEED + SAFE_PADDING, // Зсув зверху: 3мм (блід) + 8мм (відступ)
    left: BLEED + SAFE_PADDING, // Зсув зліва
    width: CARD_WIDTH - SAFE_PADDING * 2,
    height: CARD_HEIGHT - SAFE_PADDING * 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 1.5,
  },
  signatureWrapper: {
    marginTop: "auto",
    paddingTop: 10,
    width: "100%",
    alignItems: "flex-end",
  },
  signature: {
    fontSize: 16,
    textAlign: "right",
    opacity: 0.9,
  },
  footer: {
    height: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  brandName: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Roboto", // Fallback буде оброблено в компоненті
    fontWeight: 700,
  },
});

interface DesignConfig {
  url: string;
  color: string;
}

const DESIGNS: Record<string, DesignConfig> = {
  gentle_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944121/1_naahmv.png",
    color: "#7D5A50",
  },
  gentle_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944120/2_edited_w7iij8.png",
    color: "#5E4B4B",
  },
  gentle_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944121/3_sgizoy.png",
    color: "#4A5D4E",
  },
  fun_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944219/1_ahpnjm.png",
    color: "#795548",
  },
  fun_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770948559/2_edited_1_a08gir.png",
    color: "#6D5D6E",
  },
  fun_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944218/3_edited_ejmimb.png",
    color: "#B71C1C",
  },
  fun_4: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944220/4_avhwvw.png",
    color: "#8E2424",
  },
  minimal_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943983/1_rxvdse.png",
    color: "#8D6E63",
  },
  minimal_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943982/2_manpil.png",
    color: "#705C5E",
  },
  minimal_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943982/3_o0xjro.png",
    color: "#5D4037",
  },
  warm_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944424/1_dygtar.png",
    color: "#4E342E",
  },
  warm_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944425/2_yqzcqg.png",
    color: "#5B6346",
  },
  warm_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944424/3_ifdl3n.png",
    color: "#6B4F7E",
  },
  warm_4: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944425/4_edited_qfsn7d.png",
    color: "#603813",
  },
};
interface PdfProps {
  text: string;
  signature?: string;
  designId: string;
  fontId?: string;
  shopName: string;
}

// Компонент для малювання міток різу
const CropMarks = () => {
  const left = BLEED;
  const top = BLEED;
  const right = FULL_WIDTH - BLEED;
  const bottom = FULL_HEIGHT - BLEED;

  return (
    <Svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
      }}
    >
      {/* Top Left */}
      <Line
        x1={left}
        y1={top - CROP_OFFSET}
        x2={left}
        y2={top - CROP_OFFSET - CROP_LENGTH}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={left - CROP_OFFSET}
        y1={top}
        x2={left - CROP_OFFSET - CROP_LENGTH}
        y2={top}
        stroke="black"
        strokeWidth={0.5}
      />
      {/* Top Right */}
      <Line
        x1={right}
        y1={top - CROP_OFFSET}
        x2={right}
        y2={top - CROP_OFFSET - CROP_LENGTH}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={right + CROP_OFFSET}
        y1={top}
        x2={right + CROP_OFFSET + CROP_LENGTH}
        y2={top}
        stroke="black"
        strokeWidth={0.5}
      />
      {/* Bottom Left */}
      <Line
        x1={left}
        y1={bottom + CROP_OFFSET}
        x2={left}
        y2={bottom + CROP_OFFSET + CROP_LENGTH}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={left - CROP_OFFSET}
        y1={bottom}
        x2={left - CROP_OFFSET - CROP_LENGTH}
        y2={bottom}
        stroke="black"
        strokeWidth={0.5}
      />
      {/* Bottom Right */}
      <Line
        x1={right}
        y1={bottom + CROP_OFFSET}
        x2={right}
        y2={bottom + CROP_OFFSET + CROP_LENGTH}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={right + CROP_OFFSET}
        y1={bottom}
        x2={right + CROP_OFFSET + CROP_LENGTH}
        y2={bottom}
        stroke="black"
        strokeWidth={0.5}
      />
    </Svg>
  );
};

export const CardPdfDocument = ({
  text,
  signature,
  designId,
  fontId,
  shopName,
}: PdfProps) => {
  const config = DESIGNS[designId] || DESIGNS["gentle_1"];

  // Логіка вибору шрифту з запасним варіантом (Helvetica), якщо файли не завантажились
  let activeFontFamily = fontsLoaded ? "Roboto" : "Helvetica";
  let signatureFontFamily = fontsLoaded ? "Roboto" : "Helvetica";

  if (fontsLoaded) {
    if (fontId === "font-playfair") {
      activeFontFamily = "MarckScript";
      signatureFontFamily = "MarckScript";
    }
    if (fontId === "font-vibes") {
      activeFontFamily = "GreatVibes";
      signatureFontFamily = "GreatVibes";
    }
  } else {
    // Fallback для стилів, якщо файлів немає
    if (fontId === "font-playfair") activeFontFamily = "Times-Roman";
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Центральний контейнер (Wrapper) */}
        <View style={styles.wrapper}>
          {/* 1. ФОН (Найнижчий шар) */}
          <Image
            src={config.url}
            style={[styles.backgroundImage]} // Прибрав backgroundColor, він тут не критичний, якщо картинка завантажується
          />

          {/* 2. МІТКИ РІЗУ */}
          <CropMarks />

          {/* 3. КОНТЕНТ (Верхній шар, абсолютне позиціювання) */}
          <View style={styles.safeArea}>
            <View style={styles.textContainer}>
              {/* ДОДАНО: color: config.color */}
              <Text
                style={[
                  styles.text,
                  { fontFamily: activeFontFamily, color: config.color },
                ]}
              >
                {text}
              </Text>
            </View>

            {signature && (
              <View style={styles.signatureWrapper}>
                {/* ДОДАНО: color: config.color */}
                <Text
                  style={[
                    styles.signature,
                    { fontFamily: signatureFontFamily, color: config.color },
                  ]}
                >
                  {signature}
                </Text>
              </View>
            )}

            <View style={styles.footer}>
              {/* Використовуємо Helvetica для футера, якщо Roboto не завантажився */}
              <Text
                style={[
                  styles.brandName,
                  { fontFamily: fontsLoaded ? "Roboto" : "Helvetica" },
                ]}
              >
                {shopName}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
