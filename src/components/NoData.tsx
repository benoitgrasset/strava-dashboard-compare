import { FC } from 'react';

export const NoData: FC<{ children?: React.ReactNode }> = (props) => {
  return <div>{props.children || 'No data'}</div>;
};
