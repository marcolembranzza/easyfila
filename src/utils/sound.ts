export const playNotificationSound = () => {
  console.log('Playing notification sound...');
  const audio = new Audio('/notification.mp3');
  audio.volume = 1.0; // Increase volume to maximum
  audio.play().catch(error => {
    console.error('Error playing sound:', error);
  });
};