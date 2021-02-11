import { Action, Reducer } from 'redux';
import { AppThunkAction, PagedResult } from '../';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface BloodTransactionsState {
    // Search params
    dateFrom?: Date;
    dateTo?: Date;

    // Data
    isLoading: boolean;
    pagedResult: PagedResult<BloodTransaction>;
}

export interface BloodTransaction {
    dateCreated: string;
    reference: string;
    rhFactor: string;
    bloodGroup: string;
    transactionType: string;
    pints: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

enum BtTypes {
    REQUEST_LIST = 'REQUEST_BLOOD_TRANSACTIONS',
    RECEIVE_LIST = 'RECEIVE_BLOOD_TRANSACTIONS',
}

interface RequestBloodTransactionsAction {
    type: typeof BtTypes.REQUEST_LIST;
}

interface ReceiveBloodTransactionsAction {
    type: typeof BtTypes.RECEIVE_LIST;
    results: PagedResult<BloodTransaction>;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestBloodTransactionsAction | ReceiveBloodTransactionsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
const requestBloodTransactions = (dispatch: (action: KnownAction) => void, page: number, pageSize: number) => {
    // Only load data if it's something we don't already have (and are not already loading)
    dispatch({ type: BtTypes.REQUEST_LIST });
    let query: any = {};
    if (page > 0) query.page = page;
    if (pageSize > 0) query.pageSize = pageSize;
    const queryString = require('query-string');
    let qs = queryString.stringify(query);
    if (qs) qs = '?' + qs;
    console.log("Calling API for new data! Page", page, " QS", qs);
    fetch(`api/bloodtransaction${qs}`)
        .then(response => {
            if (!response.ok) throw response;
            return response.json() as Promise<PagedResult<BloodTransaction>>;
        })
        .then(data => {
            dispatch({ type: BtTypes.RECEIVE_LIST, results: data });
        })
        .catch(error => {
            console.log("Error from server\n", error);
        });
}

export const actionCreators = {
    goToPrevPage: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.bloodTransactions && appState.bloodTransactions.pagedResult) {
            const pr = appState.bloodTransactions.pagedResult;

            const prevPage = (pr.currentPage || 1) - 1;
            if (prevPage > 0) {
                requestBloodTransactions(dispatch, prevPage, pr.pageSize);
            }
        }
    },
    goToNextPage: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.bloodTransactions && appState.bloodTransactions.pagedResult) {
            const pr = appState.bloodTransactions.pagedResult;

            const nextPage = (pr.currentPage || 1) + 1;
            if (nextPage <= pr.pageCount) {
                requestBloodTransactions(dispatch, nextPage, pr.pageSize);
            }
        }
    },
    loadData: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log("Running loadData()");
        const appState = getState();
        if (appState && appState.bloodTransactions && appState.bloodTransactions.pagedResult) {
            const pr = appState.bloodTransactions.pagedResult;
            requestBloodTransactions(dispatch, pr.currentPage, pr.pageSize);
        }
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: BloodTransactionsState = {
    pagedResult: {
        currentPage: 1, rowCount: 0, pageSize: 10, pageCount: 1, results: []
    },
    isLoading: false
};

export const reducer: Reducer<BloodTransactionsState> = (state: BloodTransactionsState | undefined, incomingAction: Action): BloodTransactionsState => {

    const action = incomingAction as KnownAction;
    if (state === undefined) {
       return unloadedState;
    }
    switch (action.type) {
        case BtTypes.REQUEST_LIST:
            return { ...state, isLoading: true };
        case BtTypes.RECEIVE_LIST:
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.results.currentPage === state.pagedResult.currentPage) {
                return {...state, pagedResult: action.results, isLoading: false}
            }
            break;
    }

    return state;
};
