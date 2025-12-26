import Quill from "quill";

const Size = Quill.import("formats/size");
const Font = Quill.import("formats/font");

// Register custom font sizes
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

// Register custom fonts
Font.whitelist = [
  "arial",
  "timesNewRoman",
  "courierNew",
  "georgia",
  "verdana",
  "helvetica",
];

Quill.register(Size, true);
Quill.register(Font, true);
