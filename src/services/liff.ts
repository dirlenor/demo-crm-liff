import liff from '@line/liff';

const LIFF_ID = import.meta.env.VITE_LIFF_ID;

if (!LIFF_ID) {
  throw new Error('Missing LIFF ID. Please check your .env file.');
}

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

let liffInitialized = false;

export const initLiff = async (): Promise<void> => {
  if (liffInitialized) {
    return;
  }

  try {
    console.log('Initializing LIFF with ID:', LIFF_ID);
    await liff.init({ liffId: LIFF_ID });
    
    if (!liff.isInClient()) {
      console.warn('LIFF is not running in LINE app. Some features may not work.');
    }
    
    if (!liff.isLoggedIn()) {
      console.warn('User is not logged in to LINE.');
    }
    
    liffInitialized = true;
    console.log('LIFF initialized successfully');
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    throw error;
  }
};

export const getLiffProfile = async (): Promise<LiffProfile | null> => {
  if (!liffInitialized) {
    await initLiff();
  }

  console.log('Checking login status...');
  console.log('isLoggedIn:', liff.isLoggedIn());
  console.log('isInClient:', liff.isInClient());
  console.log('OS:', liff.getOS());
  console.log('Language:', liff.getLanguage());
  console.log('Version:', liff.getVersion());

  if (!liff.isLoggedIn()) {
    console.error('User is not logged in to LINE');
    return null;
  }

  try {
    const profile = await liff.getProfile();
    console.log('Profile retrieved:', { userId: profile.userId, displayName: profile.displayName });
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error('Failed to get LIFF profile:', error);
    return null;
  }
};

export const getLiffUserId = (): string | null => {
  if (!liffInitialized || !liff.isLoggedIn()) {
    return null;
  }
  return liff.getDecodedIDToken()?.sub || null;
};

