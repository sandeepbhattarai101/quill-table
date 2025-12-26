"use client";

export function registerPlaceholderBlot() {
  if (typeof window === "undefined") return;

  const { Quill } = require("react-quill-new");
  const Embed = Quill.import("blots/embed");

  class PlaceholderBlot extends Embed {
    static blotName = "placeholder";
    static tagName = "span";
    static className = "mention-placeholder";

    static create(value) {
      const node = super.create();
      node.setAttribute("contenteditable", "false");

      const cleanValue = value.replace(/\uFEFF/g, "");

      node.innerText = cleanValue;

      if (value === "[BILLABLE_RATES_TABLE]") {
        // Store the value on the node for reference
        node.dataset.rawValue = "[BILLABLE_RATES_TABLE]";
      }

      return node;
    }

    static value(node) {
      return node.innerText;
    }

    format(name, value) {
      const rawValue = this.domNode.dataset?.rawValue;
      if (rawValue === "[BILLABLE_RATES_TABLE]") {
        return;
      }

      super.format(name, value);
    }
  }

  Quill.register(PlaceholderBlot);
}
