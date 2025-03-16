require("@babel/register");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const convertTailwindToInline = require('./convertTailwindToInline');

const renderTemplate = (Component, props = {}) => {
  try {
    // First render the React component to HTML
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Component, props)
    );

    // Convert Tailwind classes to inline styles
    const inlineStylesHtml = convertTailwindToInline(html);

    return `<!DOCTYPE html>${inlineStylesHtml}`;
  } catch (error) {
    throw new Error(`Failed to render email template: ${error.message}`);
  }
};

module.exports = renderTemplate;
