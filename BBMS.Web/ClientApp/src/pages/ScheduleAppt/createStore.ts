import { Action, Reducer } from 'redux';
import { ApplicationState, AppThunkAction, Utils } from '..';
import moment from 'moment';

enum SdTypes {
    handleNavToggle = 'handleNavToggle',
    handleNextStep = 'handleNextStep',
    ON_INPUT_CHANGE = 'ON_INPUT_CHANGE',
    SetStateProps = 'SetStateProps',
    VALIDATE_FORM = 'VALIDATE_FORM',
}

export interface ScheduleApptState {
    loading: boolean;
    navOpen: boolean;
    confirmationModalOpen: boolean;
    confirmationTextVisible: boolean;
    stepIndex: number;
    appointmentDateSelected: boolean;
    appointmentMeridiem: number;

    siteTitle: string;

    firstName: string;
    lastName: string;
    appointmentDate: Date;
    appointmentSlot: number;
    processed: boolean;
    confirmationSnackbarMessage: string;

    email: string;
    validEmail: boolean;
    phone: string;
    validPhone: boolean;
    smallScreen: boolean;
    confirmationSnackbarOpen: boolean;
    schedule: ObjectDummy;
    bookedAppointments: Appt[];
    bookedDatesObject: ObjectDummy;
    fullDays: string[];
}

export interface OnInputChangeAction {
    type: typeof SdTypes.ON_INPUT_CHANGE;
    event: InputChangedEvent
}
interface ObjectDummy { [name: string]: any }
interface SetStatePropsAction { type: typeof SdTypes.SetStateProps, kvp: ObjectDummy }
interface NavToggleAction { type: typeof SdTypes.handleNavToggle }
interface NextStepAction { type: typeof SdTypes.handleNextStep }

const initialState: ScheduleApptState = {
    loading: false, //otherwise loads forever
    navOpen: false,
    confirmationModalOpen: false,
    confirmationTextVisible: false,
    stepIndex: 0,
    appointmentDateSelected: false,
    appointmentMeridiem: 0,

    processed: false,
    confirmationSnackbarMessage: '',
    siteTitle: '',

    firstName: '',
    lastName: '',
    appointmentDate: new Date(),
    appointmentSlot: -1,

    email: '',
    validEmail: true,
    phone: '',
    validPhone: true,
    smallScreen: window.innerWidth < 768,
    confirmationSnackbarOpen: false,
    schedule: {}, //otherwise undefined in renderAppointmentTimes
    bookedAppointments: [], //to track booked appointments
    bookedDatesObject: {}, //tracks dates coupled to their slots
    fullDays: [] //to track full days
}

export interface InputChangedEvent extends React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> { }

interface Appt {
    name: string;
    email: string;
    phone: string;
    date: string;  // Date, in YYYY-DD-MM
    slot: number;  // how many hours away the appointment is from 9AM.
}
interface FetchDataResult {
    configs: any;
    appointments: Appt[];
}
const HOST = '/';  // PRODUCTION ? '/' : 'http://localhost:3000/'

const fetchData = async (dispatch: (action: KnownAction) => void, getState: () => ApplicationState) => {
    const appointments = await Utils.httpGet(HOST + 'api/appointments');
    const appointmentData: Appt[] = appointments.data.data;
    // this.setState({bookedAppointments: appointmentData});

    //added logic to exclude booked slots and fully booked dates.
    let bookedDates: string[] = [];
    let bookedDatesObj: { [name: string]: number[] } = {};
    let bookedSlots = []
    appointmentData.forEach(appointment => {
        if (!bookedDates.includes(appointment.date)) {
            bookedDates.push(appointment.date);
            bookedSlots.push(appointment.slot);
        }
    });
    bookedDates.forEach(bookedDate => {
        let newArray: number[] = [];
        appointmentData.forEach(appointment => {
            (appointment.date === bookedDate) && newArray.push(appointment.slot);
        });
        bookedDatesObj[bookedDate] = newArray;
    });
    const state = getState();
    let fullDays = state && state.scheduleAppt ? state.scheduleAppt.fullDays : [];
    for (let bookedDay in bookedDatesObj) {
        let obj = bookedDatesObj[bookedDay];
        if (obj.length === 8) {
            fullDays.push(bookedDay);
        }
    }
    dispatch({
        type: SdTypes.SetStateProps, kvp: {
            bookedDatesObject: bookedDatesObj,
            bookedAppointments: appointmentData,
            fullDays: fullDays
        }
    });
    const config = await Utils.httpGet(HOST + 'api/config');
    const configData = config.data.data;
    return { appointments: appointmentData, configs: configData };
}

