import React from 'react';
import { PanelHeader, Button, Div, Title, Cell, Avatar } from '@vkontakte/vkui';

function Achievements({ achievements, onBack }) {
  const globalAchievements = achievements.filter(a => !a.recipeId);
  const recipeAchievements = achievements.filter(a => a.recipeId);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div>
      <PanelHeader> 
        <Button onClick={onBack} className="back-button">← Назад</Button>
      
        Достижения ({unlockedCount}/{achievements.length})
      </PanelHeader>
      
      <Div>
        <Title level="2" style={{ margin: '16px 0 8px' }}>
          Общие достижения
        </Title>
        
        {globalAchievements.map(achievement => (
          <Cell
            key={achievement.id}
            before={
              <Avatar 
                style={{
                  backgroundColor: achievement.unlocked ? '#4BB34B' : '#E5E5E5',
                  color: achievement.unlocked ? 'white' : '#999'
                }}
              >
                {achievement.icon}
              </Avatar>
            }
            description={achievement.description}
            subtitle={achievement.unlocked ? 'Разблокировано' : 'Не получено'}
            style={{
              opacity: achievement.unlocked ? 1 : 0.6
            }}
          >
            {achievement.title}
          </Cell>
        ))}
        
        {recipeAchievements.length > 0 && (
          <>
            <Title level="2" style={{ margin: '16px 0 8px' }}>
              Достижения по рецептам
            </Title>
            
            {recipeAchievements.map(achievement => (
              <Cell
                key={achievement.id}
                before={
                  <Avatar 
                    style={{
                      backgroundColor: achievement.unlocked ? '#4BB34B' : '#E5E5E5',
                      color: achievement.unlocked ? 'white' : '#999'
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                }
                description={achievement.description}
                subtitle={achievement.unlocked ? 'Разблокировано' : 'Не получено'}
                style={{
                  opacity: achievement.unlocked ? 1 : 0.6
                }}
              >
                {achievement.title}
              </Cell>
            ))}
          </>
        )}
      </Div>
    </div>
  );
}

export default Achievements;