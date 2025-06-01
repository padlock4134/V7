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

  if (isIOS) {
    return (
      <button className="landing-cta-btn bg-seafoam text-maineBlue shadow px-6 py-3 rounded text-lg font-bold" disabled>
        Add to Home Screen (see instructions below)
      </button>
    );
  }

  return show ? (
    <button
      className="landing-cta-btn bg-lobsterRed text-weatheredWhite hover:bg-seafoam hover:text-maineBlue transition-colors shadow-lg px-6 py-3 rounded text-lg font-bold"
      onClick={handleInstallClick}
    >
      Install PorkChop App
    </button>
  ) : null;
};

export default InstallPWAButton;
