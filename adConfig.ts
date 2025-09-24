// This file simulates the configuration for AdMob.
// In a real app, these would be your actual Ad Unit IDs from the AdMob dashboard.

export const adConfig = {
    // IMPORTANT: Replace with your AdMob Publisher ID
    adClient: 'ca-pub-XXXXXXXXXXXXXXXX',

    // --- Mock Ad Unit IDs ---
    appOpen: 'ca-app-pub-3940256099942544/3419835294',      // Test ID
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test ID
    rewarded: 'ca-app-pub-3940256099942544/5224354917',     // Test ID
    native: 'ca-app-pub-3940256099942544/2247696110',       // Test ID

    // --- Ad Behavior Settings ---
    interstitialClickFrequency: 4, // Show an interstitial ad every 4 clicks.
    appOpenCooldown: 30 * 60 * 1000, // Don't show app open ad if one was shown in the last 30 minutes
};