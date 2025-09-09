export default {
  '/api/users': { target: process.env.USER_SERVICE_URL || 'http://localhost:5001' },
  '/api/products':{ target: process.env.PRODUCT_SERVICE_URL||'http://localhost:5002'},
  '/api/order':    { target: process.env.ORDER_SERVICE_URL|| 'http://localhost:5003' },
  '/api/notifications': { target: process.env.NOTIFY_SERVICE_URL    || 'http://localhost:5004' },
  '/api/pay': { target: process.env.PAYMEMT_SERVICE_URL    || 'http://localhost:5005' },
  
};
