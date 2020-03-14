import types from '../actions/types';

let initialState = {
  login: '',
  errorFields: [],
  lastRemoved: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        login: action.payload
      };
    case types.LOGOUT:
      return {
        ...state,
        login: action.payload
      };
    case types.GET_COUNTRY_REGION_LIST:
      return {
        ...state,
        country_region_list: action.payload
      };
    case types.GET_FUNDING_LIST:
      return {
        ...state,
        funding_list: action.payload
      };
    case types.GET_ROLE_LIST:
      return {
        ...state,
        role_list: action.payload
      };
    case types.TEMPEDGE_LIST:
      return {
        ...state,
        paginatorList: action.payload
      };
    case types.SKILLS_LIST:
      return {
        ...state,
        skillsList: action.payload
      };
    case types.VALIDATE_PERSON:
      return {
        ...state,
        validatePerson: action.payload
      };
    case types.PERSON_SAVE:
      return {
        ...state,
        savePerson: action.payload
      };
    case types.GET_ORG_DEPARTMENT_LIST:
      return {
        ...state,
        orgDepartmentList: action.payload
      };
    case types.GET_OFFICE_LIST:
      return {
        ...state,
        officeList: action.payload
      };
    case types.CREATE_CLIENT:
      return {
        ...state,
        client: action.payload
      };
    case types.SAVE_FORM_POSITION:
      let formPosition = `${action.payload.form}WizardFormTracker`;
      return {
        ...state,
        [formPosition]: action.payload
      };
    case types.SAVE_DEPARTMENTS_LIST:
      return {
        ...state,
        deptList: action.payload
      };
    case types.SAVE_POSITIONS_LIST:
      return {
        ...state,
        deptPosList: action.payload
      };
    case types.SAVE_TO_POSITIONS_LIST:
      let newState = typeof state.deptPosList === 'undefined' ? [] : state.deptPosList;

      if (action.payload === 'CLEAR') {
        newState = [];
      } else {
        newState.push(action.payload);
      }

      return {
        ...state,
        deptPosList: newState
      };
    case types.REMOVE_FROM_POSITIONS_LIST:
      let newPosListState = state.deptPosList;
      let posIndex = action.payload;

      if (newPosListState !== undefined) {
        if (newPosListState[posIndex] !== undefined) {
          newPosListState.splice(posIndex, 1);
        }
      }

      return {
        ...state,
        deptPosList: newPosListState
      };
    case types.REMOVE_FROM_DEPARTMENTS_LIST:
      let newDeptListState = state.deptList;
      let index = action.payload;

      if (newDeptListState !== undefined) {
        if (newDeptListState[index] !== undefined) {
          newDeptListState.splice(index, 1);
        }
      }

      return {
        ...state,
        deptList: newDeptListState
      };
    case types.CLEAR_PROP:
      return {
        ...state,
        [action.payload]: undefined
      };
    case types.CLEAR_ERROR_FIELD:
      return {
        ...state,
        errorFields: action.payload.errorFields,
        lastRemoved: action.payload.lastRemoved
      };
    case types.SET_ERROR_FIELD:
      let errorFields = typeof state.errorFields === 'undefined' ? [] : [...state.errorFields];
      let error = action.payload;

      if (errorFields.indexOf(error) < 0) {
        errorFields.push(error);
      }

      return {
        ...state,
        errorFields: errorFields,
        lastRemoved: ''
      };
    case types.REMOVE_ERROR_FIELD:
      let errorFieldsArray = typeof state.errorFields === 'undefined' ? [] : [...state.errorFields];
      let error_ = action.payload;
      let foundIndex = -1;

      if (Array.isArray(errorFieldsArray)) {
        errorFieldsArray.map((errorField, index) => {
          if (errorField === error_) {
            foundIndex = index;
          }
        });
      }

      if (foundIndex > -1) {
        errorFieldsArray.splice(foundIndex, 1);
      }

      return {
        ...state,
        errorFields: errorFieldsArray,
        lastRemoved: error_
      };
    case types.SAVE_BILL_RATE:
      return {
        ...state,
        billRate: action.payload
      };
    case types.SAVE_OT_BILL_RATE:
      return {
        ...state,
        otBillRate: action.payload
      };
    case types.GET_ACTIVITY_LIST:
      return {
        ...state,
        errorFields: errorFieldsArray,
        lastRemoved: action.payload
      };
    case types.GET_SALESMAN_LIST:
      return {
        ...state,
        salesmanList: action.payload
      };
    case types.SAVE_EMPLOYEE_LIST:
      return {
        ...state,
        saveEmployeeList: action.payload
      };
    case types.CHANGE_PASSWORD:
      return {
        ...state,
        changePassword: action.payload
      };
    default:
      return state;
  }
}
