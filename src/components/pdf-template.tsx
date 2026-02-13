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

    if (robotoRegular) fontsLoaded = true;
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
const CROP_OFFSET = 3 * MM_TO_PT;
const CROP_LENGTH = 5 * MM_TO_PT;
const MARK_BUFFER = 20 * MM_TO_PT;

// Safe Area
const SAFE_PADDING = 12 * MM_TO_PT;

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
  wrapper: {
    width: FULL_WIDTH,
    height: FULL_HEIGHT,
    position: "relative",
    // Фон задається динамічно через inline style
  },
  backgroundImage: {
    position: "absolute",
    top: BLEED,
    left: BLEED,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    objectFit: "fill",
  },
  safeArea: {
    position: "absolute",
    top: BLEED + SAFE_PADDING,
    left: BLEED + SAFE_PADDING,
    width: CARD_WIDTH - SAFE_PADDING * 2,
    height: CARD_HEIGHT - SAFE_PADDING * 2,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 1.5,
    paddingBottom: 20,
  },
  signatureWrapper: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: "100%",
    textAlign: "right",
  },
  signature: {
    fontSize: 16,
    textAlign: "right",
    opacity: 0.9,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    textAlign: "right",
  },
  brandName: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 700,
  },
});

interface DesignConfig {
  url: string;
  color: string; // Колір тексту
  bgColor: string; // Колір фону для вильотів (bleed)
}

const DESIGNS: Record<string, DesignConfig> = {
  gentle_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944121/1_naahmv.png",
    color: "#7D5A50",
    bgColor: "#FEFDFD",
  },
  gentle_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944120/2_edited_w7iij8.png",
    color: "#5E4B4B",
    bgColor: "#FDF9F9",
  },
  gentle_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944121/3_sgizoy.png",
    color: "#4A5D4E",
    bgColor: "#FEFCFC",
  },
  fun_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944219/1_ahpnjm.png",
    color: "#795548",
    bgColor: "#FEFBFA",
  },
  fun_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770948559/2_edited_1_a08gir.png",
    color: "#6D5D6E",
    bgColor: "#FEFCFB",
  },
  fun_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944218/3_edited_ejmimb.png",
    color: "#B71C1C",
    bgColor: "#FBFAF5",
  },
  fun_4: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944220/4_avhwvw.png",
    color: "#8E2424",
    bgColor: "#FEFBFA",
  },
  minimal_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943983/1_rxvdse.png",
    color: "#8D6E63",
    bgColor: "#FDF7F5",
  },
  minimal_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943982/2_manpil.png",
    color: "#705C5E",
    bgColor: "#FEFBFA",
  },
  minimal_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770943982/3_o0xjro.png",
    color: "#5D4037",
    bgColor: "#FEFBF9",
  },
  warm_1: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944424/1_dygtar.png",
    color: "#4E342E",
    bgColor: "#FDF4F5",
  },
  warm_2: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944425/2_yqzcqg.png",
    color: "#5B6346",
    bgColor: "#FEFBF9",
  },
  warm_3: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944424/3_ifdl3n.png",
    color: "#6B4F7E",
    bgColor: "#FDF8F3",
  },
  warm_4: {
    url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770944425/4_edited_qfsn7d.png",
    color: "#603813",
    bgColor: "#FEFBFB",
  },
};

interface PdfProps {
  text: string;
  signature?: string;
  designId: string;
  fontId?: string;
  shopName: string;
}

const CropMarks = () => {
  const left = BLEED;
  const top = BLEED;
  const right = FULL_WIDTH - BLEED;
  const bottom = FULL_HEIGHT - BLEED;

  const shift = (val: number) => val + MARK_BUFFER;

  return (
    <Svg
      style={{
        position: "absolute",
        top: -MARK_BUFFER,
        left: -MARK_BUFFER,
        width: FULL_WIDTH + MARK_BUFFER * 2,
        height: FULL_HEIGHT + MARK_BUFFER * 2,
      }}
    >
      <Line
        x1={shift(left)}
        y1={shift(top - CROP_OFFSET)}
        x2={shift(left)}
        y2={shift(top - CROP_OFFSET - CROP_LENGTH)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(left - CROP_OFFSET)}
        y1={shift(top)}
        x2={shift(left - CROP_OFFSET - CROP_LENGTH)}
        y2={shift(top)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(right)}
        y1={shift(top - CROP_OFFSET)}
        x2={shift(right)}
        y2={shift(top - CROP_OFFSET - CROP_LENGTH)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(right + CROP_OFFSET)}
        y1={shift(top)}
        x2={shift(right + CROP_OFFSET + CROP_LENGTH)}
        y2={shift(top)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(left)}
        y1={shift(bottom + CROP_OFFSET)}
        x2={shift(left)}
        y2={shift(bottom + CROP_OFFSET + CROP_LENGTH)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(left - CROP_OFFSET)}
        y1={shift(bottom)}
        x2={shift(left - CROP_OFFSET - CROP_LENGTH)}
        y2={shift(bottom)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(right)}
        y1={shift(bottom + CROP_OFFSET)}
        x2={shift(right)}
        y2={shift(bottom + CROP_OFFSET + CROP_LENGTH)}
        stroke="black"
        strokeWidth={0.5}
      />
      <Line
        x1={shift(right + CROP_OFFSET)}
        y1={shift(bottom)}
        x2={shift(right + CROP_OFFSET + CROP_LENGTH)}
        y2={shift(bottom)}
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
    if (fontId === "font-playfair") activeFontFamily = "Times-Roman";
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Використовуємо bgColor для фону вильотів */}
        <View style={[styles.wrapper, { backgroundColor: config.bgColor }]}>
          <Image src={config.url} style={styles.backgroundImage} />
          <CropMarks />

          <View style={styles.safeArea}>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.text,
                  // Використовуємо color для тексту
                  { fontFamily: activeFontFamily, color: config.color },
                ]}
              >
                {text}
              </Text>
            </View>

            {signature && (
              <View style={styles.signatureWrapper}>
                <Text
                  style={[
                    styles.signature,
                    // Використовуємо color для підпису
                    { fontFamily: signatureFontFamily, color: config.color },
                  ]}
                >
                  {signature}
                </Text>
              </View>
            )}

            <View style={styles.footer}>
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
