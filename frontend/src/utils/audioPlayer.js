// /src/utils/notificationManager.js - Desktop-Benachrichtigungen für neue Nachrichten

// Status der Benachrichtigungsberechtigung
let permissionGranted = false;

// Funktion zur Anfrage der Benachrichtigungsberechtigung
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('Dieser Browser unterstützt keine Desktop-Benachrichtigungen.');
    return false;
  }

  if (Notification.permission === 'granted') {
    permissionGranted = true;
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Benachrichtigungen wurden vom Benutzer abgelehnt.');
    return false;
  }

  // Berechtigung anfragen
  try {
    const permission = await Notification.requestPermission();
    permissionGranted = permission === 'granted';
    return permissionGranted;
  } catch (error) {
    console.error('Fehler beim Anfordern der Benachrichtigungsberechtigung:', error);
    return false;
  }
};

// Funktion zum Anzeigen einer Desktop-Benachrichtigung
export const showDesktopNotification = (username, message, room) => {
  // Prüfe, ob das Fenster im Vordergrund ist
  if (document.hasFocus()) {
    // Fenster ist aktiv, keine Benachrichtigung nötig
    return;
  }

  if (!permissionGranted) {
    console.warn('Keine Berechtigung für Benachrichtigungen.');
    return;
  }

  // Erstelle und zeige die Benachrichtigung
  const notification = new Notification(`Neue Nachricht in ${room}`, {
    body: `${username}: ${message}`,
    icon: '/favicon.ico', // Optional: Verwende das Favicon als Icon
    tag: 'chat-message', // Gruppiert Benachrichtigungen
    requireInteraction: false // Benachrichtigung verschwindet automatisch
  });

  // Automatisches Schließen nach 5 Sekunden
  setTimeout(() => {
    notification.close();
  }, 5000);

  // Optional: Fokussiere das Fenster, wenn auf die Benachrichtigung geklickt wird
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

// Initialisiere die Benachrichtigungsberechtigung beim Laden des Moduls
export const initializeNotifications = async () => {
  await requestNotificationPermission();
};
