import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.log(`Server started on port 5000`));
  }
  catch (error) {
    console.log(error);
  }
})();
