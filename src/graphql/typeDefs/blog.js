import { gql } from "apollo-server-core";

export default gql`
    scalar Upload
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
    extend type Query {
        getAllBlogs: [Blog!]!
        getBlogByID(id: ID!): Blog!
    },

    extend type Mutation {
        createNewBlog(newBlog: blogInput! ): Blog!
        deleteBlogByID(id: ID!): BlogNotification!
        editBlogByID(updatedBlog: blogUpdateInput, id: ID!): Blog!
    }

    input blogUpdateInput {
        title: String!
        description: String!
        shortDescription: String!
        coverImage: String!
        metaData: [MetaDataInput!]
    }

    input blogInput {
        title: String!
        description: String!
        shortDescription: String!
        coverImage: Upload!
    }

    input MetaDataInput {
        description: String!
        image: String!
    }

    type MetaData {
        description: String!
        image: String!
    }

    type Blog {
        title: String!
        description: String!
        shortDescription: String!
        metaData: [MetaData!]
        comments: [String!]
        coverImage: File!
        createdAt: String
        updatedAt: String
    }

    type BlogNotification {
        id: ID!
        message: String!
        success: Boolean
    }

    

    
`