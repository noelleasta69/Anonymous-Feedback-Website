import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {} // we can keep this empty becuase is has an optional field and that is the only field it has

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {/*WHAT TO PUT HERE: SEARCH */})
        // console.log("db::, ", db);
        connection.isConnected = db.connections[0].readyState;
        console.log("Db connnected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;

