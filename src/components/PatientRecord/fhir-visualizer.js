import React, {useEffect, useState} from 'react';
import './bootstrap.css';
import moment from 'moment';
import api from '../../api';
import { useStore } from '../StoreProvider';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".health-record__header {\n  font-family: 'Open Sans', sans-serif;\n  display: -ms-flexbox;\n  display: flex;\n  color: #6b8eb6;\n  font-size: 1em;\n  font-weight: bold;\n  text-transform: uppercase;\n  margin: 40px 0;\n}\n​\n.health-record__header .header-divider {\n  width: 100%;\n  border-bottom: 1px solid #7e90a3;\n  margin-bottom: 10px;\n}\n​\n.report-line {\n  background: #EAEAEA;\n}\n​\ndl {\n  margin-top:0;\n  margin-bottom:20px\n}\n\ndd,dt {\n  line-height:1.42857\n}\n\ndt {\n  font-weight:700\n}\n\ndd {\n  margin-left:0\n}\n.dl-horizontal dd:after,.dl-horizontal dd:before {\n  content:\" \";\n  display:table\n}\n\n.dl-horizontal dd:after {\n  clear:both\n}\n\n@media (min-width:768px) {\n  .dl-horizontal dt {\n    float:left;\n    clear:left;\n    text-align:right;\n    overflow:hidden;\n    text-overflow:ellipsis;\n    white-space:nowrap\n  }\n  .dl-horizontal dd {\n    margin-left:180px\n  }\n}\n";
styleInject(css);

const DSTU2 = '1.0.2';
const STU3 = '3.0.1';
const R4 = '4.0.0';

const round = function (num, digits) {
  return Number.parseFloat(num).toFixed(digits);
};

