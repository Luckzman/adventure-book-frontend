/**
 * Notification utilities
 * Handles showing temporary notifications to users
 */

/**
 * Shows a "Coming Soon" notification for the save feature
 */
export const showSaveNotification = () => {
    const notification = document.createElement('div');
    notification.className =
        'fixed top-4 right-4 bg-amber-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in';
    notification.innerHTML = `
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <p class="font-semibold">Save Feature Coming Soon</p>
            <p class="text-sm text-amber-100">We're working on adding the ability to save your progress!</p>
        </div>
    `;
    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.classList.add('animate-slide-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
};
