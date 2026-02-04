"use client";

import { useState } from "react";
import Image from "next/image"; // Импортируем компонент Image
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Sparkles,
  Smile,
  PenTool,
  Loader2,
  Check,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- КОНФІГУРАЦІЯ ---
const FONTS = [
  { id: "font-inter", label: "Сучасний", class: "font-sans" },
  { id: "font-playfair", label: "Елегантний", class: "font-serif" },
  { id: "font-vibes", label: "Рукописний", class: "font-cursive" },
];

const DESIGNS = {
  gentle: {
    label: "Ніжно",
    icon: Heart,
    variants: [
      {
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770203577/1-12574_watercolor-flower-png-free-flower-pink-vector-png_kyet2r.png",
        bg: "bg-[#fff0f5]",
        text: "text-rose-900",
        fit: "object-contain", // Для PNG краще contain
      },
      {
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770203578/1000_F_612026850_6JlSZVdzOqa3sPiePleg5nqMtBVYWuib_ul4ah2.png",
        bg: "bg-[#fff5f5]",
        text: "text-rose-800",
        fit: "object-contain",
      },
    ],
  },
  fun: {
    label: "Тепло",
    icon: Smile,
    variants: [
      {
        // Тепле фото (пляж/літо)
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207274/Gemini_Generated_Image_40q4kt40q4kt40q4_prll00.png",
        bg: "bg-yellow-100/50",
        text: "text-orange-900",
        fit: "object-cover", // Для фото краще cover
      },
      {
        // Тепле фото (осінь/затишок)
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207273/Gemini_Generated_Image_30blr30blr30blr3_u4r5wx.png",
        bg: "bg-[#fff8e1]",
        text: "text-amber-900",
        fit: "object-cover",
      },
    ],
  },
  minimal: {
    label: "Мінімал",
    icon: PenTool,
    variants: [
      {
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770206593/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEyL3Jhd3BpeGVsb2ZmaWNlMTFfc2ltcGxlX3dhdGVyY29sb3JfcHJpbnRfb2Zfd2hpdGVfYW5kX2dyZWVuX3dlZF9hYWQ3ZmY3MC01MTJiLTQ3YjUtYjkyZS03MTM5N2ExOTRjYTEucG5n_1_bvjyjc.png",
        bg: "bg-white",
        text: "text-slate-800",
        fit: "object-contain",
      },
      {
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207052/png-clipart-watercolor-flowers-watercolor-painting-floral-design-painted-white-lotus-white-flowers-illustration-texture-flower-arranging_fjoiqy.png",
        bg: "bg-slate-50",
        text: "text-slate-900",
        fit: "object-contain",
      },
    ],
  },
  holiday: {
    label: "Свято",
    icon: Sparkles,
    variants: [
      {
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770204700/blue-flower-bouquet-with-watercolor-for-background-wedding-fabric-textile-greeting-card-wallpaper-banner-sticker-decoration-etc-vector_bmzhxg.png",
        bg: "bg-[#f0f8ff]",
        text: "text-indigo-900",
        fit: "object-contain",
      },
      {
        // Тепле фото (осінь/затишок)
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770205210/ai-generated-watercolor-purple-floral-bouquet-clipart-gothic-flowers-illustration-free-png_jtgd4a.png",
        bg: "bg-[#f0f8ff]",
        text: "text-violet-900",
        fit: "object-cover",
      },
    ],
  },
};

// Оновлені підказки з реальними фразами для листівок
const TEXT_HINTS = [
  "З Днем Народження! 🎂",
  "Ти — моє натхнення ❤️",
  "Дякую, що ти є",
  "Найщиріші вітання!",
  "Люблю тебе безмежно",
  "Одужуй швидше 🌸",
];

interface ShopData {
  name: string;
  logoUrl?: string;
  slug: string;
  _id: string;
}