const FORMATTERS = {
  date: str => moment(str).format('YYYY-MM-DD'),
  time: str => moment(str).format('HH:mm:ss'),
  dateTime: str => moment(str).format('YYYY-MM-DD - h:mm:ss a'),
  numberWithCommas: str => str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

const obsValue = entry => {
  if (entry == null) {
    return '';
  } else if (entry.valueQuantity) {
    return round(entry.valueQuantity.value, 2) + ' ' + entry.valueQuantity.code;
  } else if (entry.valueCodeableConcept) {
    return entry.valueCodeableConcept.coding[0].display;
  } else if (entry.valueString) {
    return entry.valueString;
  }

  if (entry.code.coding[0].display === "Blood Pressure" || entry.code.coding[0].display === "BP") {
    if (!entry.component[0].valueQuantity) {
      return ''; // WTF!!
    }

    const v1 = Number.parseFloat(entry.component[0].valueQuantity.value);
    const v2 = Number.parseFloat(entry.component[1].valueQuantity.value);
    const s1 = v1.toFixed(0);
    const s2 = v2.toFixed(0);

    if (v1 > v2) {
      return s1 + ' / ' + s2 + ' mmHg';
    } else {
      return s2 + ' / ' + s1 + ' mmHg';
    }
  }

  return '';
};

const duration = period => {
  if (!period.end) {
    return '';
  }

  let start = moment(period.start);
  let end = moment(period.end);
  return moment.duration(start.diff(end)).humanize();
};

class PatientVisualizer extends React.Component {
  state = {
    edit: false,
    enroll: null,
    patient: this.props.patient
  }

  getUser = async (patient) => {
    const ehr_id = patient.id;

    if (patient) {  
      api.getUser(ehr_id).then((res) => {
        const user = res.data.data[0];
        this.setState({enroll: true});
        this.props.dispatch({type: 'updateEnroll', enroll: true});
        this.props.dispatch({type: 'updateUser', user})
      })
      .catch((err) => {
        console.log(err);
        console.log(patient);
        this.setState({enroll: false});
        this.props.dispatch({type: 'updateEnroll', enroll: false})
      })
    }
  }

  enrollUser = async (patient) => {
    const user = {
      firstName: patient.name.find(n => n.use === 'official').given[0],
      lastName: patient.name.find(n => n.use === 'official').family,
      ehr_id: patient.id,
      birthDate: patient.birthDate,
      telephone: patient.telecome ? patient.telecom[0] : "999-999-9999"
    }
    api.createUser(user).then((res) => {
      this.setState({enroll: true});
      this.props.dispatch({type: 'updateEnroll', enroll: true});
      this.props.dispatch({type: 'updateUser', user});
    })
  }
  
  componentDidMount(){
    this.getUser(this.props.patient);
  }

  render() {
    const patient = this.state.patient;
    const fName = this.state.patient.name.find(n => n.use === 'official').given[0];
    const lName = this.state.patient.name.find(n => n.use === 'official').family;
    patient.extension = patient.extension || [];
    const raceExt = patient.extension.find(e => {
      return e.url === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race';
    });
    let race;

    if (raceExt) {
      race =  Array.isArray(raceExt.extension) ? raceExt.extension[0].valueString || raceExt.extension[0].valueCoding.display : raceExt.valueCodeableConcept.coding[0].display;
    } else {
      race = null;
    }

    const ethExt = patient.extension.find(e => {
      return e.url === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity';
    });
    let ethnicity;

    if (ethExt) {
      ethnicity = Array.isArray(ethExt.extension) ? ethExt.extension[0].valueString || ethExt.extension[0].valueCoding.display : ethExt.valueCodeableConcept.coding[0].display;
    } else {
      ethnicity = null;
    }

    let language = null;

    if (patient.communication && patient.communication[0] && patient.communication[0].language && patient.communication[0].language.coding && patient.communication[0].language.coding[0]) {
      language = patient.communication[0].language.coding[0].display;
    }

    const observations = this.props.observations || [];
    const searchableObs = observations.slice().reverse();
    const height_obs = searchableObs.find(o => o.code.coding && (o.code.coding[0].display === 'Height' || o.code.coding[0].display === 'Body Height'));
    const weight_obs = searchableObs.find(o => o.code.coding && (o.code.coding[0].display === 'Weight' || o.code.coding[0].display === 'Body Weight'));
    const cause_of_death_obs = null;
    let lat, lng;

    if (patient.address[0].extension) {
      const geolocation = patient.address[0].extension.find(e => e.url === 'http://hl7.org/fhir/StructureDefinition/geolocation');

      if (geolocation && geolocation.extension.length > 1) {
        lat = geolocation.extension.find(e => e.url === 'latitude').valueDecimal;
        lng = geolocation.extension.find(e => e.url === 'longitude').valueDecimal;
      }
    }

    const updatePatient = (bool) => {
      if (bool) {
        // this.props.client.update(this.state.patient).then((patient) => this.props.dispatch({patient, type: 'updatePatient'}));
        this.props.dispatch({patient, type: 'updatePatient'});
        this.setState({edit: false});
      } else {
        this.setState({edit: true});
      }
    }

    const renderEdit = () => {
      const style={ marginLeft: '200px'};
      return this.state.edit ? 
        <div style={style} onClick={() => updatePatient(true)}>
          Save
        </div> : 
        <div style={style} onClick={() => updatePatient(false)}>
          Edit
        </div>
    }

    const renderEnroll = () => {  
      const style = {marginLeft: '200px', borderRadius: '5px', background: '#6b8eb6', color: 'white', fontSize: '1em', fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', textTransform: 'uppercase'};
      if (this.state.enroll === false) {
        return <button style={style} onClick={() => this.enrollUser(this.state.patient)}>Refer Patient</button>
      } else if (this.state.enroll === true) {
        return <button style={{...style, background: 'lightgrey'}} disabled>Enrolled </button>
      }
    }

    const handleChange = (e) => {
      const patient = this.state.patient;
      const firstName = e.currentTarget.value;
      patient.name[0].given = firstName;
      this.setState(patient);
    }
    
    const style = {
      sectionHeader: {
        'fontFamily': 'Open Sans, sans-serif',
        'color': '#6b8eb6',
        'fontSize': '1em',
        'fontWeight': 'bold',
        'textTransform': 'uppercase',
        'margin': '40px 10px',
        'display': 'flex',
        'justifyContent': 'space-between'
      }
    }

    return (
      <div>
        <div style={style.sectionHeader}>
          Patient
          {renderEnroll()}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '0px 10px'}}>
          <div>
              <div>First Name: <input disabled={!this.state.edit} defaultValue={fName} onChange={(e) => handleChange(e)}></input></div>
              <div>Last Name: <input disabled={!this.state.edit} defaultValue={lName}></input></div>
              <div>Gender: <input disabled={!this.state.edit} defaultValue={patient.gender}></input></div>
              <div>Date of Birth: <input disabled={!this.state.edit} defaultValue={patient.birthDate}></input></div>
              <div>Address: <input disabled={!this.state.edit} defaultValue={patient.address[0].line.join(' ')}></input></div>
              <div>City, State: <input disabled={!this.state.edit} defaultValue={patient.address[0].city, ", ", patient.address[0].state}></input></div>
            <div>Postal Code: <input disabled={!this.state.edit} defaultValue={patient.address[0].postalCode}></input></div>
          </div>
          <div>
            <div>Height: <input disabled={true} defaultValue={obsValue(height_obs)}></input></div>
            <div>Weight: <input disabled={true} defaultValue={obsValue(weight_obs)}></input></div>
            <div>Race: <input disabled={true} defaultValue={race}></input></div>
            <div>Ethnicity: <input disabled={true} defaultValue={ethnicity}></input></div>
            <div>Language: <input disabled={true} defaultValue={language}></input></div>
          </div>
        </div>
      </div>
    )

  //   return React.createElement("div", null, React.createElement("div", {
  //     className: "health-record__header"
  //   }, React.createElement("div", {
  //     className: "header-title"
  //   }, "Patient"), React.createElement("div", {
  //     className: "header-divider"
  //   }), <div className="col-6">{renderEdit()}</div>
  //   ), React.createElement("div", {
  //     id: "p_brief",
  //     className: "row"
  //   }, React.createElement("div", {
  //     id: "p_brief_records",
  //     className: "col-6"
  //   }, React.createElement("div", {
  //     id: "p_brief_name_address",
  //     className: "p_block"
  //   }, React.createElement("dl", {
  //     className: "dl-horizontal p_brief_family"
  //   }, React.createElement("dt", null, "Name"), React.createElement("dd", null, patient.name[0].family, ", ", patient.name[0].given.join(' ')), React.createElement("dt", null, "Gender"), React.createElement("dd", null, patient.gender), React.createElement("dt", null, "Date of Birth"), React.createElement("dd", null, patient.birthDate), React.createElement("dt", null, "Address"), React.createElement("dd", null, patient.address[0].line.join(' ')), React.createElement("dt", null, "City, State"), React.createElement("dd", null, patient.address[0].city, ", ", patient.address[0].state), React.createElement("dt", null, "Postal Code"), React.createElement("dd", null, patient.address[0].postalCode), patient.deceasedDateTime && React.createElement(React.Fragment, null, React.createElement("dt", null, "Date of Death"), React.createElement("dd", null, patient.deceasedDateTime))))), React.createElement("div", {
  //     id: "p_brief_records",
  //     className: "col-6"
  //   }, React.createElement("div", {
  //     id: "p_brief_name_address",
  //     className: "p_block"
  //   }, React.createElement("dl", {
  //     className: "dl-horizontal p_brief_family"
  //   }, React.createElement("dt", null, "Height"), React.createElement("dd", null, obsValue(height_obs)), React.createElement("dt", null, "Weight"), React.createElement("dd", null, obsValue(weight_obs)), React.createElement("dt", null, "Race"), React.createElement("dd", null, race || 'unk.'), React.createElement("dt", null, "Ethnicity"), React.createElement("dd", null, ethnicity || 'unk.'), React.createElement("dt", null, "Language"), React.createElement("dd", null, language || 'unk.'), React.createElement("dt", null, "Blood Type"), React.createElement("dd", null, "unknown"), patient.deceasedDateTime && React.createElement(React.Fragment, null, React.createElement("dt", null, "Cause of Death"), React.createElement("dd", null, cause_of_death_obs)))))));
  }

}

