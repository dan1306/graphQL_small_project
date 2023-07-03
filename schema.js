const {
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType
} = require('graphql')

const axios = require('axios')

// Launch Type

const LaunchType = new GraphQLObjectType({
    name: "Launch",
    fields: () => ({
        flight_number: {
            type: GraphQLInt
        },
        mission_name: {
            type: GraphQLString
        },
        launch_year: {
            type: GraphQLInt
        },
        launch_date_local: {
            type: GraphQLInt
        },
        launch_sucess: {
            type: GraphQLBoolean
        },
        rocket: {
            type: RocketType
        },
    })
})

// RocketType

const RocketType = new GraphQLObjectType({
    name: "Rocket",
    fields: () => ({
        rocket_id: {
            type: GraphQLString
        },
        rocket_name: {
            type: GraphQLString
        },
        rocket_type: {
            type: GraphQLInt
        }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RocketQueryType',
    fields: () => ({
        launches: {
            type: new GraphQLList(LaunchType),
            resolve: (parent, args) => {
                return axios.get('https://api.spacexdata.com/v3/launches')
                    .then(res => res.data)
            }
        },
        launch: {
            type: LaunchType,
            args: {
                flight_number: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                    .then(res => res.data)
            }
        },
        rockets: {
            type: new GraphQLList(RocketType),
            resolve: (parent, args) => {
                return axios.get('https://api.spacexdata.com/v3/rockets')
                    .then(res => res.data)
            }
        },
        rocket: {
            type: LaunchType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                return axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
                    .then(res => res.data)
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQuery
})

module.exports = {
    schema: schema
};