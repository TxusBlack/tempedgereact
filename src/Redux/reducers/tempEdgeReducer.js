import { LOGIN,
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
  CLEAR_PROP
} from '../actions/types';

let initialState = {
  login: ''
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
    case CLEAR_PROP:
      return{
        ...state,
        [action.payload]: undefined
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
    case GET_ACTIVITY_LIST:
        return{
          ...state,
          activityList: action.payload
        }
    default:
      return state;
  }
}
