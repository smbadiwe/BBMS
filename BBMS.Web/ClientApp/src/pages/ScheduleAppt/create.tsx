import * as React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import AppBar from '@material-ui/core/AppBar';
// import injectTapEventPlugin from 'react-tap-event-plugin'
// import axios from 'axios'
// import async from 'async';
// import Drawer from '@material-ui/core/Drawer';
// import Divider from '@material-ui/core/Divider';
// import TimePicker from '@material-ui/pickers/TimePicker';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import { DatePicker } from '@material-ui/pickers';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import SnackBar from '@material-ui/core/Snackbar';
import {
  Step,
  Stepper,
  StepContent,
  StepButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@material-ui/core';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
// import logo from './../../assets/images/logo.svg';
import { Utils, ApplicationState } from "..";
import { RouteComponentProps } from 'react-router';
import * as ScheduleApptStore from './createStore';
const HOST = '/';  // PRODUCTION ? '/' : 'http://localhost:3000/'

type ScheduleApptProps =
  ScheduleApptStore.ScheduleApptState &
  typeof ScheduleApptStore.actionCreators &
  RouteComponentProps<{}>;

class ScheduleAppt extends React.PureComponent<ScheduleApptProps> {
  constructor(props: Readonly<ScheduleApptProps>) {
    super(props);
    this.handleSetAppointmentDate = this.handleSetAppointmentDate.bind(this)
    this.handleSetAppointmentSlot = this.handleSetAppointmentSlot.bind(this)
    this.checkDisableDate = this.checkDisableDate.bind(this)
    this.renderAppointmentTimes = this.renderAppointmentTimes.bind(this)
    this.renderConfirmationString = this.renderConfirmationString.bind(this)
    this.renderAppointmentConfirmation = this.renderAppointmentConfirmation.bind(this)
    this.resize = this.resize.bind(this)
  }

  handleSetAppointmentDate(day: any) {
    this.props.handleNextStep()
    const dateString = moment(day).format('YYYY-DD-MM');
    this.props.setStateProps({ appointmentDate: dateString, confirmationTextVisible: true })
  }

  handleSetAppointmentSlot(event: ScheduleApptStore.InputChangedEvent) {
    this.props.handleNextStep();
    this.props.setStateProps({ appointmentSlot: event.target.value })
  }

  checkDisableDate(day: any) {
    const dateString = moment(day).format('YYYY-DD-MM');
    return this.props.fullDays.includes(dateString);
  }

  renderConfirmationString() {
    const spanStyle = { color: '#00bcd4' }
    return this.props.confirmationTextVisible ? <h2 style={{ textAlign: this.props.smallScreen ? 'center' : 'left', color: '#bdbdbd', lineHeight: 1.5, padding: '0 10px', fontFamily: 'Roboto' }}>
      {<span>
        Scheduling a

          <span style={spanStyle}> 1 hour </span>

        appointment {this.props.appointmentDate && <span>
          on <span style={spanStyle}>{moment(this.props.appointmentDate).format('dddd[,] MMMM Do')}</span>
        </span>} {this.props.appointmentSlot > -1 && <span>at <span style={spanStyle}>{moment().hour(9).minute(0).add(this.props.appointmentSlot, 'hours').format('h:mm a')}</span></span>}
      </span>}
    </h2> : null
  }

  renderAppointmentTimes() {
    if (!this.props.loading) {
      const slots: number[] = Utils.range(0, 8);
      return slots.map(slot => {
        const appointmentDateString = moment(this.props.appointmentDate).format('YYYY-DD-MM')
        const t1 = moment().hour(9).minute(0).add(slot, 'hours')
        const t2 = moment().hour(9).minute(0).add(slot + 1, 'hours')
        // console.log("Slot:", slot, "Appt Date:", appointmentDateString, "Schedule:\n", this.props.schedule);
        const scheduleDisabled = (this.props.schedule && appointmentDateString in this.props.schedule) ? this.props.schedule[appointmentDateString][slot] : false
        const meridiemDisabled = this.props.appointmentMeridiem ? t1.format('a') === 'am' : t1.format('a') === 'pm'
        let slotFilled;
        for (let bookedDay in this.props.bookedDatesObject) {
          let obj = this.props.bookedDatesObject[bookedDay];
          (bookedDay === appointmentDateString) && obj && (slotFilled = Object.values(obj).map(Number).includes(slot));
        }

        return <FormControlLabel
          style={{ marginBottom: 15, display: meridiemDisabled ? 'none' : 'inherit' }}
          key={slot}
          value={slot}
          disabled={scheduleDisabled || meridiemDisabled || slotFilled}
          control={<Radio />}
          label={t1.format('h:mm a') + ' - ' + t2.format('h:mm a')}
          labelPlacement="end"
        />
      })
    } else {
      return null
    }
  }

  renderAppointmentConfirmation() {
    const spanStyle = { color: '#00bcd4' }
    return <section>
      <p>Name: <span style={spanStyle}>{this.props.firstName} {this.props.lastName}</span></p>
      <p>Number: <span style={spanStyle}>{this.props.phone}</span></p>
      <p>Email: <span style={spanStyle}>{this.props.email}</span></p>
      <p>Appointment: <span style={spanStyle}>{moment(this.props.appointmentDate).format('dddd[,] MMMM Do[,] YYYY')}</span> at <span style={spanStyle}>{moment().hour(9).minute(0).add(this.props.appointmentSlot, 'hours').format('h:mm a')}</span></p>
    </section>
  }

  resize() {
    this.props.setStateProps({ smallScreen: window.innerWidth < 768 });
  }

  // componentDidMount() {
  //   console.log("componentDidMount - this.props:\n", this.props);
  //   this.props.onComponentMount();
  //   const handler = React.useCallback(
  //     (e) => {
  //       this.resize();
  //     },
  //     [this.resize]
  //   );
  //   Utils.useEventListener('resize', handler);
  // }

  render() {
    const { stepIndex, loading, navOpen, smallScreen, confirmationModalOpen, confirmationSnackbarOpen, ...data } = this.props
    const contactFormFilled = data.firstName && data.lastName && data.phone && data.email && data.validPhone && data.validEmail

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div>
          <AppBar title={data.siteTitle} />
          {/* <Drawer
          docked={false}
          width={300}
          open={navOpen}
          onRequestChange={(navOpen) => this.props.setStateProps({ navOpen })} >
          <img src={logo}
            style={{
              height: 70,
              marginTop: 50,
              marginBottom: 30,
              marginLeft: '50%',
              transform: 'translateX(-50%)'
            }} />
          <a style={{ textDecoration: 'none' }} href={this.props.homePageUrl}><MenuItem>Home</MenuItem></a>
          <a style={{ textDecoration: 'none' }} href={this.props.aboutPageUrl}><MenuItem>About</MenuItem></a>
          <a style={{ textDecoration: 'none' }} href={this.props.contactPageUrl}><MenuItem>Contact</MenuItem></a>

          <MenuItem disabled={true}
            style={{
              marginLeft: '50%',
              transform: 'translate(-50%)'
            }}>
            {"© Copyright " + moment().format('YYYY')}</MenuItem>
        </Drawer>
         */}
          <section style={{
            maxWidth: !smallScreen ? '80%' : '100%',
            margin: 'auto',
            marginTop: !smallScreen ? 20 : 0,
          }}>
            {this.renderConfirmationString()}
            <Card style={{
              padding: '10px 10px 25px 10px',
              height: (smallScreen ? '100vh' : undefined)
            }}>
              <Stepper
                activeStep={stepIndex}
                orientation="vertical">
                <Step disabled={loading}>
                  <StepButton onClick={() => this.props.setStateProps({ stepIndex: 0 })}>
                    Choose an available day for your appointment
                </StepButton>
                  <StepContent>
                    <DatePicker
                      style={{
                        marginTop: 10,
                        marginLeft: 10
                      }}
                      value={data.appointmentDate}
                      placeholder="Select a date"
                      onChange={day => this.handleSetAppointmentDate(day)}
                      shouldDisableDate={day => this.checkDisableDate(day)}
                      minDate={new Date()}
                    />
                  </StepContent>
                </Step>
                <Step disabled={!data.appointmentDate}>
                  <StepButton onClick={() => this.props.setStateProps({ stepIndex: 1 })}>
                    Choose an available time for your appointment
                </StepButton>
                  <StepContent>
                    <Select
                      placeholder="AM or PM"
                      value={data.appointmentMeridiem}
                      name="appointmentMeridiem"
                      // selectionRenderer={value => value ? 'PM' : 'AM'}
                      onChange={this.props.handleOnInputChange}>
                      <MenuItem value={0}>AM</MenuItem>
                      <MenuItem value={1}>PM</MenuItem>
                    </Select>
                    <FormControl component="fieldset">
                      <RadioGroup
                        style={{
                          marginTop: 15,
                          marginLeft: 15
                        }}
                        name="appointmentSlot"
                        value={data.appointmentSlot}
                        onChange={this.handleSetAppointmentSlot}>
                        {this.renderAppointmentTimes()}
                      </RadioGroup>
                    </FormControl>
                  </StepContent>
                </Step>
                <Step disabled={this.props.appointmentSlot < 0}>
                  <StepButton onClick={() => this.props.setStateProps({ stepIndex: 2 })}>
                    Share your contact information with us and we'll send you a reminder
                </StepButton>
                  <StepContent>
                    <section>
                      <TextField
                        style={{ display: 'block' }}
                        name="firstName" value={data.firstName}
                        placeholder="First Name"
                        onChange={this.props.handleOnInputChange} />
                      <TextField
                        style={{ display: 'block' }}
                        name="lastName" value={data.lastName}
                        placeholder="Last Name"
                        onChange={this.props.handleOnInputChange} />
                      <TextField
                        style={{ display: 'block' }}
                        name="email"
                        placeholder="name@mail.com"
                        error={!data.validEmail}
                        onChange={this.props.handleOnInputChange} />
                      <TextField
                        style={{ display: 'block' }}
                        name="phone"
                        placeholder="(888) 888-8888"
                        error={!data.validPhone}
                        onChange={this.props.handleOnInputChange} />
                      <Button variant="contained" color="primary"
                        style={{ display: 'block', marginTop: 20, maxWidth: 100 }}
                        fullWidth={true}
                        onClick={() => this.props.setStateProps({ confirmationModalOpen: !this.props.confirmationModalOpen })}
                        disabled={!contactFormFilled || data.processed}>
                        {contactFormFilled ? 'Schedule' : 'Fill out your information to schedule'}
                      </Button>
                    </section>
                  </StepContent>
                </Step>
              </Stepper>
            </Card>
            <Dialog
              open={confirmationModalOpen}
              title="Confirm your appointment">
              <DialogTitle id="simple-dialog-title">Confirm your appointment</DialogTitle>
              {this.renderAppointmentConfirmation()}
              <DialogActions>
                <Button variant="contained" disableElevation={true}
                  color="secondary"
                  onClick={() => this.props.setStateProps({ confirmationModalOpen: false })} >Cancel</Button>,
              <Button variant="contained" disableElevation={true}
                  color="primary"
                  onClick={this.props.handleSubmit} >Confirm</Button>
              </DialogActions>
            </Dialog>
            <SnackBar
              open={confirmationSnackbarOpen || loading}
              message={loading ? 'Loading... ' : data.confirmationSnackbarMessage || ''}
              autoHideDuration={10000}
              onClose={() => this.props.setStateProps({ confirmationSnackbarOpen: false })} />
          </section>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.scheduleAppt,
  ScheduleApptStore.actionCreators
)(ScheduleAppt as any);
