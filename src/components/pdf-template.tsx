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
    console.warn(`⚠️ Шрифт не знайдено за шляхом: ${filePath}`);
    return undefined;
  } catch (e) {
    console.error(`❌ Помилка читання шрифту ${filename}:`, e);
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

    if (marckScript) {
      Font.register({ family: "MarckScript", src: marckScript });
    }

    if (greatVibes) {
      Font.register({ family: "GreatVibes", src: greatVibes });
    } else {
      // Fallback
      if (marckScript) {
        Font.register({ family: "GreatVibes", src: marckScript });
      }
    }

    if (playfair) {
      Font.register({ family: "Playfair", src: playfair });
    }

    fontsLoaded = true;
    console.log("✅ Шрифти успішно зареєстровані");
  } catch (error) {
    console.error("🔥 Помилка реєстрації шрифтів:", error);
  }
};

registerFonts();

const MM_TO_PT = 2.83465;
const PAGE_WIDTH = 111 * MM_TO_PT;
const PAGE_HEIGHT = 154 * MM_TO_PT;
const CONTENT_PADDING = 10 * MM_TO_PT;

const styles = StyleSheet.create({
  page: {
    padding: CONTENT_PADDING,
    flexDirection: "column",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  imageSection: {
    height: "45%",
    width: "100%",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentSection: {
    flexGrow: 1,
    flexDirection: "column",
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

  if (fontId === "font-playfair") activeFontFamily = "MarckScript";
  if (fontId === "font-vibes") activeFontFamily = "GreatVibes";

  return (
    <Document>
      <Page
        size={[PAGE_WIDTH, PAGE_HEIGHT]}
        style={[styles.page, { backgroundColor: config.color }]}
      >
        <View style={styles.container}>
          <View style={styles.imageSection}>
            <Image
              src={config.url}
              style={[styles.image, { objectFit: config.mode }]}
            />
          </View>

          <View style={styles.contentSection}>
            <Text style={[styles.text, { fontFamily: activeFontFamily }]}>
              {text}
            </Text>

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

          <View style={styles.footer}>
            <Text style={styles.brandName}>{shopName}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
