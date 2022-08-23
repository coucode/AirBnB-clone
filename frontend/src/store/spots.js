import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/GETSPOTS'
const GET_A_SPOT = 'spots/GETASPOT'
const GET_OWNER_SPOTS = 'spots/GETOWNERSPOTS'

const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots
  }
}

const getASpot = (spot) => {
  return {
    type: GET_A_SPOT,
    spot
  }
}

const getSpotByOwner = (spots) => {
  return {
    type: GET_OWNER_SPOTS,
    spots
  }
}

export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots')
  if (response.ok) {
    const spots = await response.json()
    dispatch(getSpots(spots))
  }
}

export const getOneSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`)
  if (response.ok) {
    const spot = await response.json()
    dispatch(getASpot(spot))
  }
}

export const getOwnerSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')
    const spots = await response.json()
    dispatch(getSpotByOwner(spots))
}

const initialState = {}

const spotReducer = (state = initialState, action) => {  
  switch (action.type) {
    case GET_SPOTS:
      const allSpots = {}
      action.spots.forEach(spot => {
        allSpots[spot.id] = spot;
      })
      let newState = { ...state, allSpots: { ...allSpots } }
      return newState
    case GET_A_SPOT:
      let oneSpot = {...state, spotDetail: action.spot}
      return oneSpot
    case GET_OWNER_SPOTS:
      console.log("STATE", state)
      console.log("ACTION", action)

      const ownerSpots = {}
      action.spots.Spots.forEach(spot => {
        ownerSpots[spot.id] = spot;
      })
      return {...state, ownerSpots: {...ownerSpots}}
    default:
      return state;
  }
}

export default spotReducer;