class GenericVisualizer extends React.Component {
  /*
    columns: [
      { title: 'SNOMED', getter: (c) => c.code.coding[0].code, versions: ['1.0.2', '3.0.1', '4.0.0'] }
    ],
    rows: // fhir[]
    keyFn: (c) => c.id
  */
  renderHeaderLine() {
    const columns = this.props.columns.filter(c => c.versions === '*' || c.versions.includes(this.props.version)).map(c => c.title);
    return columns.map(c => React.createElement("th", {
      scope: "col",
      key: c
    }, c));
  }

  renderBodyLine(line) {
    const columns = this.props.columns.filter(c => c.versions === '*' || c.versions.includes(this.props.version));
    const nestedRows = [];

    if (this.props.nestedRows) {
      for (const nestedRow of this.props.nestedRows) {
        let subRowLines;

        try {
          subRowLines = nestedRow.getter(line);
        } catch (e) {
          subRowLines = undefined;
        }

        if (!subRowLines) continue;
        const subColumns = nestedRow.columns.filter(c => c.versions === '*' || c.versions.includes(this.props.version));

        for (const subRowLine of subRowLines) {
          nestedRows.push(React.createElement("tr", {
            key: nestedRow.keyFn(subRowLine)
          }, subColumns.map((c, i) => {
            const formatter = FORMATTERS[c.format];
            let result;

            try {
              result = c.getter(subRowLine);
            } catch (e) {
              result = undefined;
            }

            if (result && formatter) {
              result = formatter(result);
            }

            if (!result && c.defaultValue) {
              result = c.defaultValue;
            }

            return React.createElement("td", {
              key: i
            }, result);
          })));
        }
      }
    }

    return React.createElement(React.Fragment, {
      key: this.props.keyFn(line)
    }, React.createElement("tr", {
      className: this.props.rowClass || '',
      key: this.props.keyFn(line)
    }, columns.map((c, i) => {
      const formatter = FORMATTERS[c.format];
      let result;

      try {
        result = c.getter(line);
      } catch (e) {
        result = undefined;
      }

      if (result && formatter) {
        result = formatter(result);
      }

      if (!result && c.defaultValue) {
        result = c.defaultValue;
      }

      return React.createElement("td", {
        key: i
      }, result);
    })), nestedRows); // TODO: multi-liners
  }

