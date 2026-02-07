"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  Heart,
  Sparkles,
  Smile,
  PenTool,
  Loader2,
  Check,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const MAX_TEXT_LENGTH = Number(process.env.NEXT_PUBLIC_MAX_SYMBOLS_TEXT) || 168;
const MAX_SIGNATURE_LENGTH =
  Number(process.env.NEXT_PUBLIC_MAX_SYMBOLS_SIGN) || 30;

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
        fit: "object-contain",
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
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770207274/Gemini_Generated_Image_40q4kt40q4kt40q4_prll00.png",
        bg: "bg-yellow-100/50",
        text: "text-orange-900",
        fit: "object-cover",
      },
      {
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
        url: "https://res.cloudinary.com/dzbf3cpwm/image/upload/v1770205210/ai-generated-watercolor-purple-floral-bouquet-clipart-gothic-flowers-illustration-free-png_jtgd4a.png",
        bg: "bg-[#f0f8ff]",
        text: "text-violet-900",
        fit: "object-cover",
      },
    ],
  },
};

const FLATTENED_VARIANTS = Object.entries(DESIGNS).flatMap(
  ([catKey, catData]) =>
    catData.variants.map((variant, index) => ({
      category: catKey as keyof typeof DESIGNS,
      variantIndex: index,
      ...variant,
    })),
);

const TEXT_HINTS = [
  "З Днем Народження!",
  "Ти — моє натхнення",
  "Дякую, що ти є",
  "Найщиріші вітання!",
  "Люблю тебе безмежно",
  "Одужуй швидше",
];

interface ShopData {
  name: string;
  logoUrl?: string;
  slug: string;
  _id: string;
}

const stripEmojis = (str: string) => {
  return str.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu,
    "",
  );
};

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

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      const variant = FLATTENED_VARIANTS[index];
      if (variant) {
        setCategory(variant.category);
        setVariantIndex(variant.variantIndex);
      }
    });
  }, [api]);

  const handleCategoryClick = (catKey: keyof typeof DESIGNS) => {
    if (!api) return;
    const index = FLATTENED_VARIANTS.findIndex(
      (v) => v.category === catKey && v.variantIndex === 0,
    );
    if (index !== -1) {
      api.scrollTo(index);
    }
  };

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
      if (!res.ok) throw new Error(data.error || "Failed");
      setLastOrderId(data.orderId);
      setStep("success");
      setIsModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(e.message || "Помилка. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let cleanValue = stripEmojis(e.target.value);
    if (cleanValue.length > MAX_TEXT_LENGTH) {
      cleanValue = cleanValue.slice(0, MAX_TEXT_LENGTH);
    }
    setText(cleanValue);
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanValue = stripEmojis(e.target.value);
    if (cleanValue.length > MAX_SIGNATURE_LENGTH) {
      cleanValue = cleanValue.slice(0, MAX_SIGNATURE_LENGTH);
    }
    setSignature(cleanValue);
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
              width={112}
              height={112}
              className="w-28 h-28 object-cover rounded-full bg-white shadow-xl relative z-10 p-2"
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {shop.logoUrl && (
            <Image
              src={shop.logoUrl}
              alt={shop.name}
              width={32}
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
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="sticky top-24 w-full flex flex-col items-center gap-6">
            {/* --- CAROUSEL --- */}
            <Carousel
              setApi={setApi}
              className="w-full max-w-[340px]"
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {FLATTENED_VARIANTS.map((variant, index) => {
                  const isActive =
                    category === variant.category &&
                    variantIndex === variant.variantIndex;
                  return (
                    <CarouselItem
                      key={`${variant.category}-${variant.variantIndex}`}
                    >
                      <div
                        className={cn(
                          "p-6 transition-all duration-500 ease-out", // Отступ для тени
                          isActive
                            ? "scale-100 opacity-100"
                            : "scale-90 opacity-50 blur-[1px]", // Эффект фокуса
                        )}
                      >
                        <div
                          className={cn(
                            "relative w-full aspect-[105/148] overflow-hidden rounded-sm bg-white transition-all duration-500",
                            // Тень и контур
                            isActive
                              ? "shadow-[0_10px_20px_-2px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
                              : "shadow-none ring-1 ring-black/5",
                            variant.bg,
                          )}
                        >
                          <div
                            className={cn(
                              "w-full h-full p-7 flex flex-col items-center text-center",
                            )}
                          >
                            <div className="w-full h-[45%] overflow-hidden mb-5 relative mix-blend-multiply">
                              <Image
                                src={variant.url}
                                alt="design"
                                fill
                                className={cn("object-center", variant.fit)}
                                sizes="(max-width: 768px) 100vw, 340px"
                                priority={isActive}
                              />
                            </div>
                            <div className="flex-1 w-full overflow-hidden">
                              <p
                                className={cn(
                                  "text-lg whitespace-pre-wrap leading-relaxed break-words select-none",
                                  variant.text,
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
                                    "text-md opacity-90 select-none",
                                    variant.text,
                                    selectedFont.class,
                                  )}
                                >
                                  {signature}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Блик на активной карте для реализма */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 pointer-events-none mix-blend-overlay" />
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-0 shadow-md" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white border-0 shadow-md " />
            </Carousel>

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
                  onClick={() =>
                    handleCategoryClick(key as keyof typeof DESIGNS)
                  }
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all",
                    category === key
                      ? "bg-white border-pink-500 shadow-md text-slate-900"
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
            <div className="flex justify-between items-baseline">
              <Label className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest">
                2. Текст привітання
              </Label>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  text.length >= MAX_TEXT_LENGTH
                    ? "text-red-500"
                    : "text-slate-400",
                )}
              >
                {text.length}/{MAX_TEXT_LENGTH}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {TEXT_HINTS.map((hint) => (
                <button
                  key={hint}
                  onClick={() => {
                    // Перевіряємо, чи влізе підказка
                    if (hint.length <= MAX_TEXT_LENGTH) setText(hint);
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 whitespace-nowrap hover:border-pink-300 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
            <Textarea
              value={text}
              onChange={handleTextChange}
              maxLength={MAX_TEXT_LENGTH}
              placeholder="Напишіть кілька теплих слів…"
              className="bg-white focus:border-pink-500! duration-300 transition-all rounded-2xl min-h-[140px] text-base p-4 focus:ring-0!"
            />
          </div>

          {/* Підпис */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <Label className="text-slate-400 uppercase text-[10px] font-extrabold tracking-widest">
                3. Підпис
              </Label>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  signature.length >= MAX_SIGNATURE_LENGTH
                    ? "text-red-500"
                    : "text-slate-400",
                )}
              >
                {signature.length}/{MAX_SIGNATURE_LENGTH}
              </span>
            </div>
            <Input
              value={signature}
              onChange={handleSignatureChange}
              maxLength={MAX_SIGNATURE_LENGTH}
              placeholder="Ваше ім'я"
              className="bg-white focus:border-pink-500! transition-all duration-300 focus:ring-0! rounded-2xl h-14 px-4 text-base"
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
        <DialogContent className="rounded-3xl p-6 md:p-8 w-[90%] max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Останній крок
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Введіть 4 останні цифри вашого номеру телефону для ідентифікації.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Input
              placeholder="0000"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              className="text-center text-4xl md:text-5xl tracking-[0.3em] w-full max-w-[200px] h-16 md:h-20 font-mono bg-slate-50 border-2 rounded-2xl focus:border-pink-500! focus:ring-0!"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <DialogFooter>
            <Button
              className="w-full h-12 md:h-14 text-lg rounded-2xl bg-slate-900"
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
