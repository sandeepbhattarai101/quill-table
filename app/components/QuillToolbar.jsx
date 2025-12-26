import {
  CookingPot,
  EraserIcon,
  MinusIcon,
  PlusIcon,
  Redo,
  Rows2,
  Undo,
} from "lucide-react";
import { FONT_LIST, FONT_SIZE } from "../constant";
// import { LineBreakIcon, PageBreakIcon, RedoIcon, UndoIcon } from "./icons";

const LineBreakIcon = () => {
  return <Rows2 />;
};
const PageBreakIcon = () => {
  return <CookingPot />;
};
const RedoIcon = () => {
  return <Redo />;
};
const UndoIcon = () => {
  return <Undo />;
};

export const placeholderDropDownData = [
  { label: "[BILLABLE_RATES_TABLE]", value: "[BILLABLE_RATES_TABLE]" },
  { label: "[ONBOARDING_LINK]", value: "[ONBOARDING_LINK]" },
  { label: "[PROPOSAL_NUMBER]", value: "[PROPOSAL_NUMBER]" },
  { label: "[WON_DATE]", value: "[WON_DATE]" },
  { label: "[LIVE_DATE]", value: "[LIVE_DATE]" },
  { label: "[ENGAGEMENT_START_DATE]", value: "[ENGAGEMENT_START_DATE]" },
  { label: "[CONTACT_MEDIUMS]", value: "[CONTACT_MEDIUMS]" },
  { label: "[CONTACT_FIRST_NAME]", value: "[CONTACT_FIRST_NAME]" },
  { label: "[CONTACT_MIDDLE_NAME]", value: "[CONTACT_MIDDLE_NAME]" },
  { label: "[CONTACT_LAST_NAME]", value: "[CONTACT_LAST_NAME]" },
  { label: "[CONTACT_EMAIL]", value: "[CONTACT_EMAIL]" },
  { label: "[CONTACT_ADDRESS]", value: "[CONTACT_ADDRESS]" },
  { label: "[CLIENT_NAME]", value: "[CLIENT_NAME]" },
  { label: "[CLIENT_ADDRESS]", value: "[CLIENT_ADDRESS]" },
  { label: "[SIGNATORIES_NAME]", value: "[SIGNATORIES_NAME]" },
  { label: "[FIRM_NAME]", value: "[FIRM_NAME]" },
  { label: "[TRADE_NAME]", value: "[TRADE_NAME]" },
  { label: "[FIRM_ADDRESS]", value: "[FIRM_ADDRESS]" },
  { label: "[FIRM_CONTACT_NUMBER]", value: "[FIRM_CONTACT_NUMBER]" },
  { label: "[FIRM_EMAIL]", value: "[FIRM_EMAIL]" },
  { label: "[PREPARER]", value: "[PREPARER]" },
  { label: "[PREPARER_DEPARTMENT]", value: "[PREPARER_DEPARTMENT]" },
  { label: "[DATA_PROTECTION_OFFICER]", value: "[DATA_PROTECTION_OFFICER]" },
  {
    label: "[DATA_PROTECTION_OFFICER_EMAIL]",
    value: "[DATA_PROTECTION_OFFICER_EMAIL]",
  },
  { label: "[DATA_TRANSFER_COUNTRIES]", value: "[DATA_TRANSFER_COUNTRIES]" },
  { label: "[ONBOARDING_EMAIL]", value: "[ONBOARDING_EMAIL]" },
  {
    label: "[COMPLAINTS_FEEDBACK_EMAIL]",
    value: "[COMPLAINTS_FEEDBACK_EMAIL]",
  },
  {
    label: "[LIMITATION_OF_LIABILITY]",
    value: "[LIMITATION_OF_LIABILITY]",
  },
  {
    label: "[DISENGAGEMENT_SERVICES_TABLE]",
    value: "[DISENGAGEMENT_SERVICES_TABLE]",
  },
  {
    label: "[DISENGAGEMENT_SERVICES_LIST]",
    value: "[DISENGAGEMENT_SERVICES_LIST]",
  },
];