  render() {
    return this.props.rows.length > 0 ? React.createElement("div", {
      id: this.props.title
    }, React.createElement("div", {
      className: "health-record__header"
    }, React.createElement("div", {
      className: "header-title"
    }, this.props.title), React.createElement("div", {
      className: "header-divider"
    })), React.createElement("table", {
      className: "table table-sm table-hover"
    }, React.createElement("thead", {
      id: `p_${this.props.title}_head`
    }, React.createElement("tr", null, this.renderHeaderLine())), React.createElement("tbody", {
      id: `p_${this.props.title}_list`
    }, this.props.rows && this.props.rows.slice().reverse().map(c => this.renderBodyLine(c))))) : null;
  }

}

class ConditionsVisualizer extends GenericVisualizer {}

_defineProperty(ConditionsVisualizer, "defaultProps", {
  title: 'Conditions',
  columns: [{
    title: 'SNOMED',
    versions: '*',
    getter: c => c.code.coding[0].code
  }, {
    title: 'Condition',
    versions: '*',
    getter: c => c.code.coding[0].display
  }, 
  // {
  //   title: 'Date of Onset',
  //   versions: '*',
  //   format: 'date',
  //   getter: c => c.onsetDateTime
  // },
   {
    title: 'Date Resolved',
    'versions': '*',
    format: 'date',
    getter: c => c.abatementDateTime,
    defaultValue: 'N/A'
  }],
  keyFn: c => c.id
});

