import React, { createContext, ReactNode, useCallback, useState } from 'react';

type LocalSettingsContext = {
  showStatsOverlay: boolean;
  micMuted: boolean;
  audioMuted: boolean;

  setShowStatsOverlay: (value: boolean) => unknown;
  setMicMuted: (value: boolean) => unknown;
  setAudioMuted: (value: boolean) => unknown;
};

export const LocalSettingsContext = createContext<LocalSettingsContext>(null as never);

type LocalSettingsProviderProps = {
  children?: ReactNode;
};

type LocalSettingsProviderState = {
  showStatsOverlay: LocalSettingsContext['showStatsOverlay'];
  micMuted: LocalSettingsContext['micMuted'];
  audioMuted: LocalSettingsContext['audioMuted'];
};

const LOCAL_STORAGE_SETTINGS_KEY = 'userSettings';

/**
 * Load the local settings from the browser local storage
 */
const loadSettingsFromLocalStorage = (): LocalSettingsProviderState => {
  const previousData = JSON.parse(localStorage[LOCAL_STORAGE_SETTINGS_KEY] || null) ?? {};

  return {
    showStatsOverlay: false,
    setMicMuted: false,
    setAudioMuted: false,

    ...previousData,
  };
};

/**
 * Maintain the local settings for the device by reading / writing into and out of local storage
 */
export const LocalSettingsProvider: React.FC<LocalSettingsProviderProps> = function LocalSettingsProvider({
  children,
}) {
  const [localSettings, setLocalSettings] = useState<LocalSettingsProviderState>(loadSettingsFromLocalStorage());

  const doSetLocalSettings = useCallback(
    (changedSettings: Partial<LocalSettingsProviderState>) => {
      // Combine the existing and new settings
      const newLocalSettings: LocalSettingsProviderState = {
        ...localSettings,
        ...changedSettings,
      };

      // Store the data to the local browser storage
      localStorage[LOCAL_STORAGE_SETTINGS_KEY] = JSON.stringify(newLocalSettings);

      // Update the state data
      setLocalSettings(newLocalSettings);
    },
    [localSettings]
  );

  return (
    <LocalSettingsContext.Provider
      value={{
        showStatsOverlay: localSettings.showStatsOverlay,
        micMuted: localSettings.micMuted,
        audioMuted: localSettings.audioMuted,

        setShowStatsOverlay: (showStatsOverlay: LocalSettingsContext['showStatsOverlay']) =>
          doSetLocalSettings({ showStatsOverlay }),
        setMicMuted: (micMuted: LocalSettingsContext['micMuted']) => doSetLocalSettings({ micMuted }),
        setAudioMuted: (audioMuted: LocalSettingsContext['audioMuted']) => doSetLocalSettings({ audioMuted }),
      }}
    >
      {children}
    </LocalSettingsContext.Provider>
  );
};
