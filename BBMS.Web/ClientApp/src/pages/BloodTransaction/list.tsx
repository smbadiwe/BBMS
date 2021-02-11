import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../';
import * as BloodTransactionsStore from './listStore';

// At runtime, Redux will merge together...
type BloodTransactionProps =
    BloodTransactionsStore.BloodTransactionsState // ... state we've requested from the Redux store
    & typeof BloodTransactionsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ page: string, pageSize: string }>; // ... plus incoming routing parameters


class FetchBloodTransactionData extends React.PureComponent<BloodTransactionProps> {
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.props.loadData();
    }

    public render() {
        return (
            <React.Fragment>
                <h1 id="btTable">Blood Transactions</h1>
                <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
                {this.renderForecastsTable()}
                {this.renderPagination()}
            </React.Fragment>
        );
    }

    private renderForecastsTable() {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Transaction Type</th>
                        <th>Blood Group</th>
                        <th>Rh. Factor</th>
                        <th>Pints</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.pagedResult.results.map((bt: BloodTransactionsStore.BloodTransaction) =>
                        <tr key={bt.reference}>
                            <td>{bt.dateCreated}</td>
                            <td>{bt.reference}</td>
                            <td>{bt.transactionType}</td>
                            <td>{bt.bloodGroup}</td>
                            <td>{bt.rhFactor}</td>
                            <td>{bt.pints}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    private renderPagination() {
        const obj = this.props.pagedResult;
        const prevPage = (obj.currentPage || 1) - 1;
        const nextPage = (obj.currentPage || 1) + 1;
        const disablePrev = prevPage < 1;
        const disableNext = nextPage > obj.pageCount;
        let navText;
        if (this.props.isLoading) {
            navText = <span>Loading...</span>;
        } else {
            navText = <span>Page {obj.currentPage} of {obj.pageCount || 1}</span>;
        }
        return (
            <div className="d-flex justify-content-between">
                <button className={`btn btn-outline-secondary btn-sm ${disablePrev ? "disable-link" : ""}`} onClick={this.props.goToPrevPage} disabled={disablePrev}>Previous</button>
                {navText}
                <button className={`btn btn-outline-secondary btn-sm ${disableNext ? "disable-link" : ""}`} onClick={this.props.goToNextPage} disabled={disableNext}>Next</button>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.bloodTransactions, // Selects which state properties are merged into the component's props
    BloodTransactionsStore.actionCreators // Selects which action creators are merged into the component's props
)(FetchBloodTransactionData as any); // eslint-disable-line @typescript-eslint/no-explicit-any
