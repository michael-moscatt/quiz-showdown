import { useRef, useEffect} from 'react';

// Code from https://github.com/donavon/use-event-listener
function useEventListener(eventName, handler, element = window){
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = event => savedHandler.current(event);

      element.addEventListener(eventName, eventListener);
      console.log("Added event listener");
      return () => {
        element.removeEventListener(eventName, eventListener);
        console.log("Removed event listener");
      };
    },
    [eventName, element] 
  );
};
export default useEventListener;