import React from 'react';
import { Div } from '@vkontakte/vkui';

function AchievementNotification({ achievement }) {
  if (!achievement) return null;

  return React.createElement(
    Div,
    {
      style: {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: '#4BB34B',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        animation: 'achievementUnlock 0.5s ease-out'
      }
    },
    [
      React.createElement('div', {
        key: 'icon',
        style: { fontSize: '24px', marginRight: '12px' }
      }, achievement.icon),
      React.createElement('div', { key: 'content' }, [
        React.createElement('div', {
          key: 'title',
          style: { fontWeight: 'bold', fontSize: '16px' }
        }, achievement.title),
        React.createElement('div', {
          key: 'desc',
          style: { fontSize: '14px', opacity: 0.9 }
        }, achievement.description)
      ])
    ]
  );
}

export default AchievementNotification;