import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '..';
import * as SignupDonorStore from './createStore';
import '../custom.css';

type SignupDonorProps =
    SignupDonorStore.SignupDonorState &
    typeof SignupDonorStore.actionCreators &
    RouteComponentProps<{}>;

class SignupDonor extends React.PureComponent<SignupDonorProps> {

    componentDidMount() {
        this.props.initializeState();
    }
    public render() {
        if (this.props.done) {
            return <SignupDonorSuccess {...this.props.user} />;
        }
        const { firstName, lastName, age, email, phone, state, country, address, address1, address2, subscribenewsletter } = this.props.user;
        const submitted = this.props.submitted;
        const errors = this.props.errors;
        return (
            <div className="rightPanel">
                <ServerError {...errors} />
                <div className="row">
                    <label className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-3 mb-2">
                        <input type="text" value={firstName} name="firstName" onChange={this.props.onInputChange} className="form-control" placeholder="First Name" />
                        {submitted && errors.firstName.length > 0 && <span className='error'>{errors.firstName}</span>}
                    </div>
                    <div className="col-sm-3 mb-2">
                        <input type="text" value={lastName} name="lastName" onChange={this.props.onInputChange} className="form-control" placeholder="Last Name" />
                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6 mb-2">
                        <input type="email" value={email} name="email" onChange={this.props.onInputChange} className="form-control" id="email" placeholder="example@domain.com" />
                        {submitted && errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label">Phone</label>
                    <div className="col-sm-6 mb-2">
                        <input type="text" pattern="[0-9]" max="14" value={phone} name="phone" onChange={this.props.onInputChange} className="form-control" id="phone" />
                        {submitted && errors.phone.length > 0 && <span className='error'>{errors.phone}</span>}
                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-5 mb-2">
                    </div>
                    <div className="col-sm-4">
                        {submitted ?
                            <button type="button" className="button" disabled>Submitting</button>
                            : <button type="button" className="button" onClick={this.props.onSubmit}>Submit</button>
                        }
                    </div>
                    <div className="col-sm-3"></div>
                </div>
            </div>
        );
    }
};

const ServerError = (props: SignupDonorStore.Error) => {
    if (props.fromServer) {
        return (
            <div className="row"><div className="col-12 error">{props.fromServer}</div></div>
        );
    }
    return null;
}
export const SignupDonorSuccess = (props: SignupDonorStore.User) => {
    return (
        <div>Thank you {props.firstName} for signing up with us today! Please consider scheduling an appointment to donate blood.</div>
    );
}

export default connect(
    (state: ApplicationState) => state.signupDonor,
    SignupDonorStore.actionCreators
)(SignupDonor as any);
