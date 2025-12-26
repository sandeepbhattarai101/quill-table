"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";

// import { Skeleton } from "../../common/skeleton";
// import { registerFontSettings } from "./fontsSettings";
// import { registerPlaceholderBlot } from "./placeholderBolt";
// import QuillToolbar, {
//   changeFontSize,
//   onConditionalSelect,
//   onFontSizeChange,
//   onLineBreakButtonClick,
//   onPageBreakButtonClick,
//   onSelect,
//   placeholderDropDownData,
//   redoChange,
//   setAlignment,
//   undoChange,
// } from "./QuillToolBar";

import QuillToolbar, { placeholderDropDownData } from "./QuillToolbar";
import { customPlaceholder, fontConfiguration, fontfamily } from "../constant";
import { getStylesFromFontConfig } from "../(utils)/getStylesFromFontConfig";
// import { useConfigStore } from "@/app/(store)/configStore";
// import { registerPageBreakBlot } from "./pageBreakBolt";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const ReactQuillWrapper = ({ forwardedRef, ...props }) => (
      <RQ ref={forwardedRef} {...props} />
    );
    ReactQuillWrapper.displayName = "ReactQuillWrapper";
    return ReactQuillWrapper;
  },
  {
    ssr: false,
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

  //   const getConfig = useConfigStore((state) => state.getConfig);
  //   const config = useConfigStore((state) => state.config);

  //   useEffect(() => {
  //     registerPlaceholderBlot();
  //     registerFontSettings();
  //     registerPageBreakBlot();
  //     getConfig(); // Automatically fetch if not already loaded
  //   }, []);

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
  }, [dropDownItems, customPlaceholder]);

  useEffect(() => {
    // if (!config) return;

    // inconsistent styles are applied as it ran before the quill component is mounted
    //temp fix: wait for the reeact quill  to mount
    const interval = setInterval(() => {
      if (quillEditorRef.current) {
        const quill = quillEditorRef.current.getEditor();

        const fontFamily = fontfamily;
        if (fontFamily) {
          quill.root.style.fontFamily = fontFamily;
          quill.format("fontFamily", fontFamily);

          quill.blur();
        }

        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const fontStyles = useMemo(() => {
    if (fontConfiguration) {
      return getStylesFromFontConfig(fontConfiguration);
    }
    return null;
  }, [fontConfiguration]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${toolbarId}`,

        handlers: {
          header: function (value) {
            const range = this.quill.getSelection();
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

            // Check leaf's parent (e.g. Inline) and its children
            const parent = leaf?.parent;
            const parentNode = parent?.domNode;

            if (!isNonEditable && parentNode instanceof HTMLElement) {
              // Check parent itself
              if (checkNode(parentNode)) {
                isNonEditable = true;
              }

              // Check all children of the parent (siblings of this leaf)
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

            // Apply header formatting
            this.quill.format("size", null);
            if (value === "1") {
              this.quill.format("size", fontStyles?.H1?.fontSize);
            } else if (value === "2") {
              this.quill.format("size", fontStyles?.H2?.fontSize);
            } else if (value === "3") {
              this.quill.format("size", fontStyles?.H3?.fontSize);
            } else {
              this.quill.format("size", "14px");
            }

            this.quill.format("header", value);
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
          size: function (value) {
            onFontSizeChange.call(this, toolbarRef.current);
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
        },
        history: {
          delay: 500,
          maxStack: 100,
          userOnly: true,
        },
      },
    }),
    [toolbarId, fontStyles]
  );

  return (
    <div className="w-full">
      <style>
        {`
        #unique-quill-description-${editorId} > div > div.ql-editor > h1 {
            font-size: ${fontStyles.H1?.fontSize} !important;
            color: ${fontStyles.H1?.fontColour} !important;
        }
        #unique-quill-description-${editorId} > div > div.ql-editor > h2 {
            font-size: ${fontStyles.H2?.fontSize}  !important;
            color: ${fontStyles.H2.fontColour} !important;
        }
       #unique-quill-description-${editorId} > div > div.ql-editor > h3 {
            font-size:  ${fontStyles.H3.fontSize}  !important;
            color: ${fontStyles.H3.fontColour} !important;
        }
        #unique-quill-description-${editorId} > div > div.ql-editor > p {
            font-size:  14px !important;
            color: #151515 !important;
        }
      `}
      </style>

      <QuillToolbar
        dropDownItems={combinedPlaceholders}
        conditionalDropDown={conditionalDropDown}
        toolbarId={toolbarId}
        toolbarRef={toolbarRef}
        defaultFontFamily={"Open Sans" ?? null}
      />
      {ReactQuill ? (
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
          onChange={(value) => {
            onChange(value);
          }}
        />
      ) : (
        <div>
          <div>
            {new Array(4).fill(null).map((_, index) => (
              //   <Skeleton key={index} className="h-5 w-40 rounded-md" />
              <p>load</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomQuillEditor;
