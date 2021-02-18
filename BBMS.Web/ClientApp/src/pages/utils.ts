import axios, { AxiosResponse } from 'axios';
import * as React from "react";

// validateEmail(email) {
//     const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
//     return regex.test(email) ? this.setState({ email: email, validEmail: true }) : this.setState({ validEmail: false })
//   }

//   validatePhone(phoneNumber) {
//     const regex = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/
//     return regex.test(phoneNumber) ? this.setState({ phone: phoneNumber, validPhone: true }) : this.setState({ validPhone: false })
//   }

/**
 * Validate Email address
 */
export const isValidEmail = (value: string): boolean => {
  return !!(value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value));
}

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (value: string): boolean => {
  // TODO: Support country code.
  return !!(value && /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i.test(value));
}

// export const httpGet = (url: string): Promise<Response> => fetch(url);
export const httpGet = (url: string): Promise<AxiosResponse<any>> => axios.get(url);

export const httpPost = (url: string, body: any): Promise<AxiosResponse<any>> => {
  return axios.post(url, body);
}
// export const httpPost = (url: string, body: any): Promise<Response> => {
//     const request = new Request(url, {
//         method: 'POST',
//         body: JSON.stringify(body),
//         headers: new Headers({
//             'Content-Type': 'application/json'
//         })
//     });
//     return fetch(request);
// }

export const range = (start = 0, end: number) => Array.from({ length: (end - start) }, (v, k) => k + start);

// Hook
export function useEventListener(eventName: string, handler: (e: any) => void, element = window) {
  // Credits: https://usehooks.com/useEventListener/
  // Create a ref that stores handler
  const savedHandler = React.useRef<(e: any) => void>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(
    () => {
      // Make sure element supports addEventListener
      // On 
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event: any) => savedHandler && savedHandler.current && savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};