import { render } from '@testing-library/react-native';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders without crashing', () => {
    expect(() => render(<Skeleton width={100} height={20} />)).not.toThrow();
  });

  it('renders with custom width and height', () => {
    expect(() => {
      render(<Skeleton width={100} height={50} />);
    }).not.toThrow();
  });

  it('renders with different variants', () => {
    expect(() => {
      render(<Skeleton width={100} height={20} variant="line" />);
      render(<Skeleton width={100} height={100} variant="rectangle" />);
      render(<Skeleton width={50} height={50} variant="circle" />);
    }).not.toThrow();
  });
});
