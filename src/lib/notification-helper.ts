export function showBlindDateNotification() {
  // simple browser notification style
  alert("🎉 Your Blind Date has been arranged! Check your bookings.");
}

export function playNotificationSound() {
  const audio = new Audio('/notification.mp3'); // put any small sound in public folder
  audio.play().catch(() => {});
}
