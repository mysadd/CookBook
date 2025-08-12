import React, { useState, useEffect } from 'react';
import { View, Panel, PanelHeader, Search, Tabs, TabsItem, HorizontalScroll, Button, Div, Snackbar } from '@vkontakte/vkui';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import Achievements from './pages/Achievements';
import recipes from './data/recipes';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';

function App() {
  const [activePanel, setActivePanel] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cookedRecipes, setCookedRecipes] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const savedCooked = JSON.parse(localStorage.getItem('cookedRecipes')) || {};
      const savedAchievements = JSON.parse(localStorage.getItem('achievements')) || [];
      
      setFavorites(savedFavorites);
      setCookedRecipes(savedCooked);
      setUnlockedAchievements(savedAchievements);
      
      // Базовые достижения
      const baseAchievements = [
        {
          id: 'first_cook',
          title: 'Первый блин',
          description: 'Приготовили первое блюдо',
          icon: '🍳',
          unlocked: savedAchievements.includes('first_cook')
        },
        {
          id: 'five_cooked',
          title: 'Начинающий шеф',
          description: 'Приготовили 5 разных блюд',
          icon: '👨‍🍳',
          unlocked: savedAchievements.includes('five_cooked')
        },
        {
          id: 'ten_cooked',
          title: 'Опытный кулинар',
          description: 'Приготовили 10 разных блюд',
          icon: '🏆',
          unlocked: savedAchievements.includes('ten_cooked')
        }
      ];
      
      // Динамические достижения из cookedRecipes
      const dynamicAchievements = Object.keys(savedCooked)
        .flatMap(id => {
          const count = savedCooked[id];
          const recipe = recipes.find(r => r.id === id);
          if (!recipe) return [];
          
          const achievements = [];
          
          if (count >= 5) {
            achievements.push({
              id: `expert_${id}`,
              title: `Эксперт: ${recipe.title}`,
              description: `Приготовили "${recipe.title}" 5+ раз`,
              icon: '👨‍🍳',
              recipeId: id,
              unlocked: savedAchievements.includes(`expert_${id}`)
            });
          }
          
          if (count >= 10) {
            achievements.push({
              id: `master_${id}`,
              title: `Мастер: ${recipe.title}`,
              description: `Приготовили "${recipe.title}" 10+ раз`,
              icon: '🏆',
              recipeId: id,
              unlocked: savedAchievements.includes(`master_${id}`)
            });
          }
          
          return achievements;
        });
      
      setAchievements([...baseAchievements, ...dynamicAchievements]);
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
    }
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'favorites') {
      return matchesSearch && favorites.includes(recipe.id);
    }
    return matchesSearch;
  });

  const showRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setActivePanel('recipe');
    checkFirstCookAchievement();
  };

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const markAsCooked = (recipeId) => {
    try {
      const newCount = (cookedRecipes[recipeId] || 0) + 1;
      const updatedCooked = {
        ...cookedRecipes,
        [recipeId]: newCount
      };
      
      setCookedRecipes(updatedCooked);
      localStorage.setItem('cookedRecipes', JSON.stringify(updatedCooked));
      
      checkCookingAchievements(updatedCooked, recipeId, newCount);
      
      bridge.send("VKWebAppShowSnackbar", {
        text: `Приготовлено! Всего: ${newCount} раз`,
        type: "success"
      });
    } catch (error) {
      console.error('Ошибка при отметке приготовления:', error);
    }
  };

  const checkCookingAchievements = (cooked, recipeId, newCount) => {
    try {
      const cookedIds = Object.keys(cooked);
      const cookedCount = cookedIds.length;
      
      // Проверка базовых достижений
      const achievementsToCheck = [
        { condition: cookedCount === 1, id: 'first_cook' },
        { condition: cookedCount >= 5, id: 'five_cooked' },
        { condition: cookedCount >= 10, id: 'ten_cooked' }
      ];
      
      achievementsToCheck.forEach(({ condition, id }) => {
        if (condition && !unlockedAchievements.includes(id)) {
          unlockAchievement(id);
        }
      });

      // Проверка достижений для конкретного рецепта
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) {
        if (newCount === 5 && !unlockedAchievements.includes(`expert_${recipeId}`)) {
          unlockAchievement(`expert_${recipeId}`, {
            id: `expert_${recipeId}`,
            title: `Эксперт: ${recipe.title}`,
            description: `Приготовили "${recipe.title}" 5 раз`,
            icon: '👨‍🍳',
            recipeId: recipeId
          });
        }
        
        if (newCount === 10 && !unlockedAchievements.includes(`master_${recipeId}`)) {
          unlockAchievement(`master_${recipeId}`, {
            id: `master_${recipeId}`,
            title: `Мастер: ${recipe.title}`,
            description: `Приготовили "${recipe.title}" 10 раз`,
            icon: '🏆',
            recipeId: recipeId
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке достижений:', error);
    }
  };

  const checkFirstCookAchievement = () => {
    if (Object.keys(cookedRecipes).length === 0 && !unlockedAchievements.includes('first_cook')) {
      unlockAchievement('first_cook');
    }
  };

  const unlockAchievement = (id, dynamicAchievement = null) => {
    try {
      if (unlockedAchievements.includes(id)) return;
      
      const updated = [...unlockedAchievements, id];
      setUnlockedAchievements(updated);
      localStorage.setItem('achievements', JSON.stringify(updated));
      
      const achievement = dynamicAchievement || achievements.find(a => a.id === id);
      if (achievement) {
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(null), 3000);
        
        if (dynamicAchievement) {
          setAchievements(prev => [...prev, {...dynamicAchievement, unlocked: true}]);
        } else {
          setAchievements(prev => prev.map(a => 
            a.id === id ? {...a, unlocked: true} : a
          ));
        }
      }
    } catch (error) {
      console.error('Ошибка при разблокировке достижения:', error);
    }
  };

  return (
    <View activePanel={activePanel}>
      <Panel id="home">
        <PanelHeader 
          before={
            <Button 
              mode="tertiary"
              onClick={() => setActivePanel('achievements')}
              className="back-button"
            >
              {achievements.filter(a => a.unlocked).length} 🏆
            </Button>
          }
        >
          Кулинарная книга
        </PanelHeader>
        
        <Search
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск рецептов..."
        />
        
        <Tabs>
          <HorizontalScroll>
            <TabsItem
              selected={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            >
              Все рецепты
            </TabsItem>
            <TabsItem
              selected={activeTab === 'favorites'}
              onClick={() => setActiveTab('favorites')}
            >
              Избранное ({favorites.length})
            </TabsItem>
          </HorizontalScroll>
        </Tabs>
        
        <Home
          recipes={filteredRecipes}
          onRecipeClick={showRecipe}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          cookedRecipes={cookedRecipes}
          markAsCooked={markAsCooked}
        />
      </Panel>
      
      <Panel id="recipe">
        {selectedRecipe && (
          <Recipe
            recipe={selectedRecipe}
            onBack={() => setActivePanel('home')}
            isFavorite={favorites.includes(selectedRecipe.id)}
            toggleFavorite={toggleFavorite}
            markAsCooked={markAsCooked}
            cookedCount={cookedRecipes[selectedRecipe.id] || 0}
          />
        )}
      </Panel>
      
      <Panel id="achievements">
        <Achievements
          achievements={achievements}
          onBack={() => setActivePanel('home')}
        />
      </Panel>
      
      {showAchievement && (
        <Snackbar
          onClose={() => setShowAchievement(null)}
          before={<div style={{ fontSize: 24 }}>{showAchievement.icon}</div>}
        >
          <div>
            <div style={{ fontWeight: 'bold' }}>{showAchievement.title}</div>
            <div>{showAchievement.description}</div>
          </div>
        </Snackbar>
      )}
    </View>
  );
}

export default App;