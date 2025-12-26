let initialized = false;

export const initializeQuill = async () => {
  if (initialized || typeof window === "undefined") return;

  const Quill = (await import("quill")).default;
  const QuillTableBetterModule = await import("quill-table-better");
  const QuillTableBetter = QuillTableBetterModule.default;

  // Register custom sizes and fonts
  const Size = Quill.import("formats/size");
  const Font = Quill.import("formats/font");

  Size.whitelist = [
    "8px",
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "22px",
    "24px",
    "26px",
    "28px",
    "36px",
    "48px",
    "72px",
  ];

  Font.whitelist = [
    "arial",
    "timesNewRoman",
    "courierNew",
    "georgia",
    "verdana",
    "helvetica",
    "adventPro",
    "openSans",
  ];

  Quill.register(Size, true);
  Quill.register(Font, true);

  // Register table-better module
  Quill.register("modules/table-better", QuillTableBetter);

  initialized = true;

  return { Quill, QuillTableBetter };
};
