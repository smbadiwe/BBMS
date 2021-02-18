import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '..';
import * as SignupDonorStore from './createStore';
import { Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, UncontrolledAlert, Alert, FormFeedback } from 'reactstrap';
// import '../custom.css';

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
        const { firstName, lastName, email, phone, address, address2, city, state, zipCode, country, subscribenewsletter } = this.props.user;
        const { submitted, validForm } = this.props;
        const errors = this.props.errors;
        return (
            <Form>
                <ServerError {...errors} />
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <InputGroup>
                                <Input type="text" value={firstName} name="firstName" onChange={this.props.onInputChange} invalid={!!errors.firstName} placeholder="First Name" />
                                <FormFeedback>{errors.firstName}</FormFeedback>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="lsstName">Last Name</Label>
                            <Input type="text" value={lastName} name="lastName" onChange={this.props.onInputChange} placeholder="Last Name" />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <InputGroup>
                        <Input type="email" name="email" value={email} onChange={this.props.onInputChange} invalid={!!errors.email} placeholder="Email address" />
                        <FormFeedback>{errors.email}</FormFeedback>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Label for="phone">Phone</Label>
                    <InputGroup>
                        <Input type="text" name="phone" value={phone} pattern="[0-9]" max="14" onChange={this.props.onInputChange} invalid={!!errors.phone} placeholder="Phone number" />
                        <FormFeedback>{errors.phone}</FormFeedback>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" value={address} placeholder="1234 Main St" onChange={this.props.onInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="address2">Address 2</Label>
                    <Input type="text" name="address2" value={address2} placeholder="Apartment, studio, or floor" onChange={this.props.onInputChange} />
                </FormGroup>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="city">City</Label>
                            <Input type="text" name="city" value={city} onChange={this.props.onInputChange} />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="state">State</Label>
                            <Input type="text" name="state" value={state} onChange={this.props.onInputChange} />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="zipCode">Zip</Label>
                            <Input type="text" name="zipCode" value={zipCode} onChange={this.props.onInputChange} />
                        </FormGroup>
                    </Col>
                </Row>
                <Button color="info" onClick={this.props.onSubmit} disabled={submitted && validForm}>{submitted && validForm ? 'Submitting' : 'Submit'}</Button>
            </Form>
        )
    }
}

const ServerError = (props: SignupDonorStore.Error) => {
    if (props.fromServer) {
        return (
            <UncontrolledAlert color="danger">
                {props.fromServer}
            </UncontrolledAlert>
        );
    }
    return null;
}

const SignupDonorSuccess = (props: SignupDonorStore.User) => {
    return (
        <Alert color="success">
            <h4 className="alert-heading">Well done!</h4>
            <p>
                Thank you {props.firstName} for signing up with us today! Please consider scheduling an appointment to donate blood.
            </p>
            <hr />
            <p className="mb-0">
                Click here to schedule an appointment
            </p>
        </Alert>
           );
}

export default connect(
    (state: ApplicationState) => state.signupDonor,
    SignupDonorStore.actionCreators
)(SignupDonor as any);
