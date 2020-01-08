const app = require('./app');

const PORT = app.get('PORT');

app.listen(PORT, () => console.log(`Server stated on port: ${PORT}`));