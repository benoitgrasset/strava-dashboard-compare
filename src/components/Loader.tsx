import React from 'react';
import { SpinnerCircular as Spinner } from 'spinners-react';

type Props = {
  color?: string;
  size?: number;
};
const Loader: React.FC<Props> = ({ color = 'white', size = 22 }) => {
  return (
    <Spinner
      thickness={210}
      color={color}
      secondaryColor="transparent"
      size={size}
      speed={160}
      className="loader"
    />
  );
};

export default Loader;
