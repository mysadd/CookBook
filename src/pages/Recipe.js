import React from 'react';
import { PanelHeader, Button, Div, Title, Text } from '@vkontakte/vkui';

function Recipe({ recipe, onBack, isFavorite, toggleFavorite, markAsCooked, cookedCount = 0 }) {
  if (!recipe) {
    return (
      <div className="recipe-page">
        <PanelHeader>
          <Button onClick={onBack} className="back-button">← Назад</Button>
        
          Рецепт не найден
        </PanelHeader>
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <PanelHeader>
        <Button onClick={onBack} className="back-button">← Назад</Button>
      
        {recipe.title}
      </PanelHeader>
      
      <Div>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-image"
        />
        
        <Title level="2">⏱ {recipe.time}</Title>
        
        <Title level="3">🍴 Ингредиенты:</Title>
        
        <ul className="ingredients">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        
        <Title level="3">👨‍🍳 Приготовление:</Title>
        
        <Text className="steps">{recipe.steps}</Text>
        
        <Button
          size="l"
          mode={cookedCount > 0 ? "commerce" : "outline"}
          onClick={() => markAsCooked(recipe.id)}
          style={{ marginBottom: 16 }}
        >
          {cookedCount > 0 ? `✓ Приготовлено (${cookedCount} раз)` : 'Я приготовил это!'}
        </Button>
        
        {cookedCount >= 5 && (
          <Div style={{ 
            textAlign: 'center',
            margin: '8px 0',
            padding: '8px',
            background: cookedCount >= 10 ? '#e0905e' : '#cf6e32',
            borderRadius: '16px',
            color: 'white'
          }}>
            <Text weight="bold">
              {cookedCount >= 10 
                ? 'Вы Мастер в приготовлении этого блюда!' 
                : 'Вы Эксперт в приготовлении этого блюда!'}
            </Text>
          </Div>
        )}
        
        <Button
          size="l"
          mode={isFavorite ? "commerce" : "outline"}
          onClick={() => toggleFavorite(recipe.id)}
        >
          {isFavorite ? '★ В избранном' : '☆ Добавить в избранное'}
        </Button>
      </Div>
    </div>
  );
}

export default Recipe;