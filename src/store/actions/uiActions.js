import { UI_START_LOADING, UI_STOP_LOADING, ACTIVITY_ON } from './actionsTypes';

export const uiStartLoading = () => {
    return {
        type: UI_START_LOADING
    };
};

export const uiStopLoading = () => {
    return {
        type: UI_STOP_LOADING
    };
};

export const activityOn = () => {
	return {
		type: ACTIVITY_ON
	};
};