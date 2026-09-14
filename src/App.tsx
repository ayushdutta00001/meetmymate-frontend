import React from 'react';
import MainLauncher from './MainLauncher';
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      {/* ✅ THIS IS REQUIRED */}
      <Toaster position="top-right" />

      <MainLauncher />
    </>
  );
}