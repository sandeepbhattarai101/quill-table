"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

import QuillToolbar, {
  changeFontSize,
  onConditionalSelect,
  onFontSizeChange,
  onLineBreakButtonClick,
  onPageBreakButtonClick,
  onSelect,
  placeholderDropDownData,
  redoChange,
  selectFontSize,
  setAlignment,
  undoChange,
} from "./QuillToolbar";
import { customPlaceholder, fontConfiguration, fontfamily } from "../constant";
import { getStylesFromFontConfig } from "../(utils)/getStylesFromFontConfig";
import { registerPlaceholderBlot } from "./placeholderblot";

const ReactQuill = dynamic(
  async () => {
    if (typeof window === "undefined") {
      return () => <div>Loading...</div>;
    }

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
      "56px",
      "72px",
    ];

    Font.whitelist = [
      "Rubik",
      "OpenSans",
      "AdventPro",
      "Anybody",
      "Montserrat",
      "CormorantGaramond",
      "AlbertSans",
      "JosefinSlab",
      "AzeretMono",
      "CrimsonPro",
      "Georama",
      "Inter",
      "Mali",
      "Nunito",
    ];

    Quill.register(Size, true);
    Quill.register(Font, true);

    // Try registering table-better this way
    Quill.register({ "modules/table-better": QuillTableBetter }, true);

    const { default: RQ } = await import("react-quill-new");
    RQ.Quill = Quill;

    return RQ;
  },
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
  }
);

const CustomQuillEditor = ({
  dropDownItems = [],
  value,
  onChange,
  editorId = 2,
  emailTemplateSubject,
  conditionalDropDown,
  placeholder = "",
  readOnly = false,
  editorHeight = 250,
}) => {
  const toolbarId = `unique-quill-toolbar-${editorId}`;
  const toolbarRef = useRef(null);
  const quillEditorRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const tableBindingsRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      registerPlaceholderBlot();

      if (typeof window !== "undefined") {
        const module = await import("quill-table-better");
        const QuillTableBetter = module.default;
        tableBindingsRef.current = QuillTableBetter.keyboardBindings;
      }

      setIsReady(true);
    };

    setup();
  }, []);

  const combinedPlaceholders = useMemo(() => {
    const customPlaceholders =
      customPlaceholder?.map(({ key }) => ({
        label: `[${key?.toUpperCase()}]`,
        value: `[${key?.toUpperCase()}]`,
      })) || [];

    const placeholders = dropDownItems?.length
      ? dropDownItems
      : placeholderDropDownData;

    return [...placeholders, ...customPlaceholders];
  }, [dropDownItems]);

  useEffect(() => {
    if (!isReady || !quillEditorRef.current) return;

    const interval = setInterval(() => {
      if (quillEditorRef.current) {
        const quill = quillEditorRef.current.getEditor();

        if (fontfamily && quill) {
          quill.root.style.fontFamily = fontfamily;
          quill.blur();
        }

        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isReady]);

  const fontStyles = useMemo(() => {
    if (fontConfiguration) {
      return getStylesFromFontConfig(fontConfiguration);
    }
    return null;
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${toolbarId}`,
        handlers: {
          header: function (value) {
            const range = this.quill.getSelection();
            console.log("range", range);
            if (!range) return;

            const [leaf] = this.quill.getLeaf(range.index);
            const domNode = leaf?.domNode;
            let isNonEditable = false;

            const checkNode = (node) => {
              if (!(node instanceof HTMLElement)) return false;
              const selfOrAncestor = node.closest('[contenteditable="false"]');
              const hasNonEditableDescendant = node.querySelector?.(
                '[contenteditable="false"]'
              );
              return !!(selfOrAncestor || hasNonEditableDescendant);
            };

            if (checkNode(domNode)) {
              isNonEditable = true;
            }

            const parent = leaf?.parent;
            const parentNode = parent?.domNode;

            if (!isNonEditable && parentNode instanceof HTMLElement) {
              if (checkNode(parentNode)) {
                isNonEditable = true;
              }

              if (parent?.children) {
                parent.children.forEach((child) => {
                  if (child && child.domNode && checkNode(child.domNode)) {
                    isNonEditable = true;
                  }
                });
              }
            }

            if (isNonEditable) {
              console.warn(
                "Skipped formatting: contains non-editable content."
              );
              return;
            }

            const headerValue =
              value === "" || value === false || value === "4"
                ? false
                : parseInt(value);

            this.quill.format("header", headerValue);

            if (headerValue === 1) {
              console.log("herre ayo code ");
              this.quill.format("size", fontStyles?.H1?.fontSize || "18px");
            } else if (headerValue === 2) {
              console.log("heading v2");
              this.quill.format("size", fontStyles?.H2?.fontSize || "16px");
            } else if (headerValue === 3) {
              console.log("Heading 3");
              this.quill.format("size", fontStyles?.H3?.fontSize || "14px");
            } else {
              console.log("Normal?");
              this.quill.format("size", "14px");
            }
          },
          custom: function () {
            onSelect.call(this, toolbarRef.current);
          },
          conditionalCustomDropDown: function () {
            onConditionalSelect.call(this, toolbarRef.current);
          },
          customPageBreak: function () {
            onPageBreakButtonClick.call(this, toolbarRef.current);
          },
          customLineBreak: function () {
            onLineBreakButtonClick.call(this, toolbarRef.current);
          },
          undo: function () {
            undoChange.call(this);
          },
          redo: function () {
            redoChange.call(this);
          },
          increaseFont: function () {
            changeFontSize.call(this, 1);
          },
          decreaseFont: function () {
            changeFontSize.call(this, -1);
          },
          align: function (value) {
            setAlignment.call(this, value);
          },
          tableBetter: function () {
            const table = this.quill.getModule("table-better");
            if (table) {
              table.insertTable(3, 3);
            }
          },
        },
      },

      "table-better": {
        language: "en_US",
        menus: [
          "column",
          "row",
          "merge",
          "table",
          "cell",
          "wrap",
          "copy",
          "delete",
        ],
        toolbarTable: true,
      },

      keyboard: {
        bindings: tableBindingsRef.current || {},
      },

      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    [toolbarId, fontStyles]
  );

  if (!isReady) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded" />;
  }

  return (
    <div className="w-full">
      <QuillToolbar
        dropDownItems={combinedPlaceholders}
        conditionalDropDown={conditionalDropDown}
        toolbarId={toolbarId}
        toolbarRef={toolbarRef}
        defaultFontFamily="Open Sans"
      />

      <ReactQuill
        forwardedRef={quillEditorRef}
        id={`unique-quill-description-${editorId}`}
        style={{
          height: editorHeight,
          resize: "vertical",
          overflow: "auto",
        }}
        readOnly={readOnly}
        modules={modules}
        theme="snow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomQuillEditor;
