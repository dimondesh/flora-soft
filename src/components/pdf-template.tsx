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

// --- Font Loading Logic (Same as before) ---
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
  robotoRegular = loadFont("Roboto-Regular.ttf");
  robotoBold = loadFont("Roboto-Bold.ttf");
  marckScript = loadFont("MarckScript-Regular.ttf");
  greatVibes = loadFont("GreatVibes-Regular.ttf");
  playfair = loadFont("PlayfairDisplay-Regular.ttf");

  try {
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
    fontsLoaded = true;
  } catch (error) {
    console.error("Font registration error:", error);
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
const CROP_OFFSET = 3 * MM_TO_PT; // Відступ мітки від кута листівки
const CROP_LENGTH = 5 * MM_TO_PT; // Довжина лінії різу

// Safe Area (Padding inside the clean card)
const SAFE_PADDING = 8 * MM_TO_PT; // 8mm from edge

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
  // Контейнер, який центрує все на А4
  wrapper: {
    width: FULL_WIDTH,
    height: FULL_HEIGHT,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Фон (картинка з вильотами)
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: FULL_WIDTH,
    height: FULL_HEIGHT,
    objectFit: "cover", // Заповнюємо весь простір вильотів
  },
  // Безпечна зона для тексту (всередині чистого розміру)
  safeArea: {
    width: CARD_WIDTH - SAFE_PADDING * 2,
    height: CARD_HEIGHT - SAFE_PADDING * 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 10,
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
    color: "#334155",
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
    color: "#334155",
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
    fontFamily: "Roboto",
    fontWeight: 700,
  },
  // Шар для міток різу (поверх усього)
  cropLayer: {
    position: "absolute",
    top: -20 * MM_TO_PT, // Виходимо за межі картки
    left: -20 * MM_TO_PT,
    width: FULL_WIDTH + 40 * MM_TO_PT,
    height: FULL_HEIGHT + 40 * MM_TO_PT,
    pointerEvents: "none",
  },
});

interface DesignConfig {
  url: string;
  color: string; // Fallback color
}

// TODO: Замініть URL на реальні, коли завантажите нові фони 1240x1748
const DESIGNS: Record<string, DesignConfig> = {
  gentle_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944121/1_naahmv.png",
    color: "#fff0f5",
  },
  gentle_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944120/2_edited_w7iij8.png",
    color: "#fff5f5",
  },
  gentle_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944121/3_sgizoy.png",
    color: "#fff5f5",
  },
  fun_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944219/1_ahpnjm.png",
    color: "#fef9c3",
  },
  fun_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944219/2_edited_zx67ff.png",
    color: "#fff8e1",
  },
  fun_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944218/3_edited_ejmimb.png",
    color: "#fff8e1",
  },
  fun_4: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944220/4_avhwvw.png",
    color: "#fff8e1",
  },
  minimal_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943983/1_rxvdse.png",
    color: "#f8fafc",
  },
  minimal_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943982/2_manpil.png",
    color: "#ffffff",
  },
  minimal_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943982/3_o0xjro.png",
    color: "#ffffff",
  },
  warm_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944424/1_dygtar.png",
    color: "#f0f8ff",
  },
  warm_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944425/2_yqzcqg.png",
    color: "#f0f8ff",
  },
  warm_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944424/3_ifdl3n.png",
    color: "#f0f8ff",
  },
  warm_4: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944425/4_edited_qfsn7d.png",
    color: "#f0f8ff",
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
  // Координати кутів чистого формату відносно центру (враховуючи offset шару cropLayer)
  // Центр cropLayer співпадає з центром картки

  // Координати кутів обрізного формату (Clean Size) всередині FULL_WIDTH/HEIGHT
  const left = BLEED;
  const top = BLEED;
  const right = FULL_WIDTH - BLEED;
  const bottom = FULL_HEIGHT - BLEED;

  // Абсолютні координати в Svg, який покриває весь Wrapper
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
  const config = DESIGNS[designId] || DESIGNS["gentle_0"];
  let activeFontFamily = "Roboto";
  if (fontId === "font-playfair") activeFontFamily = "MarckScript";
  if (fontId === "font-vibes") activeFontFamily = "GreatVibes";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Центральний контейнер з розмірами листівки + бліди */}
        <View style={styles.wrapper}>
          {/* Фон - заповнює все, включаючи вильоти */}
          <Image
            src={config.url}
            style={[styles.backgroundImage, { backgroundColor: config.color }]}
          />

          {/* Мітки різу */}
          <CropMarks />

          {/* Безпечна зона для контенту */}
          <View style={styles.safeArea}>
            <View style={styles.textContainer}>
              <Text style={[styles.text, { fontFamily: activeFontFamily }]}>
                {text}
              </Text>
            </View>

            {signature && (
              <View style={styles.signatureWrapper}>
                <Text
                  style={[styles.signature, { fontFamily: activeFontFamily }]}
                >
                  {signature}
                </Text>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.brandName}>{shopName}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
