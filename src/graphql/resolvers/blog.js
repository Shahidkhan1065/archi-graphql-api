import { ObjectId } from "bson";
import {error, success} from 'consola';
import {GraphQLUpload} from "graphql-upload";
import {
    mkdirSync,
    existsSync,
    createWriteStream
} from 'fs';
import {
    join,
    parse
} from 'path';


export default {
    Upload : GraphQLUpload,
    Query: {
        getAllBlogs: async (_,__, {db}) => {
            const blogs = await db.collection("blog").find().toArray();
            return blogs;
        },

        getBlogByID: async (_,{id}, {db}) => {
            const blog = await db.collection('blog').findOne({_id: ObjectId(id)});
            return blog;
        }
    },

    Mutation: {
        createNewBlog: async (_, {newBlog}, {db}, info) => {
            try {
                console.log('dkfjdskfjdfk');
                const { createReadStream, filename, mimetype, encoding } = await newBlog.coverImage;
                console.log('CREKD::');
                const stream = createReadStream();
                let {
                    ext,
                    name
                } = parse(filename);
                name = name.replace(/([^a-z0-9 ]+)/gi, '-').replace(' ', '_');

                let serverFile = join(
                    __dirname, `../../uploads/${name}-${Date.now()}${ext}`
                );

                serverFile = serverFile.replace(' ', '_');

                let writeStream = await createWriteStream(serverFile);

                await stream.pipe(writeStream);

                serverFile = `${BASE_URL}${serverFile.split('uploads')[1]}`;

                newBlog.createdAt = newBlog.updatedAt = new Date().toISOString();
                const insertedBlogId = await db.collection("blog").insertOne(newBlog);
                const result = await db.collection('blog').findOne({_id: ObjectId(insertedBlogId.insertedId)})
                return {...result};    
            } catch (error) {
                error({
                    badge: true,
                    message: error.message
                })
            }
            
        },

        editBlogByID: async(_, {id, updatedBlog}, {db}) => {
            try {
                updatedBlog.updatedAt = new Date().toISOString();
                await db.collection("blog").updateOne({_id: ObjectId(id)},{ $set: updatedBlog}, {upsert: true, new: true});
                const result = await db.collection('blog').findOne({_id: ObjectId(id)})
                return result;    
            } catch (error) {
                error({
                    badge: true,
                    message: error.message
                })
            }
        },

        deleteBlogByID: async(_, {id}, {db}) => {
            try {
                let deletedBlog = await db.collection('blog').deleteMany({_id: ObjectId(id)});
                console.log('deletedBlog::',deletedBlog);
                return {    
                    success: true,
                    id: id,
                    message: "Your blogs is deleted.",
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}