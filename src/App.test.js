import { render, screen } from '@testing-library/react';
import Home from './screens/Home';

test('renders Todos header', () => {
  render(<Home />);
  const headerElement = screen.getByText(/todos/i);
  expect(headerElement).toBeInTheDocument();
});
