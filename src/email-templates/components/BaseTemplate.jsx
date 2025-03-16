import React from 'react';

const BaseTemplate = ({ children, title }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #007bff;
              color: #ffffff;
            }
            .content {
              padding: 20px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666666;
              font-size: 12px;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>{title}</h1>
          </div>
          <div className="content">
            {children}
          </div>
          <div className="footer">
            <p>© {new Date().getFullYear()} EduManage. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default BaseTemplate;