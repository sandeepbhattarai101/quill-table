export const getStylesFromFontConfig = (fontConfiguration) => {
  const textElements = ["H1", "H2", "H3"];

  const fontStyles = textElements.reduce((acc, key) => {
    acc[key] = fontConfiguration?.find(
      (fontConfig) => fontConfig?.textElement === key
    );
    return acc;
  }, {});

  return fontStyles;
};
