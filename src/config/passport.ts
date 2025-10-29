import passport, { use } from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../model/userModel";
import { VerifyCallback } from "passport-oauth2";
import jwt from "jsonwebtoken";

dotenv.config();

// Google Strategy Configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        },
        // 👇 Define the async callback with proper TypeScript types
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ): Promise<void> => {
            try {

                console.log("The data recived from google", profile);

                // Check if user already exists
                let user = await User.findOne({ email: profile.emails?.[0]?.value });

                if (!user) {
                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0].value,
                        photo: profile.photos?.[0].value,
                        isVerified: true
                    });
                }

                // Generate JWT token
                const token = jwt.sign(
                    {
                        id: user._id,
                        email: user.email
                    },
                    process.env.JWT_SECRET as string,
                    { expiresIn: '1h' }
                );


                // Passport callback — success
                return done(null, {user,token});
            } catch (error) {
                // Passport callback — error
                return done(error as Error, false);
            }
        }
    )
);

//  Save "who logged in" (by ID)
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Retrieve "who is currently logged in" (full data)
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error as Error, null);
    }
});

export default passport;
