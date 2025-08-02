import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

import { prisma } from "../db/prisma";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (err) {
        console.error("LocalStrategy Error:", err);
        return done(err);
      }
    },
  ),
);

// セッションストアへの保存
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// セッションストアからの取得・ユーザーデータの復元
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      done(null, false);
    }
    done(null, user);
  } catch (err) {
    console.error("DeserializeUser Error:", err);
    done(err);
  }
});

export default passport;
