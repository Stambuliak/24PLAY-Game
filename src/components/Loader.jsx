import { ProgressBar } from 'react-loader-spinner';
import './loader.css';

export const Loader = () => {
  return (
    <div className="loader-container">
      <ProgressBar
        visible={true}
        height="300"
        width="300"
        color="#4fa94d"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <p className="loader-text">Uploading Characters...</p>
    </div>
  );
};
