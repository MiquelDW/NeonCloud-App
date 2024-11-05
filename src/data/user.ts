// server action modules contains server-side logic RPC functions
"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// function that returns logged in user
export async function getLoggedInUser() {
  // retrieve 'userId' of the currently logged in user (same as in db) that's retrieving its active conversations
  const { userId } = auth();

  // retrieve user from db by 'userId' that sends friend request
  const currentUser = getUserById(userId!);
  return currentUser;
}

// function that only verifies if a user exists in db and returns that user
export async function getUserById(userId: string) {
  try {
    if (!userId) return null;

    // get user from db whose id matches the given 'userId'
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) return null;

    return user;
  } catch (err) {
    if (err instanceof Error) {
      // TS now knows that error is of type Error
      console.error(err.message);
    } else {
      // Handle the case where error is not of type Error
      console.error("An unexpected error occurred", err);
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!email) {
      throw new Error("email is required");
    }

    // get first user entry from db whose email matches the given 'email'
    const user = await db.user.findFirst({ where: { email: email } });

    return user;
  } catch (err) {
    if (err instanceof Error) {
      // TS now knows that error is of type Error
      console.error(err.message);
    } else {
      // Handle the case where error is not of type Error
      console.error("An unexpected error occurred", err);
    }
  }
}
