import app from "./app"
import { initDB } from "./db";

const port = 3000;
app.listen(port, () => {
  initDB()
  console.log(`Server is running on http://localhost:${port}`)
})
