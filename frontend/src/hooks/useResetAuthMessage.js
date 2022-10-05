// Redux
import { reset } from "../slices/authSlice";

export const useResetAuthMessage = (dispatch) => {
    return () => {
        setTimeout(() => {
            dispatch(reset());
        }, 2000)
    }
}