export const conditionalPlaceholderData = [
  { label: "INDIVIDUAL", value: "INDIVIDUAL" },
  { label: "ORGANISATION", value: "ORGANISATION" },
  { label: "LOE_ONLY", value: "LOE_ONLY" },
  { label: "PROPOSAL_ONLY", value: "PROPOSAL_ONLY" },
  { label: "PROPOSAL_AND_LOE", value: "PROPOSAL_AND_LOE" },
];

export function undoChange() {
  this.quill.history.undo();
}

export function redoChange() {
  this.quill.history.redo();
}

export function onSelect(toolbarNode) {
  const selectorDiv = toolbarNode.querySelector(".ql-custom");
  const childSpan = selectorDiv.querySelector(".ql-picker-label");
  const dataValue = childSpan.getAttribute("data-value");

  const cursorPosition = this.quill.getSelection()?.index || 0;

  const match = /^\[(.+?)\]\((.+?)\)$/.exec(dataValue);

  if (
    dataValue == "[PROPOSAL_LINK](Link)" ||
    dataValue == "[ONBOARDING_LINK](Link)"
  ) {
    const tag = match[1];
    const text = match[2];

    this.quill.insertEmbed(cursorPosition, "placeholder", `[${tag}]`);

    this.quill.insertText(cursorPosition + 1, `(${text})`, {
      color: "#1d4ed8",
    });

    this.quill.setSelection(cursorPosition + 1 + text.length + 2);
  } else {
    this.quill.insertEmbed(cursorPosition, "placeholder", dataValue);
    this.quill.setSelection(cursorPosition + 1);
  }

  this.quill.focus();
}

export function onConditionalSelect(toolbarNode) {
  const selectorDiv = toolbarNode.querySelector(
    ".ql-conditionalCustomDropDown"
  );
  const dataValue = selectorDiv
    ?.querySelector(".ql-picker-label")
    ?.getAttribute("data-value");

  if (!dataValue) return;

  const cursorIndex = this.quill.getSelection()?.index ?? 0;

  const startPlaceholder = `[${dataValue}-START]`;
  const endPlaceholder = `[${dataValue}-END]`;

  this.quill.insertEmbed(cursorIndex, "placeholder", startPlaceholder);

  this.quill.insertText(cursorIndex + 1, "  ");

  this.quill.insertEmbed(cursorIndex + 2, "placeholder", endPlaceholder);

  this.quill.setSelection(cursorIndex + 1);
  this.quill.focus();
}

export function onPageBreakButtonClick(toolbarNode) {
  const selection = this.quill.getSelection();
  const cursorPosition = selection ? selection.index : this.quill.getLength();

  this.quill.insertEmbed(cursorPosition, "pagebreak", "[PAGE_BREAK]");

  this.quill.setSelection(cursorPosition + 1);
  this.quill.focus();
}

export function onLineBreakButtonClick(toolbarNode) {
  const cursorPosition = this.quill.getSelection().index;
  const text = " [LINE_BREAK] ";

  this.quill.insertText(cursorPosition, text);
  this.quill.setSelection(cursorPosition + text.length);
  this.quill.focus();
}

export function onFontSizeChange(toolbarNode) {
  const selectedDiv = toolbarNode.querySelector(".ql-size");
  const childSpan = selectedDiv.querySelector(".ql-picker-label");
  const dataValue = childSpan.getAttribute("data-value");

  this.quill.format("size", dataValue);
}

export function changeFontSize(direction) {
  const currentFormat = this.quill.getFormat();
  const currentSize = currentFormat.size || "14px";

  const currentIndex = FONT_SIZE.indexOf(currentSize);

  if (currentIndex === -1) return;

  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < FONT_SIZE.length) {
    const newSize = FONT_SIZE[newIndex];
    this.quill.format("size", newSize);
  }
}

export function setAlignment(value) {
  const editor = this.quill;

  const selection = editor.getSelection();
  if (selection) {
    const [leaf] = editor.getLeaf(selection.index);
    if (leaf) {
      const block = leaf.parent?.domNode;

      if (block && block.style) {
        // Clear existing inline align styles
        block.style.textAlign = "";

        if (value === false) {
          block.style.textAlign = "left";
        } else if (value) {
          block.style.textAlign = value;
        }
      }
    }
  }
  editor.format("align", value);
}

