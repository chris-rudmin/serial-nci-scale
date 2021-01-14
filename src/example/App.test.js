import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('renders header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Serial NCI Scale Demo/i);
  expect(linkElement).toBeInTheDocument();
});