class ObservationsVisualizer extends GenericVisualizer {}

_defineProperty(ObservationsVisualizer, "defaultProps", {
  title: 'Observations',
  columns: [{
    title: 'LOINC',
    versions: '*',
    getter: o => o.code.coding[0].code
  }, {
    title: 'Observation',
    versions: '*',
    getter: o => o.code.coding[0].display
  }, {
    title: 'Value',
    versions: '*',
    getter: o => obsValue(o)
  }, {
    title: 'Date Recorded',
    'versions': '*',
    format: 'date',
    getter: o => o.effectiveDateTime
  }],
  keyFn: o => o.id
});

class ReportsVisualizer extends GenericVisualizer {}

_defineProperty(ReportsVisualizer, "defaultProps", {
  title: 'Reports',
  columns: [{
    title: 'LOINC',
    versions: '*',
    getter: c => c.code.coding[0].code
  }, {
    title: 'Report/Observation',
    versions: '*',
    getter: c => c.code.coding[0].display
  }, {
    title: 'Value',
    versions: '*',
    getter: () => ''
  }, {
    title: 'Date',
    'versions': '*',
    format: 'date',
    getter: c => c.effectiveDateTime,
    defaultValue: 'N/A'
  }],
  rowClass: 'report-line',
  nestedRows: [{
    getter: rpt => rpt.observations,
    keyFn: o => o.id,
    columns: [{
      title: 'LOINC',
      versions: '*',
      getter: o => o.code.coding[0].code
    }, {
      title: 'Report/Observation',
      versions: '*',
      getter: o => o.code.coding[0].display
    }, {
      title: 'Value',
      versions: '*',
      getter: o => obsValue(o)
    }, {
      title: 'Date',
      versions: '*',
      getter: o => ''
    }]
  }],
  keyFn: r => r.id
});

class MedicationsVisualizer extends GenericVisualizer {}

_defineProperty(MedicationsVisualizer, "defaultProps", {
  title: 'Medications',
  columns: [
  // {
  //   title: 'RxNorm',
  //   versions: '*',
  //   getter: c => c.medicationCodeableConcept.coding[0].code
  // }, 
  {
    title: 'Medication',
    versions: '*',
    getter: c => c.medicationCodableConcept ? c.medicationCodeableConcept.coding[0].display : c.medicationReference.display
  }, {
    title: 'Date Prescribed',
    versions: '*',
    format: 'date',
    getter: c => c.authoredOn
  }, {
    title: 'Status',
    'versions': '*',
    getter: c => c.status
  }],
  keyFn: c => c.id
});

class AllergiesVisualizer extends GenericVisualizer {}

_defineProperty(AllergiesVisualizer, "defaultProps", {
  title: 'Allergies',
  columns: [{
    title: 'SNOMED',
    versions: '*',
    getter: c => c.code.coding[0].code
  }, {
    title: 'Allergy',
    versions: '*',
    getter: c => c.code.coding[0].display
  }, {
    title: 'Date Recorded',
    versions: [R4],
    getter: c => c.recordedDate
  }, {
    title: 'Date Recorded',
    versions: [DSTU2, STU3],
    format: 'date',
    getter: c => c.assertedDate
  }],
  keyFn: c => c.id
});

const goalDescriptionDSTU2 = goal => {
  if (goal.description) return goal.description;
  return '';
};

const goalDescriptionSTU3R4 = goal => {
  if (goal.description) return goal.description.text;
  return '';
};

class CarePlansVisualizer extends GenericVisualizer {}

