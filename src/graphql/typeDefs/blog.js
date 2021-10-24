import { gql } from "apollo-server-core";

export default gql`
    scalar Upload
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
    extend type Query {
        getAllBlogs: [Blog!]! @isAuth
        getBlogByID(id: ID!): Blog!
    },
    extend type Mutation {
        createNewBlog(newBlog: blogInput! ): Blog!
        deleteBlogByID(id: ID!): BlogNotification!
        editBlogByID(title: String!, description: String!, shortDescription: String!, coverImage: Upload!,image: [Upload!], metaDescription: String!, id: ID!): Blog!
        # editBlogByID(updatedBlog: blogUpdateInput, id: ID!): Blog!
    }
    input blogUpdateInput {
        title: String!
        description: String!
        shortDescription: String!
        coverImage: Upload
        metaData: [MetaDataInput!]
    }
    input blogInput {
        title: String!
        description: String!
        shortDescription: String!
        coverImage: Upload!
    }
    input MetaDataInput {
        metaDescription: String!
        image: Upload!
    }
    type MetaData {
        metaDescription: String!
        image: [String!]
    }
    type Blog {
        title: String!
        description: String!
        shortDescription: String!
        metaData: [MetaData!]
        coverImage: String!
        createdAt: String
        updatedAt: String
    }
    type BlogNotification {
        id: ID!
        message: String!
        success: Boolean
    }
    
    
`