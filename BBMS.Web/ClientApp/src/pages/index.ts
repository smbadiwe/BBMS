import { ApplicationState as ApplicationState_, AppThunkAction as AppThunkAction_ } from '../store';
import * as Utils from "./utils";

export type ApplicationState = ApplicationState_;
export type AppThunkAction<TAction> = AppThunkAction_<TAction>;

export { Utils };

// This type represents an instance of a paged result received from our API
export interface PagedResult<T> {
    currentPage: number;
    rowCount: number;
    pageCount: number;
    pageSize: number;
    results: T[];
}
