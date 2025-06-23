import React, { useEffect, useState } from "react";

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  // On iOS, show instructions instead (no prompt)
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  const handleClick = () => {
    if (isIOS) {
      window.alert('To install PorkChop on iOS, tap the Share icon in Safari, then choose "Add to Home Screen".');
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  return (
    <button
      className="landing-cta-btn bg-lobsterRed text-weatheredWhite hover:bg-seafoam hover:text-maineBlue transition-colors shadow-lg px-6 py-3 rounded text-lg font-bold"
      onClick={handleClick}
      type="button"
    >
      Install PorkChop App
    </button>
  );
};

export default InstallPWAButton;
