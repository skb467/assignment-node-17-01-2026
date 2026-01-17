
const mongoose=require('mongoose')

const dbConnection=async()=>{
    try{
       const isConnected=await mongoose.connect(process.env.MONGODB_URL)
       if(isConnected){
        console.log('mongodb connection successfully');
        
       }else{
        console.log('error');
        
       }

    }catch(error){
        console.log(error);
        
    }
}

module.exports=dbConnection


// require('dotenv').config();
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// process.env.DEBUG = 'mongodb-memory-server:*';

// const ConnectDb = async () => {
//     try {
//         let conn;

//         // Check if we are in a test or development environment
//         if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
//             // Connect to MongoDB Memory Server
//             const mongoServer = await MongoMemoryServer.create({
//                 binary: {
//                     version: '4.2.0', // You can try using a stable version like 4.2.0
//                 }
//             });
//             const mongoUri = mongoServer.getUri(); // Get URI for in-memory MongoDB

//             // Connect Mongoose to the in-memory instance
//             conn = await mongoose.connect(mongoUri);

//             console.log('Connected to MongoDB Memory Server');
//         } else {
//             // Connect to the real MongoDB instance (Production)
//             conn = await mongoose.connect(process.env.MONGODB_URL);
//             console.log('Connected to MongoDB ');
//         }

//         return conn;
//     } catch (err) {
//         console.error('Error connecting to database:', err);
//         throw err; // Throw the error to handle it in your app
//     }
// };

// module.exports = ConnectDb;