const handleFetch = (response: FetchDataResult, dispatch: (action: KnownAction) => void) => {
    const { configs, appointments } = response;
    const initSchedule: { [name: string]: any | any[] } = {};
    const today = moment().startOf('day');
    initSchedule[today.format('YYYY-DD-MM')] = true;
    const schedule = !appointments.length ? initSchedule : appointments.reduce((currentSchedule, appointment) => {
        const { date, slot } = appointment;
        const dateString = moment(date, 'YYYY-DD-MM').format('YYYY-DD-MM');
        if (!currentSchedule[date]) {
            currentSchedule[dateString] = Array(8).fill(false);
        }
        if (Array.isArray(currentSchedule[dateString])) {
            currentSchedule[dateString][slot] = true;
        }
        return currentSchedule;
    }, initSchedule);

    //Imperative x 100, but no regrets
    for (let day in schedule) {
        const slots: any[] = schedule[day];
        console.log("Schedule: ", day, "=", slots);
        if (!slots || slots.length === 0) continue;
        schedule[day] = slots.every(slot => slot === true);
    }

    dispatch({
        type: SdTypes.SetStateProps, kvp: {
            schedule,
            siteTitle: configs.site_title,
            aboutPageUrl: configs.about_page_url,
            contactPageUrl: configs.contact_page_url,
            homePageUrl: configs.home_page_url,
            loading: false
        }
    });
}

function validateInput(state: ScheduleApptState, kvp: ObjectDummy): void {
    for (let name in kvp) {
        const value = kvp[name];
        switch (name) {
            case 'email':
                state.validEmail = Utils.isValidEmail(value);
                break;
            case 'phone':
                state.validPhone = Utils.isValidPhoneNumber(value);
                break;
        }
    }
}

export const actionCreators = {
    onComponentMount: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        fetchData(dispatch, getState)
            .then(result => {
                handleFetch(result, dispatch);
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: SdTypes.SetStateProps, kvp: { confirmationSnackbarMessage: 'Error fetching data', confirmationSnackbarOpen: true } })
            });
    },
    setStateProps: (kvp: ObjectDummy): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: SdTypes.SetStateProps, kvp: kvp });
    },
    handleNavToggle: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: SdTypes.handleNavToggle });
    },
    handleNextStep: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: SdTypes.handleNextStep });
    },
    // handleOnInputChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{name?: string; value: unknown}>): AppThunkAction<KnownAction> => (dispatch) => {
    //     dispatch({ type: SdTypes.ON_INPUT_CHANGE, event: event });
    // },
    handleOnInputChange: (event: InputChangedEvent): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: SdTypes.ON_INPUT_CHANGE, event: event });
    },

    handleSubmit: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        if (state && state.scheduleAppt) {
            const appt = state.scheduleAppt;
            const appointment: Appt = {
                date: moment(appt.appointmentDate).format('YYYY-DD-MM'),
                slot: appt.appointmentSlot,
                name: appt.firstName + ' ' + appt.lastName,
                email: appt.email,
                phone: appt.phone
            }
            Utils.httpPost(HOST + 'api/appointments', appointment)
                .then(response => dispatch({
                    type: SdTypes.SetStateProps, kvp: {
                        confirmationSnackbarMessage: "Appointment succesfully added!",
                        confirmationSnackbarOpen: true,
                        processed: true
                    }
                }))
                .catch(err => {
                    console.log(err);
                    dispatch({
                        type: SdTypes.SetStateProps, kvp: {
                            confirmationSnackbarMessage: "Appointment failed to save.",
                            confirmationSnackbarOpen: true
                        }
                    })
                })
        }
    }


}

export type KnownAction = NavToggleAction | NextStepAction |
    OnInputChangeAction | SetStatePropsAction;

export const reducer: Reducer<ScheduleApptState> = (state: ScheduleApptState | undefined, incomingAction: Action): ScheduleApptState => {
    if (state === undefined) {
        return initialState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case SdTypes.SetStateProps: {
            let newState = { ...state, ...action.kvp };
            validateInput(newState, action.kvp);
            return newState;
        }
        case SdTypes.handleNavToggle: {
            return { ...state, navOpen: !state.navOpen };
        }
        case SdTypes.handleNextStep: {
            if (state.stepIndex < 3) {
                return { ...state, stepIndex: state.stepIndex + 1 };
            }
            return state;
        }
        case SdTypes.ON_INPUT_CHANGE:
            let { name, value } = action.event.target;
            if (!name) {
                console.error("ON_INPUT_CHANGE: No input name given for the value: ", value, ". Nothing set");
            } else {
                let newState = { ...state, [name]: value };
                return newState;
            }
    }
    return state;
};
