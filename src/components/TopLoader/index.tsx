import LoadingBar from "react-top-loading-bar";
import { memo } from "react";
import { useAppSelector } from "../../hooks/hooks";


const TopLoader: React.FC = () => {
  const progress = useAppSelector((state) => state.loading.value);
  return (
    <LoadingBar
      waitingTime={500}
      progress={progress}
      // onLoaderFinished={() => dispatch(setToploaderProgress(0))}
      color="#17a2b8"
    />
  );
};

export default memo(TopLoader);