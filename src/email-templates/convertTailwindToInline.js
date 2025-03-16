const {twi} = require('tw-to-css');

const convertTailwindToInline = (html) => {
  try {
    // Extract all elements with class attributes
    const regex = /<([a-zA-Z0-9-]+)[^>]*class="([^"]+)"[^>]*>/g;
    let match;
    let processedHtml = html;

    while ((match = regex.exec(html)) !== null) {
      const [fullMatch, tag, classes] = match;
      const styles = twi(classes);
      
      // Convert styles object to inline style string
      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');

      // Replace class with style attribute or append to existing style
      const hasStyle = fullMatch.includes('style="');
      let newElement;

      if (hasStyle) {
        newElement = fullMatch.replace(
          /style="([^"]*)"/,
          `style="$1;${styleString}"`
        );
      } else {
        newElement = fullMatch.replace(
          `class="${classes}"`,
          `style="${styleString}"`
        );
      }

      processedHtml = processedHtml.replace(fullMatch, newElement);
    }

    return processedHtml;
  } catch (error) {
    throw new Error(`Failed to convert Tailwind classes: ${error.message}`);
  }
};

module.exports = convertTailwindToInline;