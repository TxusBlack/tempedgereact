import { LOGIN,
  GET_COUNTRY_REGION_LIST,
  GET_FUNDING_LIST,
  GET_ROLE_LIST,
  SAVE_FORM_POSITION,
  GET_EMPLOYEE_LIST,
  SAVE_POSITIONS_LIST,
  REMOVE_FROM_POSITIONS_LIST
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
    case GET_EMPLOYEE_LIST:
      return{
        ...state,
        employee_list: action.payload
      }
    case SAVE_FORM_POSITION:
      let formPosition = `${action.payload.form}WizardFormTracker`;
      return{
        ...state,
        [formPosition]: action.payload
      }
    case SAVE_POSITIONS_LIST:
      let newState =  (typeof state.deptPosList !== "undefined")? state.deptPosList: [];

      newState.push(action.payload);

      return{
        ...state,
        deptPosList: newState
      }
      case REMOVE_FROM_POSITIONS_LIST:
        let newPosListState =  state.deptPosList;
        let index = action.payload;

        if(newPosListState !== undefined){
          if(newPosListState[index] !== undefined){
            //console.log("index --REMOVE_FROM_POSITIONS_LIST--: ", index);
            //console.log("newPosListState[index]: ", newPosListState[index]);
            newPosListState.splice(index, 1);
            //console.log("newPosListState --AFTER--: ", newPosListState);
          }
        }

        return{
          ...state,
          deptPosList: newPosListState
        }
    default:
      return state;
  }
}
