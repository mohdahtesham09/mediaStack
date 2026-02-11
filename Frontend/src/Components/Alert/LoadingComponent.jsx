import { ClipLoader } from "react-spinners";

const LoadingComponent = () => {
  return (
    <div className='flex justify-center items-center'>
      <ClipLoader size={35} color='gray' />
    </div>
  );
};

export default LoadingComponent;
