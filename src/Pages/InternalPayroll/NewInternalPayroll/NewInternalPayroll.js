import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import { SAVE_INTERNAL_PAYROLL, GET_ACTIVITY_LIST } from '../../../Redux/actions/types.js'
import moment from 'moment';
import Container from '../../../components/common/Container/Container';
import SaveBtn from '../../../components/common/Buttons/SaveBtn';
import SubmitBtn from '../../../components/common/Buttons/SubmitBtn';
import CancelBtn from '../../../components/common/Buttons/CancelBtn';
import { notify } from 'reapop';

let activityListURL = '/api/intpayroll/activityList';
let saveIntPayrollURL = '/api/intpayroll/save';
let orgId = 0;
const initialState = {};

class NewInternalPayroll extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidMount = async () => {
        let agency = JSON.parse(window.sessionStorage.getItem("agency"));
        orgId = agency.organizationEntity.orgId;
        await this.props.tempedgeAPI(activityListURL, { orgId }, GET_ACTIVITY_LIST);

        this.initialData();
    }
    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/intpayroll/new/${this.props.activeLanguage.code}`);
            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }


    }
    initialData = () => {
        
        let calendar = moment().startOf('isoWeek');
        let mon = calendar.format("DD/MM/YYYY");
        let tue = calendar.add(1, 'days').format("DD/MM/YYYY");
        let wed = calendar.add(1, 'days').format("DD/MM/YYYY");
        let thu = calendar.add(1, 'days').format("DD/MM/YYYY");
        let fri = calendar.add(1, 'days').format("DD/MM/YYYY");
        let sat = calendar.add(1, 'days').format("DD/MM/YYYY");
        let sun = calendar.add(1, 'days').format("DD/MM/YYYY");
        for (let i = 1; i <= this.props.activityList.length; i++) {
            this.setState({
                ["mon" + i]: '',
                ["tue" + i]: '',
                ["wed" + i]: '',
                ["thu" + i]: '',
                ["fri" + i]: '',
                ["sat" + i]: '',
                ["sun" + i]: '',
                mon, tue, wed, thu, fri, sat, sun,
                weekEnd: sun,
                ["total_" + i]: 0
            });
        }
        this.setState({
            total_mon: 0,
            total_tue: 0,
            total_wed: 0,
            total_thu: 0,
            total_fri: 0,
            total_sat: 0,
            total_sun: 0,
            total: 0,
        });
        

    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    calcTotals = (fieldName) => {

        let day = fieldName.substring(0, fieldName.length - 1);

        let activitylist = this.props.activityList;

        new Promise((resolve, reject) => {

            for (let i = 0; i < activitylist.length; i++) {
                let tmpVal = this.state[fieldName]

                if (tmpVal === '' || isNaN(tmpVal) || tmpVal > 24 || tmpVal < -24) {
                    this.setState({ [fieldName]: '' });
                } else {
                    let activityTotals = [
                        this.state["mon" + activitylist[i].payrollActivityId],
                        this.state["tue" + activitylist[i].payrollActivityId],
                        this.state["wed" + activitylist[i].payrollActivityId],
                        this.state["thu" + activitylist[i].payrollActivityId],
                        this.state["fri" + activitylist[i].payrollActivityId],
                        this.state["sat" + activitylist[i].payrollActivityId],
                        this.state["sun" + activitylist[i].payrollActivityId]
                    ]


                    let weekTotal = 0;
                    activityTotals.map(act => {
                        if (act !== '' && !isNaN(act)) {
                            weekTotal += parseFloat(act);
                        }
                    });
                    this.setState({ ["total_" + activitylist[i].payrollActivityId]: weekTotal });


                }
                if ((i + 1) === activitylist.length) {
                    resolve();
                }
            }
        }).then(() => {

            let totalDay = 0;
            activitylist.map((act, index) => {
                totalDay += parseFloat(this.state[day + act.payrollActivityId] ? this.state[day + act.payrollActivityId] : 0);
                this.setState({ ["total_" + day]: totalDay });
            });


            let weekTotals = [
                this.state.total_mon,
                this.state.total_tue,
                this.state.total_wed,
                this.state.total_thu,
                this.state.total_fri,
                this.state.total_sat,
                this.state.total_sun
            ]
            let fullTotal = 0;
            weekTotals.map(weekday => {
                if (day !== '' && !isNaN(weekday)) {
                    fullTotal += weekday;
                }
            });
            this.setState({ total: fullTotal });
        });
    }

    // getWeekLlist = ()=>{
    //     let date = new Date();
    //     var day = date.getDay();
    //     var weekEndList = [];

    //     let prevMonday = new Date();
    //     prevMonday = new Date(date.setDate(date.getDate()+7-day));
    //     weekEndList.push(moment(prevMonday).format('MM/DD/YYYY'));
    //     this.changeWeek(moment(prevMonday).format('MM/DD/YYYY'));
    //     this.setState({
    //         weekEnd : String(moment(prevMonday).format('MM/DD/YYYY'))
    //     });

    //     for(let i=0 ; i<4 ; i++){
    //         if(date.getDay() == 0){
    //             prevMonday = new Date(date.setDate(date.getDate()-7));
    //         }
    //         else{
    //             prevMonday = new Date(date.setDate(date.getDate()-day));
    //         }
    //         weekEndList.push(moment(prevMonday).format('MM/DD/YYYY'));
    //         date = new Date(prevMonday.setDate(prevMonday.getDate()));

    //     }

    //     this.setState({weekEndList});

    // }

    createPayload = (payrollState) => {
        let payload = [];
        let activityList = this.props.activityList;
        activityList.map(act => {
            let intPayrollMon = {};
            let activityMon = {};
            if (this.state["mon" + act.payrollActivityId] && this.state["mon" + act.payrollActivityId] !== "") {
                intPayrollMon.weekEnd = this.state.weekEnd;
                intPayrollMon.date = this.state.mon;
                intPayrollMon.totalRegHour = this.state["mon" + act.payrollActivityId];
                intPayrollMon.payrollState = payrollState;
                intPayrollMon.comment = 'Test from REACT';

                activityMon.payrollActivityId = act.payrollActivityId;
                intPayrollMon.activity = activityMon;
                payload.push(intPayrollMon);
            }
            let intPayrollTue = {};
            let activityTue = {};
            if (this.state["tue" + act.payrollActivityId]) {
                intPayrollTue.weekEnd = this.state.weekEnd;
                intPayrollTue.date = this.state.tue;
                intPayrollTue.totalRegHour = this.state["tue" + act.payrollActivityId];
                intPayrollTue.payrollState = payrollState;
                intPayrollTue.comment = 'Test from REACT';

                activityTue.payrollActivityId = act.payrollActivityId;
                intPayrollTue.activity = activityTue;
                payload.push(intPayrollTue);
            }
            let intPayrollWed = {};
            let activityWed = {};
            if (this.state["wed" + act.payrollActivityId]) {
                intPayrollWed.weekEnd = this.state.weekEnd;
                intPayrollWed.date = this.state.wed;
                intPayrollWed.totalRegHour = this.state["wed" + act.payrollActivityId];
                intPayrollWed.payrollState = payrollState;
                intPayrollWed.comment = 'Test from REACT';

                activityWed.payrollActivityId = act.payrollActivityId;
                intPayrollWed.activity = activityWed;
                payload.push(intPayrollWed);
            }
            let intPayrollThu = {};
            let activityThu = {};
            if (this.state["thu" + act.payrollActivityId]) {
                intPayrollThu.weekEnd = this.state.weekEnd;
                intPayrollThu.date = this.state.thu;
                intPayrollThu.totalRegHour = this.state["thu" + act.payrollActivityId];
                intPayrollThu.payrollState = payrollState;
                intPayrollThu.comment = 'Test from REACT';

                activityThu.payrollActivityId = act.payrollActivityId;
                intPayrollThu.activity = activityThu;
                payload.push(intPayrollThu);
            }

            let intPayrollFri = {};
            let activityFri = {};
            if (this.state["fri" + act.payrollActivityId]) {
                intPayrollFri.weekEnd = this.state.weekEnd;
                intPayrollFri.date = this.state.fri;
                intPayrollFri.totalRegHour = this.state["fri" + act.payrollActivityId];
                intPayrollFri.payrollState = payrollState;
                intPayrollFri.comment = 'Test from REACT';

                activityFri.payrollActivityId = act.payrollActivityId;
                intPayrollFri.activity = activityFri;
                payload.push(intPayrollFri);
            }

            let intPayrollSat = {};
            let activitySat = {};
            if (this.state["sat" + act.payrollActivityId]) {
                intPayrollSat.weekEnd = this.state.weekEnd;
                intPayrollSat.date = this.state.sat;
                intPayrollSat.totalRegHour = this.state["sat" + act.payrollActivityId];
                intPayrollSat.payrollState = payrollState;
                intPayrollSat.comment = 'Test from REACT';

                activitySat.payrollActivityId = act.payrollActivityId;
                intPayrollSat.activity = activitySat;
                payload.push(intPayrollSat);
            }

            let intPayrollSun = {};
            let activitySun = {};
            if (this.state["sun" + act.payrollActivityId]) {
                intPayrollSun.weekEnd = this.state.weekEnd;
                intPayrollSun.date = this.state.sun;
                intPayrollSun.totalRegHour = this.state["sun" + act.payrollActivityId];
                intPayrollSun.payrollState = payrollState;
                intPayrollSun.comment = 'Test from REACT';

                activitySun.payrollActivityId = act.payrollActivityId;
                intPayrollSun.activity = activitySun;
                payload.push(intPayrollSun);
            }
        });

        return payload;

    }

    save = () => {

        let payload = this.createPayload("P");

        console.log(payload);
        if (payload && payload.length > 0) {
            console.log("IN")
            payload.map(act => {
                act.orgId = orgId;
                this.props.tempedgeAPI(saveIntPayrollURL, act, SAVE_INTERNAL_PAYROLL);
            });
            this.fireNotification();
        }

    }

    fireNotification = () => {
        let { notify } = this.props;

        notify({
            title: 'Thimesheet Saved',
            message: 'you clicked on the Submit button',
            status: 'success',
            position: 'br',
            dismissible: true,
            dismissAfter: 3500
        });
    }

    submit = () => {
        let payload = this.createPayload("S");

        payload.map(act => {
            act.orgId = orgId;
            this.props.tempedgeAPI(saveIntPayrollURL, act, SAVE_INTERNAL_PAYROLL);
        });
        this.setState(initialState);
        this.initialData();
        //TODO when save, go to internal payroll list
        this.props.push(`/dashboard/${this.props.activeLanguage.code}`);

    }

    render() {

        let activityList = this.props.activityList;
        let btns = <div className="row">

            <div className="col-md-4">
                <CancelBtn />
            </div>

            <div className="col-md-4">
                <SubmitBtn onClick={() => this.submit()} />
            </div>
            <div className="col-md-4">
                <SaveBtn onClick={() => this.save()} />
            </div>
        </div>
        return (


            <Container title="com.tempedge.msg.label.mytimesheet" btns={btns}>
                <div className='col-12'>
                    <div className="row">

                        <div className='col-sd-12 col-md-8'>
                        </div>
                        <div className='col-sd-12 col-md-2'>
                        </div>
                        <div className='col-sd-12 col-md-2 text-right tempedge-control-label '>
                        </div>
                    </div>
                    <div className="row">

                        <div className='col-sd-12 col-md-8 control-label text-right'>

                        </div>
                    </div>
                    <div className="row">
                        <div className='col-12 '>

                        </div>
                    </div>
                    <div className="row">
                        <div className='col-12'>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="table-header-left text-center">#</th>
                                        <th className="table-header-mid text-center">Mon <br></br> {this.state.mon ? String(this.state.mon) : ""}</th>
                                        <th className="table-header-mid text-center">Tue <br></br> {this.state.tue ? this.state.tue : ""}</th>
                                        <th className="table-header-mid text-center">Wed <br></br> {this.state.wed ? this.state.wed : ""}</th>
                                        <th className="table-header-mid text-center">Thu <br></br> {this.state.thu ? this.state.thu : ""}</th>
                                        <th className="table-header-mid text-center">Fri <br></br> {this.state.fri ? this.state.fri : ""}</th>
                                        <th className="table-header-mid text-center">Sat <br></br> {this.state.sat ? this.state.sat : ""}</th>
                                        <th className="table-header-mid text-center">Sun <br></br> {this.state.sun ? this.state.sun : ""}</th>
                                        <th className="table-header-right text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        activityList ? activityList.map(act => {
                                            return (
                                                <tr className="tableRow" key={act.payrollActivityId}>
                                                    <td className="table-content">{act.activity}</td>
                                                    <td className="table-content text-center">
                                                        <input value={this.state["mon" + act.payrollActivityId]}
                                                            name={"mon" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center">
                                                        <input type="text" value={this.state["tue" + act.payrollActivityId] ? this.state["tue" + act.payrollActivityId] : ''}
                                                            name={"tue" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center">
                                                        <input type="text" value={this.state["wed" + act.payrollActivityId] ? this.state["wed" + act.payrollActivityId] : ''}
                                                            name={"wed" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center">
                                                        <input type="text" value={this.state["thu" + act.payrollActivityId] ? this.state["thu" + act.payrollActivityId] : ''}
                                                            name={"thu" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center">
                                                        <input type="text" value={this.state["fri" + act.payrollActivityId] ? this.state["fri" + act.payrollActivityId] : ''}
                                                            name={"fri" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center">
                                                        <input type="text" value={this.state["sat" + act.payrollActivityId] ? this.state["sat" + act.payrollActivityId] : ''}
                                                            name={"sat" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center">
                                                        <input type="text" value={this.state["sun" + act.payrollActivityId] ? this.state["sun" + act.payrollActivityId] : ''}
                                                            name={"sun" + act.payrollActivityId}
                                                            className="form-control tempEdge-input-box payroll-input text-center" maxLength="6"
                                                            onBlur={e => this.calcTotals(e.target.name)}
                                                            onChange={e => this.onChange(e)} />
                                                    </td>
                                                    <td className="table-content text-center" name={"total_" + act.payrollActivityId}>{
                                                        this.state["total_" + act.payrollActivityId]}
                                                    </td>
                                                </tr>
                                            )
                                        }) : ""
                                    }
                                    <tr className="tableRow text-center">
                                        <td className="table-content">TOTAL</td>
                                        <td className="table-content">{this.state.total_mon}</td>
                                        <td className="table-content">{this.state.total_tue}</td>
                                        <td className="table-content">{this.state.total_wed}</td>
                                        <td className="table-content">{this.state.total_thu}</td>
                                        <td className="table-content">{this.state.total_fri}</td>
                                        <td className="table-content">{this.state.total_sat}</td>
                                        <td className="table-content">{this.state.total_sun}</td>
                                        <td className="table-content">{this.state.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }
}


let mapStateToProps = (state) => {

    return ({
        activityList: (state.tempEdge.activityList !== undefined) ? state.tempEdge.activityList : []
    });

}


NewInternalPayroll.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
    //Action, does the Fetch part from the posts API
    tempedgeAPI: PropTypes.func.isRequired,     //Action, does the Fetch part from the posts API
}

export default withLocalize(connect(mapStateToProps, { push, tempedgeAPI, notify })(NewInternalPayroll));
