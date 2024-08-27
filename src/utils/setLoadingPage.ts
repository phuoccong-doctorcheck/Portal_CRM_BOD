
import { changePercentLoading } from "../redux/features/loadingSlice"
import { store } from "../redux/store"


interface IState {
  value: number
}

const setLoadingPage = ({ value }: IState) => {
  store.dispatch(changePercentLoading(value))
}

export default setLoadingPage