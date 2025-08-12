import React from 'react';
import { Card, Button } from '@vkontakte/vkui';

function Favorites({ favorites, recipes, onRecipeClick, toggleFavorite }) {
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  return React.createElement(
    'div',
    { className: 'home-container' },
    favoriteRecipes.length > 0
      ? favoriteRecipes.map(recipe =>
          React.createElement(
            Card,
            { 
              key: recipe.id,
              className: 'recipe-card',
              onClick: () => onRecipeClick(recipe)
            },
            React.createElement(
          'div', // Заменили ContentCard на div
          { className: 'custom-card' },
          [
            React.createElement('img', {
              key: 'img',
              src: recipe.image,
              alt: recipe.title,
              className: 'recipe-preview-image'
            }),
            React.createElement('div', {
              key: 'content',
              className: 'card-content'
            }, [
              React.createElement('h3', { 
                key: 'title',
                className: 'recipe-title'
              }, recipe.title),
              React.createElement('p', {
                key: 'time',
                className: 'recipe-time'
              }, `⏱ ${recipe.time}`),
              React.createElement(Button, {
                key: 'btn',
                mode: favorites.includes(recipe.id) ? "commerce" : "outline",
                onClick: (e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe.id);
                },
                size: "s",
                children: favorites.includes(recipe.id) ? '★ В избранном' : '☆ Добавить'
              })
            ])
          ])
        ))
      : React.createElement('div', { className: 'empty' }, 'Нет избранных рецептов')
  );
}

export default Favorites;