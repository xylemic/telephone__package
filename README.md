# Telephone System - JavaScript Implementation

## Description
This project is a JavaScript-based telephone system that allows users to add, remove, and dial phone numbers. It includes an observer pattern for notifications, event tracking, and phone number validation.

## Features
- **Phone Number Validation:** Ensures valid phone number formats.
- **Event History Tracking:** Logs actions such as dialing, adding, and removing numbers.
- **Observer Pattern:** Supports notifications for dialing events.
- **Custom Notifications:** Observers can define their own event-handling logic.
- **Asynchronous Notifications:** Uses `async/await` for handling multiple observers.

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/telephone-system.git
   ```
2. Open `index.html` in a browser or run the JavaScript file in a Node.js environment.

## Usage
### Example Code
```js
const telephone = new Telephone();

// Create observers
const observer1 = new PhoneNumberObserver('obs1', 'simple');
const observer2 = new PhoneNumberObserver('obs2', 'detailed');

// Add custom emergency notification
observer2.addCustomNotification('emergency', (number) => {
  console.log(`🚨 EMERGENCY CALL to ${number}`);
});

// Add observers
telephone.addObserver(observer1);
telephone.addObserver(observer2);

// Add phone numbers
telephone.addPhoneNumber('+1-234-567-8900');
telephone.addPhoneNumber('555-0123-4567');

// Dial a number
await telephone.dialPhoneNumber('+1-234-567-8900');

// View event history
console.log(telephone.getEventHistory({ type: 'dial' }));
```

## Classes & Methods

### `Telephone` Class
#### Methods:
- **`addPhoneNumber(phoneNumber)`**  
  Adds a valid phone number to the system.
- **`removePhoneNumber(phoneNumber)`**  
  Removes a stored phone number.
- **`dialPhoneNumber(phoneNumber)`**  
  Dials a stored phone number.
- **`addObserver(observer)`**  
  Registers an observer.
- **`removeObserver(observer)`**  
  Unregisters an observer.
- **`getEventHistory(filter)`**  
  Retrieves event logs based on filters.

---

### `PhoneNumberObserver` Class
#### Methods:
- **`notify(phoneNumber, eventType)`**  
  Receives notifications for dialing events.
- **`addCustomNotification(type, handler)`**  
  Adds a custom notification handler for specific event types.

---

### `PhoneEvent` Class
#### Properties:
- **`type`** - Type of event (e.g., add, remove, dial).  
- **`phoneNumber`** - The phone number associated with the event.  
- **`timestamp`** - The timestamp when the event occurred.  

## Error Handling
- **PhoneNumberError:** Custom error class that is thrown when an invalid phone number is detected.

## License
This project is licensed under the MIT License.

## Author
Daniel Johnson
