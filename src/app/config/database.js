import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_ADDR;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

/** 
 * Cached connection for MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        if (MONGODB_URI) {
            cached.promise = mongoose.connect(MONGODB_URI, {dbName: 'income'}).then((mongoose) => {
                return mongoose;
            });
        }
    }
    cached.conn = await cached.promise;
    // console.log(cached.conn)
    return cached.conn;
}

export default dbConnect;
