import { ObjectId } from "bson";
import { error, success } from "consola";
import { GraphQLUpload } from "graphql-upload";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join, parse } from "path";
import { BASE_URL } from "../../config";

export default {
  Upload: GraphQLUpload,
  Query: {
    getAllBlogs: async (_, __, { db }) => {
      const blogs = await db.collection("blog").find().toArray();
      return blogs;
    },

    getBlogByID: async (_, { id }, { db }) => {
      const blog = await db.collection("blog").findOne({ _id: ObjectId(id) });
      return blog;
    },
  },

  Mutation: {
    createNewBlog: async (_, { newBlog }, { db }, info) => {
      try {
        const { createReadStream, filename } = await newBlog.coverImage;
        const stream = createReadStream();
        let { ext, name } = parse(filename);
        name = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");

        // let serverFile = join(
        //   __dirname,
        //   `../../uploads/${name}-${Date.now()}${ext}`
        // );
        let serverFile = join(`uploads/${name}-${Date.now()}${ext}`);
        serverFile = serverFile.replace(" ", "_");

        let writeStream = await createWriteStream(serverFile);

        await stream.pipe(writeStream);

        //serverFile = `${serverFile.split("uploads")[1]}`;
        newBlog.createdAt = newBlog.updatedAt = new Date().toISOString();
        newBlog.coverImage = serverFile;
        const insertedBlogId = await db.collection("blog").insertOne(newBlog);
        const result = await db
          .collection("blog")
          .findOne({ _id: ObjectId(insertedBlogId.insertedId) });
        return { ...result };
      } catch (err) {
        error({
          badge: true,
          message: error.message,
        });
      }
    },

    editBlogByID: async (
      _,
      {
        id,
        title,
        description,
        shortDescription,
        coverImage,
        image,
        metaDescription,
      },
      { db }
    ) => {
      try {
        const { createReadStream, filename } = await coverImage;
        let metaImage_array = new Array();
        image.forEach(async (im) => {
          const { createReadStream: metaReadStream, filename: metaFile } =
            await im;
          const metaStream = metaReadStream();
          let { ext: metaExt, name: metaName } = parse(metaFile);
          metaName = metaName.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");
          let metaServerFile = join(
            `uploads/${metaName}-${Date.now()}${metaExt}`
          );
          metaServerFile = metaServerFile.replace(" ", "_");
          metaImage_array.push(metaServerFile);
          let writeMetaStream = await createWriteStream(metaServerFile);
          await metaStream.pipe(writeMetaStream);
        });

        const stream = createReadStream();

        let { ext, name } = parse(filename);

        name = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");

        let serverFile = join(`uploads/${name}-${Date.now()}${ext}`);

        serverFile = serverFile.replace(" ", "_");

        let writeStream = await createWriteStream(serverFile);

        await stream.pipe(writeStream);

        let metaData = [{
          image: metaImage_array,
          metaDescription,
        }];
        await db
          .collection("blog")
          .updateOne(
            { _id: ObjectId(id) },
            {
              $set: {
                title,
                description,
                shortDescription,
                coverImage: serverFile,
                metaData,
                updatedAt: new Date().toISOString(),
              },
            },
            { upsert: true, new: true }
          );
        const result = await db
          .collection("blog")
          .findOne({ _id: ObjectId(id) });

        return result;
      } catch (err) {
        console.log(err);
        // error({
        //   badge: true,
        //   message: error.message,
        // });
      }
    },

    deleteBlogByID: async (_, { id }, { db }) => {
      try {
        let deletedBlog = await db
          .collection("blog")
          .deleteMany({ _id: ObjectId(id) });
        console.log("deletedBlog::", deletedBlog);
        return {
          success: true,
          id: id,
          message: "Your blogs is deleted.",
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
