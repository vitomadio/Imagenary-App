import { UI_START_LOADING, UI_STOP_LOADING, ACTIVITY_ON } from "../actions/actionsTypes";

const initialState = {
  isLoading: false,
  activityOn: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case ACTIVITY_ON: 
    return {
      ...state,
      activityOn:true
      };
    default:
      return state;
  }
};

export default reducer;