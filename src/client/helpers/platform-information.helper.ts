interface IPlatformInformation {
  isSafari: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  iOSRequestDesktopMode: boolean;
  isDesktop: boolean;
}

export const platformInformation = (): IPlatformInformation => {
  // using safari web browser
  const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);

  // using ios
  const isIOS =
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !Object.prototype.hasOwnProperty.call(window, 'MSStream');

  const isAndroid = /Android/.test(navigator.userAgent);

  // returns true when using ios and request desktop website is set to on (is on by default in iOS 13 and above)
  const iOSRequestDesktopMode =
    navigator.platform === 'MacIntel' &&
    navigator.maxTouchPoints > 1 &&
    !Object.prototype.hasOwnProperty.call(window, 'MSStream');

  // TODO: Find a better way to identify whether the user is on a desktop (technically android can run on chromebooks)
  const isDesktop = !isAndroid && !isIOS;

  return {
    isSafari,
    isIOS,
    isAndroid,
    iOSRequestDesktopMode,
    isDesktop,
  };
};
