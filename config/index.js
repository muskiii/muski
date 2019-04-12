module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'aspen', 
  MONGODB_URI: "mongodb://admin:mongaso1234@ds229826.mlab.com:29826/rateapi-desa"
};
  
