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

// export const httpPost = (url: string, body: any): Promise<Response> => {
export const httpPost = (url: string, body: any): Request => {
    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    return request;
}

