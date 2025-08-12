import React from 'react';
import { Card, Button } from '@vkontakte/vkui';

function Home({ recipes, onRecipeClick, favorites, toggleFavorite, cookedRecipes, markAsCooked }) {
  return (
    <div className="home-container">
      {recipes.map(recipe => (
        <Card key={recipe.id} onClick={() => onRecipeClick(recipe)}>
          <div style={{ padding: 12 }}>
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="recipe-preview-image"
            />
            <h3>{recipe.title}</h3>
            <p>⏱ {recipe.time}</p>
            {cookedRecipes[recipe.id] && <p>Приготовлено: {cookedRecipes[recipe.id]} раз</p>}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(recipe.id);
              }}
              size="s"
              mode={favorites.includes(recipe.id) ? "commerce" : "outline"}
            >
              {favorites.includes(recipe.id) ? '★ В избранном' : '☆ Добавить'}
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                markAsCooked(recipe.id);
              }}
              size="s"
              mode="outline"
              style={{ marginTop: 8 }}
            >
              Приготовил!
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Home;