"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";

export default function PostThread({userId}: {userId: string}) {
    const pathname = usePathname();
    const router = useRouter();
    
    const form = useForm({
      resolver: zodResolver(ThreadValidation),
      defaultValues: {
        thread: "",
        accountId: userId,
      },
    });
    return (
    <>
      <h1 className='text-slate-50'>Post Thread Form</h1>
    </>
  )
}
