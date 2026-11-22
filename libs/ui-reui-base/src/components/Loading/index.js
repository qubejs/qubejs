import { Skeleton } from '../../reui/ui/skeleton';

const Loading = () => {
  return (
    <div className="sq-loading">
      <Skeleton className="h-[30px] w-full" />
    </div>
  );
};

export default Loading;
