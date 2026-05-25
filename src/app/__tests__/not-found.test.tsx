import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  it('renders 404 error code and description', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Circle Out of Bounds')).toBeInTheDocument();
    expect(screen.getByText('RETURN TO DASHBOARD')).toBeInTheDocument();
  });
});
