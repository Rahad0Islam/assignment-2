import app from "./app"
import config from "./config/config"
import { initDB } from "./db";


const port = config.port;
app.listen(port, () => {
  initDB();
  console.log(`Server is running on http://localhost:${port}`)
})