export default function CardBuilder({ shop }: { shop: ShopData }) {
  const [step, setStep] = useState<"intro" | "editor" | "success">("intro");
  const [category, setCategory] = useState<keyof typeof DESIGNS>("gentle");
  const [variantIndex, setVariantIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [text, setText] = useState("");
  const [signature, setSignature] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shop._id,
          text,
          signature,
          designId: `${category}_${variantIndex}`,
          fontId: selectedFont.id,
          phoneLast4,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setLastOrderId(data.orderId);
      setStep("success");
      setIsModalOpen(false);
    } catch (e) {
      alert("Помилка. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white animate-in fade-in duration-500">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-pink-200 blur-3xl opacity-20 rounded-full scale-150" />
          {shop.logoUrl ? (
            <Image
              src={shop.logoUrl}
              alt="Logo"
              width={112} // w-28 = 7rem = 112px
              height={112}
              className="w-28 h-28 object-contain rounded-full bg-white shadow-xl relative z-10 p-2"
              priority
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center relative z-10 text-pink-300">
              <Heart size={48} />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-3">
          Створіть листівку
          <br />
          для вашого букета
        </h1>
        <p className="text-slate-500 text-lg mb-10">Це займе менше хвилини</p>
        <Button
          size="lg"
          className="w-full max-w-xs rounded-full h-14 text-lg shadow-lg bg-slate-900"
          onClick={() => setStep("editor")}
        >
          Почати
        </Button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-green-50 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
          Листівка готова!
        </h2>
        <p className="text-slate-600 text-lg max-w-xs mx-auto mb-8">
          Ми передали її в <strong>{shop.name}</strong>.<br />
          Її надрукують і додадуть до букета.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {lastOrderId && (
            <a
              href={`/api/order/${lastOrderId}/download`}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="w-full rounded-full gap-2 bg-slate-900">
                <Download size={18} /> Завантажити для себе
              </Button>
            </a>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-full border-green-200 text-green-700"
          >
            Створити ще одну
          </Button>
        </div>
      </div>
    );
  }

  const currentVariant = DESIGNS[category].variants[variantIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Хедер */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {shop.logoUrl && (
            <Image
              src={shop.logoUrl}
              alt={shop.name}
              width={32} // w-8 = 2rem = 32px
              height={32}
              className="w-8 h-8 object-contain rounded-full"
            />
          )}
          <span className="font-bold text-slate-800 text-lg">{shop.name}</span>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Редактор листівки
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-4 md:p-8">
        {/* ЛІВА ЧАСТИНА: ПРЕВ'Ю (Фіксована позиція на ПК) */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="sticky top-24 w-full flex flex-col items-center gap-6">
            <div className="relative w-full aspect-[105/148] shadow-2xl rounded-sm overflow-hidden max-w-[340px] ring-1 ring-black/5 bg-white">
              <div
                className={cn(
                  "w-full h-full p-6 flex flex-col items-center text-center transition-all duration-500",
                  currentVariant.bg,
                )}
              >
                <div className="w-full h-[45%] overflow-hidden mb-5 relative mix-blend-multiply">
                  {/* Замінили img на Image з fill для адаптивності */}
                  <Image
                    src={currentVariant.url}
                    alt="design"
                    fill
                    className={cn("object-center", currentVariant.fit)}
                    sizes="(max-width: 768px) 100vw, 340px"
                    priority
                  />
                </div>
                <div className="flex-1 w-full overflow-hidden">
                  <p
                    className={cn(
                      "text-lg whitespace-pre-wrap leading-relaxed break-words",
                      currentVariant.text,
                      selectedFont.class,
                    )}
                  >
                    {text || "Напишіть кілька теплих слів…"}
                  </p>
                </div>
                {signature && (
                  <div className="w-full text-right mt-auto pt-2">
                    <p
                      className={cn(
                        "text-xl opacity-90",
                        currentVariant.text,
                        selectedFont.class,
                      )}
                    >
                      {signature}
                    </p>
                  </div>
                )}
              </div>

              {DESIGNS[category].variants.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
                  <button
                    onClick={() =>
                      setVariantIndex(
                        (prev) =>
                          (prev - 1 + DESIGNS[category].variants.length) %
                          DESIGNS[category].variants.length,
                      )
                    }
                    className="pointer-events-auto bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setVariantIndex(
                        (prev) =>
                          (prev + 1) % DESIGNS[category].variants.length,
                      )
                    }
                    className="pointer-events-auto bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">
              Попередній перегляд (A6)
            </p>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: НАЛАШТУВАННЯ */}
        <div className="w-full md:w-1/2 space-y-8 pb-32 md:pb-8">
          {/* Категорії */}
          <div className="space-y-3">
            <Label className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest">
              1. Оберіть стиль
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(DESIGNS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCategory(key as any);
                    setVariantIndex(0);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all",
                    category === key
                      ? "bg-white border-pink-300 shadow-md text-slate-900"
                      : "bg-slate-100 border-transparent text-slate-400",
                  )}
                >
                  <data.icon
                    size={24}
                    className={category === key ? "text-pink-500" : ""}
                  />
                  <span className="text-[10px] font-bold">{data.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Текст */}
          <div className="space-y-3">
            <Label className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest">
              2. Текст привітання
            </Label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {TEXT_HINTS.map((hint) => (
                <button
                  key={hint}
                  onClick={() => setText(hint)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 whitespace-nowrap hover:border-pink-300 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишіть кілька теплих слів…"
              className="bg-white border-slate-200 rounded-2xl min-h-[140px] text-base p-4 focus:ring-pink-100"
            />
          </div>

          {/* Підпис */}
          <div className="space-y-3">
            <Label className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest">
              3. Підпис
            </Label>
            <Input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Ваше ім'я"
              className="bg-white border-slate-200 rounded-2xl h-14 px-4 text-base"
            />
          </div>

          {/* Шрифти */}
          <div className="space-y-3">
            <Label className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest">
              4. Шрифт
            </Label>
            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl gap-1">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font)}
                  className={cn(
                    "flex-1 py-3 text-sm rounded-xl transition-all font-medium",
                    selectedFont.id === font.id
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500",
                  )}
                >
                  <span className={font.class}>{font.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!text.trim()}
            className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl bg-slate-900 text-white mt-8 hover:bg-slate-800 transition-colors"
          >
            Готово — Відправити флористу
          </Button>
        </div>
      </div>

      {/* МОДАЛКА */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-3xl p-8 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Останній крок
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Введіть 4 останні цифри вашого номеру телефону для ідентифікації
              замовлення.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Input
              placeholder="0000"
              maxLength={4}
              className="text-center text-5xl tracking-[0.3em] w-[200px] h-20 font-mono bg-slate-50 border-2 rounded-2xl"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <DialogFooter>
            <Button
              className="w-full h-14 text-lg rounded-2xl"
              onClick={handleSend}
              disabled={phoneLast4.length < 4 || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Відправити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
