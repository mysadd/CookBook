import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import bridge from '@vkontakte/vk-bridge';
import { ConfigProvider, AdaptivityProvider } from '@vkontakte/vkui'
 
bridge.send('VKWebAppInit');

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);  