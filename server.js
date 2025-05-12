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
    const { capacityRange } = req.query;

    if (!capacityRange) {
      next();
      return;
    }

    const originalData = router.db.get('restaurants').value();
    let filteredData;

    if (capacityRange === 'less_30') {
      filteredData = originalData.filter(restaurant  => Math.min(...restaurant .capacity) <= 30);
    } else if (capacityRange === '30_100') {
      filteredData = originalData.filter(restaurant  => restaurant.capacity.some(cap => cap >= 30 && cap <= 100));
    } else if (capacityRange === 'more_100') {
      filteredData = originalData.filter(restaurant => Math.max(...restaurant.capacity) > 100);
    } else {
      filteredData = originalData;
    }

    // Временная база данных только с отфильтрованными данными
    const tempDb = { restaurants: filteredData };
    const tempRouter = jsonServer.router(tempDb);

    // Удаляем capacityRange, чтобы json-server не пытался его обработать
    delete req.query.capacityRange;

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
      return res.status(400).json({ error: 'Поле users должно быть массивом' });
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


// Затем подключаем основной роутер
server.use(router);

// Подключаем роутер ПОСЛЕ кастомного middleware
server.use(router);


server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});