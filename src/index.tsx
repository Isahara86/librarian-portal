import { createRoot } from 'react-dom/client';
import Routes from 'routes';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(<Routes />);
} else {
  const rootElement = document.createElement('div');
  rootElement.style.height = '100%';

  document.body.appendChild(rootElement);

  const root = createRoot(rootElement);

  root.render(<Routes />);
}
