"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchThread(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const threadQuerry = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalThreadCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadQuerry.exec();

    const isNext = totalThreadCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}
