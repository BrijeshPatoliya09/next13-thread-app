"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarding: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to update/create user: ${error.message}`);
  }
}

export async function fetchUser(userId: string): Promise<void> {
  try {
    connectToDB();
    const userData = await User.findOne({ id: userId });
    return userData;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
}

export async function fetchUserPosts(userId: string): Promise<void> {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      })
      .exec();

    return threads;
  } catch (error) {
    console.log(error);

    throw new Error(`Failed to fetch use posts: ${error}`);
  }
}
