import {
  LOGIN,
  GET_COUNTRY_REGION_LIST,
  GET_FUNDING_LIST,
  GET_ROLE_LIST,
  SAVE_FORM_POSITION,
  TEMPEDGE_LIST,
  SAVE_DEPARTMENTS_LIST,
  SAVE_POSITIONS_LIST,
  REMOVE_FROM_POSITIONS_LIST,
  SKILLS_LIST,
  GET_ORG_DEPARTMENT_LIST,
  REMOVE_FROM_DEPARTMENTS_LIST,
  GET_ACTIVITY_LIST,
  GET_OFFICE_LIST,
  VALIDATE_PERSON,
  PERSON_SAVE,
  CLEAR_PROP,
  CLEAR_ERROR_FIELD,
  SET_ERROR_FIELD,
  REMOVE_ERROR_FIELD
} from '../actions/types';

let initialState = {
  login: '',
  errorFields: [],
  lastRemoved: ''
}

export default function(state = initialState, action){
  switch(action.type){
    case LOGIN:
      return{
        ...state,
        login: action.payload
      };
    case GET_COUNTRY_REGION_LIST:
      return{
        ...state,
        country_region_list: action.payload
      };
    case GET_FUNDING_LIST:
      return{
        ...state,
        funding_list: action.payload
      }
    case GET_ROLE_LIST:
      return{
        ...state,
        role_list: action.payload
      }
    case TEMPEDGE_LIST:
      return{
        ...state,
        paginatorList: action.payload
      }
    case SKILLS_LIST:
      return{
        ...state,
        skillsList: action.payload
      }
    case VALIDATE_PERSON:
      return{
        ...state,
        validatePerson: action.payload
      }
    case PERSON_SAVE:
      return{
        ...state,
        savePerson: action.payload
      }
    case GET_ORG_DEPARTMENT_LIST:
      return{
        ...state,
        orgDepartmentList: action.payload
      }
    case GET_OFFICE_LIST:
      return{
        ...state,
        officeList: action.payload
      }
    case SAVE_FORM_POSITION:
      let formPosition = `${action.payload.form}WizardFormTracker`;
      return{
        ...state,
        [formPosition]: action.payload
      }
    case SAVE_DEPARTMENTS_LIST:
      let newListState =  (typeof state.deptList !== "undefined")? state.deptList: [];

      newListState.push(action.payload);
      return{
        ...state,
        deptList: newListState
      }
    case SAVE_POSITIONS_LIST:
      let newState =  (typeof state.deptPosList === "undefined")? []: state.deptPosList;

      if(action.payload === "CLEAR"){
        newState = []
      }else{
        newState.push(action.payload);
      }

      return{
        ...state,
        deptPosList: newState
      }
    case REMOVE_FROM_POSITIONS_LIST:
      let newPosListState = state.deptPosList;
      let posIndex = action.payload;

      if(newPosListState !== undefined){
        if(newPosListState[posIndex] !== undefined){
            newPosListState.splice(posIndex, 1);
        }
      }

      return{
          ...state,
          deptPosList: newPosListState
      }
    case REMOVE_FROM_DEPARTMENTS_LIST:
      let newDeptListState = state.deptList;
      let index = action.payload;

      if(newDeptListState !== undefined){
        if(newDeptListState[index] !== undefined){
          newDeptListState.splice(index, 1);
        }
      }

      return{
        ...state,
        deptList: newDeptListState
      }
    case CLEAR_PROP:
      return{
        ...state,
        [action.payload]: undefined
      }
    case CLEAR_ERROR_FIELD:
      return{
        ...state,
        errorFields: action.payload.errorFields,
        lastRemoved: action.payload.lastRemoved
      }
    case SET_ERROR_FIELD:
      let errorFields = (typeof state.errorFields === 'undefined')? []: [...state.errorFields];
      let error = action.payload;

      if(errorFields.indexOf(error) < 0){
        errorFields.push(error);
      }

      return{
        ...state,
        errorFields: errorFields,
        lastRemoved: ''
      }
    case REMOVE_ERROR_FIELD:
      let errorFieldsArray = (typeof state.errorFields === 'undefined')? []: [...state.errorFields];
      let error_ = action.payload;
      let foundIndex = -1;

      if(Array.isArray(errorFieldsArray)){
        errorFieldsArray.map((errorField, index) => {
          if(errorField === error_){
            foundIndex = index;
          }
        });
      }

      if(foundIndex > -1){
        errorFieldsArray.splice(foundIndex, 1);
      }

      return{
        ...state,
        errorFields: errorFieldsArray,
        lastRemoved: action.payload
      }
    default:
      return state;
  }
}
