import express from "express";

import { PORT } from "./config";
import passport from "./config/passport";

import { expressSession } from "./config/express_session";
import apiRoute from "./route";

const app = express();
app.use(express.json());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
