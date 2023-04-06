import "dotenv/config";
import express from "express";
import cors from "cors";
import { allowCrossDomain } from "./middlewares";
import { routes } from "./routes";
import { removeSpacesBetweenWords } from "./utils/removeSpacesBetweenWords";
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(allowCrossDomain);
app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Birlik-Service backend launched");
});

// const mockUsers = JSON.parse(await fs.readFile('users.json', {encoding: 'utf8'}));
// const url = `${process.env.BACKEND_URL}/api/users/register`
// for(let i = 0; i < mockUsers.length; i++) {
//   const response = await axios.post(url, {
//     username: mockUsers[i].username,
//     firstName: mockUsers[i].first_name,
//     lastName: mockUsers[i].last_name,
//     password: mockUsers[i].password,
//     email: mockUsers[i].email,
//     phoneNumber: mockUsers[i].phone_number,
//     position: mockUsers[i].employment.title
//   });
//   console.log(response.status)
// }