const QuillToolbar = ({
  dropDownItems = [],
  toolbarId,
  conditionalDropDown = conditionalPlaceholderData,
  toolbarRef,
  defaultFontFamily,
}) => {
  const fontFamily = FONT_LIST.find((font) => font.value === defaultFontFamily);

  return (
    <div id={toolbarId} ref={toolbarRef}>
      {/* Clear formatting */}
      <span className="ql-formats">
        <button className="ql-clean" title="Clear all formatting">
          <EraserIcon />
        </button>
      </span>
      {/* Undo / Redo */}
      <span className="ql-formats">
        <button className="ql-undo" title="Undo">
          <UndoIcon />
        </button>
      </span>
      <span className="ql-formats">
        <button className="ql-redo" title="Redo">
          <RedoIcon />
        </button>
      </span>

      {/* Heading */}
      <span className="ql-formats">
        <select className="ql-header" defaultValue="4" title="Headings">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">Normal</option>
        </select>
      </span>

      {/* Font Family */}
      <span className="ql-formats">
        <select
          className="ql-font"
          title="Change Font Style"
          defaultValue={fontFamily?.camelCase}
        >
          {FONT_LIST.map((font) => (
            <option
              key={font.value}
              className={`ql-font-${font.value}`}
              value={font.camelCase}
            >
              {font.label}
            </option>
          ))}
        </select>
      </span>

      {/* Decrease Font Size */}
      <span className="ql-formats">
        <button className="ql-decreaseFont" title="Decrease Font Size">
          <MinusIcon />
        </button>
      </span>

      {/* Font Size */}
      <span className="ql-formats">
        <select
          className="ql-size"
          defaultValue={"14px"}
          title="Change Font Size"
        >
          {FONT_SIZE.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </span>

      {/* Increase Font Size */}
      <span className="ql-formats">
        <button className="ql-increaseFont" title="Increase Font Size">
          <PlusIcon />
        </button>
      </span>

      {/* Alignment */}
      <span className="ql-formats">
        <button className="ql-align" value="" title="Align Left" />
      </span>
      <span className="ql-formats">
        <button className="ql-align" value="center" title="Align Center" />
      </span>
      <span className="ql-formats">
        <button className="ql-align" value="right" title="Align Right" />
      </span>
      <span className="ql-formats">
        <button className="ql-align" value="justify" title="Justify" />
      </span>

      {/* Formatting */}
      <span className="ql-formats">
        <button className="ql-bold" title="Bold" />
      </span>
      <span className="ql-formats">
        <button className="ql-italic" title="Italic" />
      </span>
      <span className="ql-formats">
        <button className="ql-underline" title="Underline" />
      </span>
      <span className="ql-formats">
        <button className="ql-strike" title="Strike through" />
      </span>

      {/*Link */}
      <span className="ql-formats">
        <button className="ql-link" title="Insert Link" />
      </span>

      {/* Colors */}
      <span className="ql-formats" id="ql-text-color">
        <select className="ql-color" title="Text Color" />
      </span>
      <span className="ql-formats" id="ql-background-color">
        <select className="ql-background" title="Background Color" />
      </span>

      {/* Lists */}
      <span className="ql-formats">
        <button className="ql-list" value="ordered" title="Numbered List" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="bullet" title="Bullet List" />
      </span>
      <span className="ql-formats">
        <button className="ql-customPageBreak" title="Insert Page Break">
          <PageBreakIcon />
        </button>
        <button className="ql-customLineBreak" title="Insert Line Break">
          <LineBreakIcon />
        </button>
      </span>

      {/* Placeholders */}
      <span className="ql-formats">
        <select
          className="ql-custom valueSelector tooltip"
          title="Insert Placeholder"
        >
          <option value="">Placeholders</option>
          {dropDownItems?.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </span>

      {conditionalDropDown.length > 0 && (
        <span className="ql-formats">
          <select
            className="ql-conditionalCustomDropDown valueSelector tooltip"
            title="Insert Conditional Placeholder"
          >
            <option value="">Conditional Placeholders</option>
            {conditionalDropDown.map((item, index) => (
              <option key={`conditional${index}`} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </span>
      )}
    </div>
  );
};

export default QuillToolbar;
