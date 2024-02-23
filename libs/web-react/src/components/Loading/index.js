import Skeleton from '@mui/material/Skeleton';
const Loading = () => {
  return (
    <div>
      <Skeleton variant="rect" height={30} animation="wave" width={'100%'} />
    </div>
  );
};

export default Loading;
