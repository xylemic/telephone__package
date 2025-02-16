// custom error for phone number validation
class PhoneNumberError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PhoneNumberError';
  }
}

// event class for history tracking
class PhoneEvent {
  constructor(type, phoneNumber, timestamp = new Date()) {
    this.type = type;
    this.phoneNumber = phoneNumber;
    this.timestamp = timestamp;
  }
}

// observer class with enhanced notification capabilities
class PhoneNumberObserver {
  constructor(id, ...types) {
    this.id = id;
    this.types = new Set(types);
    this.customHandlers = new Map();
  }

  // add custom notification handler
  addCustomNotification(type, handler) {
    this.customHandlers.set(type, handler);
    this.types.add(type);
  }

  // enhanced notify method with async support
  async notify(phoneNumber, eventType = 'dial') {
    const notifications = [];

    // handle built-in notification types
    if (this.types.has('simple')) {
      notifications.push(Promise.resolve(console.log(phoneNumber)));
    }
    if (this.types.has('detailed')) {
      notifications.push(Promise.resolve(console.log(`Now Dialing ${phoneNumber}...`)));
    }

    // handle custom notifications
    if (this.customHandlers.has(eventType)) {
      const handler = this.customHandlers.get(eventType);
      notifications.push(Promise.resolve(handler(phoneNumber)));
    }

    // wait for all notifications to complete
    await Promise.all(notifications);
  }
}

// enhanced Telephone class
class Telephone {
  constructor() {
    this.phoneNumbers = new Set();
    this.observers = new Set();
    this.eventHistory = [];
    this.maxHistorySize = 100; // limit history size
  }

  // validate phone number format
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new PhoneNumberError('Invalid phone number format');
    }
    return phoneNumber.replace(/[\s-]/g, ''); // normalize phone number
  }

  // add event to history
  addToHistory(event) {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift(); // remove oldest event if limit reached
    }
  }

  // get event history with optional filtering
  getEventHistory(filter = {}) {
    let filteredHistory = [...this.eventHistory];

    if (filter.type) {
      filteredHistory = filteredHistory.filter(event => event.type === filter.type);
    }
    if (filter.startDate) {
      filteredHistory = filteredHistory.filter(event => event.timestamp >= filter.startDate);
    }
    if (filter.endDate) {
      filteredHistory = filteredHistory.filter(event => event.timestamp <= filter.endDate);
    }

    return filteredHistory;
  }

  // enhanced method to add a phone number
  addPhoneNumber(phoneNumber) {
    try {
      const normalizedNumber = this.validatePhoneNumber(phoneNumber);
      this.phoneNumbers.add(normalizedNumber);
      this.addToHistory(new PhoneEvent('add', normalizedNumber));
      console.log(`Phone number ${normalizedNumber} added.`);
      return normalizedNumber;
    } catch (error) {
      console.error(`Failed to add phone number: ${error.message}`);
      throw error;
    }
  }

  // enhanced method to remove a phone number
  removePhoneNumber(phoneNumber) {
    try {
      const normalizedNumber = this.validatePhoneNumber(phoneNumber);
      if (this.phoneNumbers.delete(normalizedNumber)) {
        this.addToHistory(new PhoneEvent('remove', normalizedNumber));
        console.log(`Phone number ${normalizedNumber} removed.`);
        return true;
      }
      console.log(`Phone number ${normalizedNumber} was not found.`);
      return false;
    } catch (error) {
      console.error(`Failed to remove phone number: ${error.message}`);
      throw error;
    }
  }

  // method to dial a phone number with async support
  async dialPhoneNumber(phoneNumber) {
    try {
      const normalizedNumber = this.validatePhoneNumber(phoneNumber);
      if (this.phoneNumbers.has(normalizedNumber)) {
        console.log(`Dialing ${normalizedNumber}...`);
        this.addToHistory(new PhoneEvent('dial', normalizedNumber));
        await this.notifyObservers(normalizedNumber);
        return true;
      }
      console.log(`Phone number ${normalizedNumber} not found. Please add the number first.`);
      return false;
    } catch (error) {
      console.error(`Failed to dial number: ${error.message}`);
      throw error;
    }
  }

  // observer management methods
  addObserver(observer) {
    this.observers.add(observer);
    this.addToHistory(new PhoneEvent('observerAdded', observer.id));
    console.log(`Observer ${observer.id} added.`);
  }

  removeObserver(observer) {
    if (this.observers.delete(observer)) {
      this.addToHistory(new PhoneEvent('observerRemoved', observer.id));
      console.log(`Observer ${observer.id} removed.`);
      return true;
    }
    console.log(`Observer ${observer.id} not found.`);
    return false;
  }

  // notify observers method with async support
  async notifyObservers(phoneNumber) {
    const notifications = Array.from(this.observers).map(observer =>
      observer.notify(phoneNumber).catch(error =>
        console.error(`Failed to notify observer ${observer.id}: ${error.message}`)
      )
    );
    await Promise.all(notifications);
  }
}

// example usage:
const demonstrateEnhancedFeatures = async () => {
  const telephone = new Telephone();

  // create observers with custom notifications
  const observer1 = new PhoneNumberObserver('obs1', 'simple');
  const observer2 = new PhoneNumberObserver('obs2', 'detailed');

  // add custom notification type
  observer2.addCustomNotification('emergency', (number) => {
    console.log(`🚨 EMERGENCY CALL to ${number}`);
  });

  // add observers
  telephone.addObserver(observer1);
  telephone.addObserver(observer2);

  try {
    // add phone numbers with validation
    telephone.addPhoneNumber('+1-234-567-8900');
    telephone.addPhoneNumber('555-0123-4567');

    // invalid number will throw error
    try {
      telephone.addPhoneNumber('invalid');
    } catch (error) {
      console.log('Caught invalid number:', error.message);
    }

    // dial numbers
    await telephone.dialPhoneNumber('+1-234-567-8900');

    // check history
    console.log('\nEvent History:');
    console.log(telephone.getEventHistory({ type: 'dial' }));

    // remove number and observer
    telephone.removePhoneNumber('+1-234-567-8900');
    telephone.removeObserver(observer1);

  } catch (error) {
    console.error('Error in demonstration:', error);
  }
};

// run the demonstration
demonstrateEnhancedFeatures();


