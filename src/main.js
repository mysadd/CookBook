import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.js';
import '@vkontakte/vkui/dist/vkui.css';
import './styles.css';

vkBridge.send('VKWebAppInit');

createRoot(document.getElementById('root')).render(<AppConfig />);

if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
