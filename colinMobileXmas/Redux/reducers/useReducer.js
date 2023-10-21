// reducers/userReducer.js
const initialState = {
  user: null,
  loading: true,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
      }
    case 'LOGOUT_USER':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

export default userReducer