_defineProperty(CarePlansVisualizer, "defaultProps", {
  title: 'CarePlans',
  columns: [{
    title: 'SNOMED',
    versions: '*',
    getter: c => c.category[0].coding[0].code
  }, {
    title: 'Care Plan',
    versions: '*',
    getter: c => c.category[0].coding[0].display
  }, {
    title: 'Date',
    versions: '*',
    format: 'date',
    getter: c => c.period.start
  }],
  nestedRows: [{
    getter: cp => cp.goals,
    keyFn: g => g.id,
    columns: [{
      title: '',
      versions: '*',
      getter: g => ''
    }, {
      title: 'Goal',
      versions: [DSTU2],
      getter: g => `Goal: ${goalDescriptionDSTU2(g)}`
    }, {
      title: 'Goal',
      versions: [STU3, R4],
      getter: g => `Goal: ${goalDescriptionSTU3R4(g)}`
    }, {
      title: '',
      versions: '*',
      getter: g => ''
    }]
  }, {
    getter: cp => cp.activity,
    keyFn: a => Math.random(),
    columns: [{
      title: '',
      versions: '*',
      getter: a => ''
    }, {
      title: 'Activity',
      versions: '*',
      getter: a => `Activity: ${a.detail.code.coding[0].display}`
    }, {
      title: '',
      versions: '*',
      getter: a => ''
    }]
  }],
  keyFn: c => c.id
});

class ProceduresVisualizer extends GenericVisualizer {}

_defineProperty(ProceduresVisualizer, "defaultProps", {
  title: 'Procedures',
  columns: [{
    title: 'SNOMED',
    versions: '*',
    getter: c => c.code.coding[0].code
  }, {
    title: 'Procedure',
    versions: '*',
    getter: c => c.code.coding[0].display
  }, {
    title: 'Date Performed',
    versions: '*',
    format: 'dateTime',
    getter: c => c.performedPeriod.start
  }],
  keyFn: c => c.id
});

class EncountersVisualizer extends GenericVisualizer {}

_defineProperty(EncountersVisualizer, "defaultProps", {
  title: 'Encounters',
  columns: [{
    title: 'SNOMED',
    versions: '*',
    getter: e => e.type[0].coding[0].code
  }, {
    title: 'Encounter',
    versions: '*',
    getter: e => e.type[0].coding[0].display
  }, {
    title: 'Start Time',
    versions: '*',
    format: 'dateTime',
    getter: e => e.period.start
  }, {
    title: 'Duration',
    'versions': '*',
    getter: e => duration(e.period)
  }],
  keyFn: c => c.id
});

class ImmunizationsVisualizer extends GenericVisualizer {}

_defineProperty(ImmunizationsVisualizer, "defaultProps", {
  title: 'Vaccinations',
  columns: [{
    title: 'CVX',
    versions: '*',
    getter: c => c.vaccineCode.coding[0].code
  }, {
    title: 'Vaccine',
    versions: '*',
    getter: c => c.vaccineCode.coding[0].display
  }, {
    title: 'Date Given',
    versions: '*',
    format: 'date',
    getter: c => c.occurrenceDateTime
  }],
  keyFn: c => c.id
});

class BGVisualizer extends GenericVisualizer {}

_defineProperty(BGVisualizer, "defaultProps", {
  title: 'Blood Glucose Summary',
  columns: [{
    title: 'Type',
    versions: '*',
    getter: o => o.code.coding[0].code
  }, {
    title: 'Value',
    versions: '*',
    getter: o => obsValue(o)
  }, {
    title: 'Date Recorded',
    'versions': '*',
    format: 'date',
    getter: o => o.effectiveDateTime
  }],
  keyFn: o => o.id
});

class BPVisualizer extends GenericVisualizer {}

_defineProperty(BPVisualizer, "defaultProps", {
  title: 'Blood Pressure Summary',
  columns: [{
    title: 'Type',
    versions: '*',
    getter: o => o.type
  }, {
    title: 'Value',
    versions: '*',
    getter: o => o.value
  }, {
    title: 'Date Recorded',
    'versions': '*',
    format: 'date',
    getter: o => o.date
  }],
  keyFn: o => o.id
});

export { AllergiesVisualizer, CarePlansVisualizer, ConditionsVisualizer, EncountersVisualizer, ImmunizationsVisualizer, MedicationsVisualizer, ObservationsVisualizer, PatientVisualizer, ProceduresVisualizer, ReportsVisualizer, BPVisualizer, BGVisualizer };
