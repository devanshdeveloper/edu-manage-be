import React from 'react';
import BaseTemplate from './BaseTemplate';

const WelcomeTemplate = ({ name }) => {
  return (
    <BaseTemplate title="Welcome to EduManage">
      <div>
        <h2>Welcome, {name}!</h2>
        <p>Thank you for joining EduManage. We're excited to have you on board!</p>
        <p>
          EduManage is your all-in-one solution for educational institution management.
          Get started by exploring our features:
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
          <li>Student Management</li>
          <li>Course Administration</li>
          <li>Attendance Tracking</li>
          <li>Grade Management</li>
        </ul>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <a
            href="#"
            style={{
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block'
            }}
          >
            Get Started
          </a>
        </div>
        <p style={{ marginTop: '30px' }}>
          If you have any questions, feel free to reach out to our support team.
        </p>
        <p>Best regards,<br />The EduManage Team</p>
      </div>
    </BaseTemplate>
  );
};

export default WelcomeTemplate;