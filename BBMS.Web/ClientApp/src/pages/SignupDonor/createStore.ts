import { Action, Reducer } from 'redux';
import { ApplicationState, AppThunkAction, Utils } from '..';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface User {
    firstName: string;
    lastName: string;
    phone: string;
    age: number;
    email: string;
    state: string;
    country: string;
    address: string;
    address1: string;
    address2: string;
    subscribenewsletter: boolean;
}

export interface Error {
    firstName: string;
    phone: string;
    email: string;
    fromServer: string;
}

export interface SignupDonorState {
    user: User;
    errors: Error;
    validForm: boolean;
    submitted: boolean;
    done: boolean;
}

const initialState: SignupDonorState = {
    user: {
        firstName: '',
        lastName: '',
        phone: '',
        age: 28,
        email: '',
        state: '',
        country: '',
        address: 'Home',
        address1: '',
        address2: '',
        // interests: [],
        subscribenewsletter: false
    },
    errors: {
        firstName: '',
        phone: '',
        email: '',
        fromServer: ''
    },
    validForm: false,
    submitted: false,
    done: false
}

enum SdTypes {
    ON_ERROR_FROM_SERVER = 'ON_ERROR_FROM_SERVER',
    INITIALIZE = 'INITIALIZE',
    BTN_SUBMIT = 'SUBMIT_BOTTON_CLICKED',
    DONOR_CREATED = 'DONOR_CREATED',
    VALIDATE_FORM = 'VALIDATE_FORM',
    ON_INPUT_CHANGE = 'ON_INPUT_CHANGE'
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface OnErrorFromServerAction { 
    type: typeof SdTypes.ON_ERROR_FROM_SERVER;
    status: number;
    statusText: string;
    body: string;
}
export interface InitializeAction { type: typeof SdTypes.INITIALIZE }
export interface ValidateFormAction { type: typeof SdTypes.VALIDATE_FORM }
export interface BtnSubmitAction { type: typeof SdTypes.BTN_SUBMIT }
export interface DonorCreatedAction { type: typeof SdTypes.DONOR_CREATED }
export interface OnInputChangeAction {
    type: typeof SdTypes.ON_INPUT_CHANGE;
    event: React.ChangeEvent<HTMLInputElement>
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = InitializeAction | DonorCreatedAction | OnInputChangeAction | 
BtnSubmitAction | ValidateFormAction | OnErrorFromServerAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

const create = (dispatch: (action: KnownAction) => void, state: ApplicationState) => {
    if (state && state.signupDonor && state.signupDonor.validForm) {
        fetch(Utils.httpPost("api/blooddonor/signup", state.signupDonor.user))
            .then(response => {
                if (response.ok) {
                    dispatch({ type: SdTypes.DONOR_CREATED });
                } else {
                    response.json()
                    .then(issue => {
                        dispatch({ 
                            type: SdTypes.ON_ERROR_FROM_SERVER, 
                            statusText: response.statusText, 
                            status: response.status, 
                            body: issue.message 
                        });
                    })
                    .catch(e => {
                        dispatch({ 
                            type: SdTypes.ON_ERROR_FROM_SERVER, 
                            statusText: response.statusText, 
                            status: response.status, 
                            body: "" + e 
                        });
                    })
                }
            })
            .catch(error => {
                console.log("Error caught:\n", error);
            });
    }
}

export const actionCreators = {
    initializeState: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: SdTypes.INITIALIZE });
    },
    onSubmit: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: SdTypes.VALIDATE_FORM }); 
        create(dispatch, getState());
    },
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>): AppThunkAction<KnownAction> => (dispatch, getState)  => {
        dispatch({ type: SdTypes.ON_INPUT_CHANGE, event: event })
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

function validationErrorMessage(state: SignupDonorState, name: string, value: string): void {
    
    switch (name) {
        case 'firstName':
            state.errors.firstName = value.length < 1 ? 'Enter First Name' : '';
            break;
        case 'email':
            state.errors.email = Utils.isValidEmail(value) ? '' : 'Email is not valid!';
            break;
        case 'phone':
            state.errors.phone = Utils.isValidPhoneNumber(value) ? '' : 'Enter valid telephone number';
            break;
    }
}

function validateForm(newState: SignupDonorState): void {
    for (let e in newState.errors) {
        // The properties in `errors` should match those in `user`
        if (e in newState.user) {
            const val = newState.user[e as keyof User];
            validationErrorMessage(newState, e, val.toString());
        }
    }
    newState.validForm = true;
    for (let e in newState.errors) {
        const val = newState.errors[e as keyof Error];
        if (val && val.length > 0) {
            newState.validForm = false;
            break;
        }
    }
}

export const reducer: Reducer<SignupDonorState> = (state: SignupDonorState | undefined, incomingAction: Action): SignupDonorState => {
    if (state === undefined) {
        return initialState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case SdTypes.INITIALIZE:
            return initialState;
        case SdTypes.ON_INPUT_CHANGE:
            let { name, value } = action.event.target;
            let newState = { ...state };
            newState.user = { ...newState.user, [name]: value };
            validationErrorMessage(newState, name, value);
            return newState;
        case SdTypes.VALIDATE_FORM: {
            let newState = { ...state, submitted: true };
            validateForm(newState);
            return newState;
        }
        case SdTypes.DONOR_CREATED:
            return { ...state, done: true };
        case SdTypes.ON_ERROR_FROM_SERVER: {
            const msg = `${action.body} [HTTP Error ${action.status}]`;
            let newState = { ...state, submitted: false };
            newState.errors = { ...newState.errors, fromServer: msg };
            return newState;
        }
    }
    return state;
};
