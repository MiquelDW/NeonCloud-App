import { createUploadthing, type FileRouter } from "uploadthing/next";
// Zod is a TypeScript-first validation library that allows you to define schemas for your data and then validate that data against those schemas. It is often used to validate form data, API responses, or any kind of input that needs to adhere to a specific structure
import { z } from "zod";
import sharp from "sharp";
import db from "@/lib/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // this route will run once an image has been uploaded by the user
  image_file_Uploader: f({
    image: { maxFileSize: "4MB" },
    "application/pdf": { maxFileSize: "1024GB" },
    pdf: { maxFileSize: "1024GB" },
  })
    // define schema where 'imageName' is an optional string property
    // .input() receives user input in the defined shape / schema
    .input(z.object({ imageName: z.string().optional() }))
    // pass in the received 'input' from the user to the middleware
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // destructure the given 'input' from the middleware inside obj 'metadata'
      const { imageName } = metadata.input;

      // fetch the uploaded image from 'uploadThings'
      const res = await fetch(file.url);
      // convert response data into low-level representation of binary data
      // arrayBuffer: use this when working with image, audio, or other non-textual data
      const buffer = await res.arrayBuffer();

      // load the uploaded image inside the buffer using the 'sharp' function
      // extract metadata of the uploaded image from the returned sharp instance
      const imgMetadata = await sharp(buffer).metadata();
      // destructure the width and height from the uploaded image metadata
      const { height, width } = imgMetadata;

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
