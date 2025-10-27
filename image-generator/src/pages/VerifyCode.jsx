// VerifyCode.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthStore } from '../AuthStore/AuthStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";


const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { verifyUser, verificationInProgress, authUser } = AuthStore();
 const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length === 6) {
      try {
        await verifyUser({
        userId: authUser?.userId, 
          code: verificationCode,
        });
        navigate("/")
      } catch (error) {
        // Error handling is done in the store
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.1,
      boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.5)",
      transition: { duration: 0.2 }
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-slate-400">
              We've sent a verification code to your email
            </p>
          </motion.div>

          {/* Verification Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Code Inputs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between space-x-2"
            >
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  whileFocus="focus"
                  variants={inputVariants}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center bg-slate-700 border border-slate-600 rounded-xl text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              ))}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={verificationInProgress || code.some(digit => !digit)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verificationInProgress ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </motion.button>
          </motion.form>

          {/* Resend Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-400">
              Didn't receive the code?{' '}
              <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Resend code
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyCode;