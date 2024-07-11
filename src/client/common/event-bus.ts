export const EventBus = {
  on(
    event: string,
    callback: EventListenerOrEventListenerObject,
    options?: any,
  ) {
    document.addEventListener(event, callback, options);
  },
  emit(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  off(event: string, callback: EventListenerOrEventListenerObject) {
    document.removeEventListener(event, callback);
  },
};
