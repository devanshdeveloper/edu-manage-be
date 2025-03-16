const React = require('react');

const BaseEmailTemplate = ({ title, content, footer }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body className="bg-gray-100 m-0 p-0 font-sans">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-2xl font-bold text-gray-800 mb-6">{title}</div>
            <div className="text-gray-600 leading-relaxed mb-6">{content}</div>
            {footer && (
              <div className="text-sm text-gray-500 border-t pt-4">{footer}</div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
};

module.exports = BaseEmailTemplate;