import React, { useState } from 'react';
import { 
  PanelHeader, 
  Button, 
  Div, 
  FormItem, 
  Input, 
  Textarea, 
  Select, 
  File, 
  FormLayout,
  Text
} from '@vkontakte/vkui';

const AddRecipe = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [category, setCategory] = useState('main');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      bridge.send("VKWebAppShowSnackbar", {
        text: "Введите название рецепта",
        type: "error"
      });
      return;
    }
    
    const newRecipe = {
      id: Date.now().toString(),
      title: title.trim(),
      time: time.trim() || 'Не указано',
      ingredients: ingredients.split('\n').filter(i => i.trim()),
      steps: steps.trim() || 'Не указано',
      category,
      image: imagePreview || 'https://via.placeholder.com/300x200?text=No+Image'
    };
    
    onSave(newRecipe);
  };

  return (
    <>
      <PanelHeader>
        <Button onClick={onCancel}>← Назад</Button>
        Добавить рецепт
      </PanelHeader>
      
      <Div>
        <FormLayout onSubmit={handleSubmit}>
          <FormItem top="Название блюда*" status={title ? 'valid' : 'error'}>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название"
              required
            />
          </FormItem>
          
          <FormItem top="Время приготовления">
            <Input 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Например: 30 минут"
            />
          </FormItem>
          
          <FormItem top="Ингредиенты* (каждый с новой строки)" status={ingredients ? 'valid' : 'error'}>
            <Textarea 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Мука - 200г\nЯйца - 2 шт.\nСоль - щепотка"
              rows={5}
              required
            />
          </FormItem>
          
          <FormItem top="Шаги приготовления*" status={steps ? 'valid' : 'error'}>
            <Textarea 
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Смешать ингредиенты\n2. Поставить в духовку на 30 минут"
              rows={8}
              required
            />
          </FormItem>
          
          <FormItem top="Категория">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'main', label: 'Основное блюдо' },
                { value: 'soup', label: 'Супы' },
                { value: 'salad', label: 'Салаты' },
                { value: 'dessert', label: 'Десерты' },
                { value: 'breakfast', label: 'Завтраки' },
                { value: 'drink', label: 'Напитки' }
              ]}
            />
          </FormItem>
          
          <FormItem top="Изображение (опционально)">
            {imagePreview && (
              <div style={{ marginBottom: 12, textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Предпросмотр" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    borderRadius: 8 
                  }} 
                />
              </div>
            )}
            <File 
              accept="image/*"
              onChange={handleImageChange}
              stretched
            >
              {imagePreview ? 'Заменить изображение' : 'Загрузить изображение'}
            </File>
          </FormItem>
          
          <Text weight="regular" style={{ color: 'var(--text_secondary)', marginBottom: 16 }}>
            * - обязательные поля
          </Text>
          
          <FormItem>
            <Button 
              size="l" 
              stretched 
              mode="commerce" 
              type="submit"
              disabled={!title || !ingredients || !steps}
            >
              Сохранить рецепт
            </Button>
          </FormItem>
          
          <FormItem>
            <Button 
              size="l" 
              stretched 
              mode="secondary"
              onClick={onCancel}
            >
              Отмена
            </Button>
          </FormItem>
        </FormLayout>
      </Div>
    </>
  );
};

export default AddRecipe;