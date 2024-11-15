export const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.error('Error playing sound:', error);
  });
};