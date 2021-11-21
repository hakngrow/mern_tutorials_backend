//console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);

module.exports = {
  url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cp50y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
};
