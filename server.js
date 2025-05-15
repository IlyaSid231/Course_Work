const jsonServer = require('json-server');
// const express = require('express');
const server = jsonServer.create();
const router = jsonServer.router('resources/data.json');
const middlewares = jsonServer.defaults();
const path = require('path');

// Подключаем middleware ДО роутера
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Добавляем middleware для обслуживания статических файлов из директории 'pages'
// server.use(express.static('public'));
// server.use('/css', express.static('css'));
// server.use('/resources', express.static('resources'));
// server.use('/pages', express.static('pages'));
// server.use('/fonts', express.static('fonts'));
// server.use('/js', express.static('js'))
// server.get('/hostServer.json', (req, res) => {
//   res.sendFile(path.join(__dirname, 'hostServer.json'));
// }); //Явное обслуживаение файла

// Кастомный middleware для фильтрации
server.use((req, res, next) => {
  if (req.method === 'GET' && (req.path === '/restaurants' || req.path.startsWith('/restaurants?'))) {
    
    const { capacityRange, favoriteIds, requestedIds, feature, language } = req.query;
    const originalData = router.db.get('restaurants').value();
    let filteredData = originalData;
    
    if (favoriteIds) {
      const favoriteIdsArray = favoriteIds.split(',').map(id => parseInt(id.trim(), 10));
      filteredData = originalData.filter(restaurant => favoriteIdsArray.includes(restaurant.id));
    }

    if (requestedIds) {
      const requestedIdsArray = requestedIds.split(',').map(id => parseInt(id.trim(), 10));
      filteredData = originalData.filter(restaurant => requestedIdsArray.includes(restaurant.id));
    }
    
    if (capacityRange) {
        if (capacityRange === 'less_30') {
        filteredData = originalData.filter(restaurant  => Math.min(...restaurant .capacity) <= 30);
      } else if (capacityRange === '30_100') {
        filteredData = originalData.filter(restaurant  => restaurant.capacity.some(cap => cap >= 30 && cap <= 100));
      } else if (capacityRange === 'more_100') {
        filteredData = originalData.filter(restaurant => Math.max(...restaurant.capacity) > 100);
      } else {
        filteredData = originalData;
      }
    }

    if(feature){
      // filteredData = filteredData.filter(restaurant => restaurant.features.some(f => 
      //   f[language]?.trim().toLowerCase() === feature.trim().toLowerCase()));
      filteredData = filteredData.filter(restaurant =>
        restaurant.features.some(f =>
          f[language].toLowerCase().includes(feature.toLowerCase())
        ));
    }


    // Временная база данных с отфильтрованными данными
    const tempDb = { restaurants: filteredData };
    const tempRouter = jsonServer.router(tempDb);

    // Удаляем capacityRange, favoriteIds, чтобы json-server не пытался его обработать
    delete req.query.capacityRange;
    delete req.query.favoriteIds;
    delete req.query.requestedIds;
    delete req.query.feature;

    res.setHeader('X-Total-Count', filteredData.length);
    
    // Передаём обработку json-server (он сам применит _page и _limit)
    tempRouter.handle(req, res, next);
  } 
  
  else {
    console.log(`${req.method} ${req.path}`);
    next();
  }

});

// Явный обработчик PUT /favorites
server.put('/favorites', (req, res) => {
  try {

    const newFavorites = req.body;

    const isValid = newFavorites.every(item => 
      item.id && item.username && item.restaurantId
    );
    
    if (!isValid) {
      return res.status(400).json({
        error: 'Each item must contain id, userName and restaurantId'
      });
    }

    router.db
      .set('favorites', newFavorites)
      .write();

    res.json(newFavorites);

  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Явный обработчик PUT /requests
server.put('/requests', (req, res) => {
  try {
    const newRequests = req.body;

    // Валидация структуры данных
    const isValid = newRequests.every(request => 
      request.id && 
      request.username && 
      request.restaurantId &&
      request.date &&
      request.contactPhone&&
      request.contactName &&
      (request.question === "" || request.question)
    );
    
    if (!isValid) {
      return res.status(400).json({
       error: 'Each request must contain: id, username, restaurantId, date, contactPhone, contactName'
      });
    }

    router.db
    .set('requests', newRequests)
    .write();

  // Возвращаем обновленные данные
  res.json(newRequests);

  } catch (error) {
    console.error('Error updating requests:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Явный обработчик POST /users
server.post('/users', (req, res) => {
  try {
    const newUsers = req.body;

    if (!Array.isArray(newUsers)) {
      return res.status(400).json({ error: 'field users must be an array' });
    }

    // Валидация структуры данных
    const isValid = newUsers.every(user => 
      user.username &&
      user.password &&
      user.email &&
      user.phone && 
      user.birth_date &&
      user.first_name &&
      user.last_name &&
      user.middle_name &&
      user.role
    );
    
    if (!isValid) {
      return res.status(400).json({
        error: 'Each user must contain: username, password, email, phone, birth_date, first_name, last_name, middle_name'
      });
    }

    router.db
    .set('users', newUsers)
    .write();

  // Возвращаем обновленные данные
  res.json(newUsers);

  } catch (error) {
    console.error('Error updating requests:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

server.post('/restaurants', (req, res) => {
  try {
    const newRestaurant = req.body;

    // Валидация обязательных полей
    const requiredFields = ['id', 'title', 'rating', 'metro', 'capacity', 'address', 'average_price', 'menu_price', 'rent_price', 'images', 'type', 'working_hours', 'phone', 'number_of_halls', 'area'];
    const missingFields = requiredFields.filter(field => !newRestaurant[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Добавление в "базу данных"
    router.db
      .get('restaurants')
      .push(newRestaurant)
      .write();

    res.status(201).json(newRestaurant);

  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Явный обработчик PUT /restaurants/:id (обновление)
server.put('/restaurants/:id', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id, 10);
    const updatedData = req.body;

    // Проверка существования ресторана
    const restaurantExists = router.db
      .get('restaurants')
      .find({ id: restaurantId })
      .value();

    if (!restaurantExists) {
      return res.status(404).json({ error: 'Restaurant not found in server' });
    }

    // Обновление данных
    const updatedRestaurant = router.db
      .get('restaurants')
      .find({ id: restaurantId })
      .assign(updatedData)
      .write();

    res.json(updatedRestaurant);

  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Явный обработчик DELETE /restaurants/:id
server.delete('/restaurants/:id', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id, 10);

    // Проверка существования ресторана
    const restaurant = router.db
      .get('restaurants')
      .find({ id: restaurantId })
      .value();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found in server' });
    }

    // Удаление из "базы данных"
    router.db
      .get('restaurants')
      .remove({ id: restaurantId })
      .write();

    res.status(204).end(); // 204 No Content

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Затем подключаем основной роутер
server.use(router);



server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});