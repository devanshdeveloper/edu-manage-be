import React from 'react';

const EmailVerificationTemplate = ({ verificationLink, schoolName = 'EduManage' }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{schoolName}</h1>
                  <p className="text-gray-600">Email Verification</p>
                </div>
                
                <p>Hello,</p>
                
                <p>
                  Thank you for registering with {schoolName}. To complete your registration and
                  verify your email address, please click the button below:
                </p>

                <div className="pt-6 text-center">
                  <a
                    href={verificationLink}
                    className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md
                             hover:bg-blue-700 transition-colors duration-200"
                    style={{
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    Verify Email Address
                  </a>
                </div>

                <p className="mt-6 text-sm text-gray-600">
                  If you did not create an account with {schoolName}, please ignore this email.
                </p>

                <div className="pt-6 text-sm text-gray-500 text-center">
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <p className="break-all mt-2">{verificationLink}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationTemplate;