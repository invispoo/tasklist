import Vue from 'vue';
import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag';

Vue.use(VueApollo)

export const tasklistQuery = gql`
    query {
        getTask @client {
            tasklist {
                taskName
                subtask {
                    subtaskName
                    status
                }
            }
        }
    }
`;

const typeDefs = gql`
    type Subtask {
        subtaskName: String
        status: boolean
    }

    type Task {
        taskName: String
        subtask: [Subtask]
    }

    type Tasklist {
        tasklist: [Task]
    }
`
//генерация рандомных данных для мок-объектов
var casual = require('casual-browserify').ru_RU;

const cache = new InMemoryCache({
});

const apolloClient = new ApolloClient({
  typeDefs,
  cache
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

const tasklist = [];

//генерация рандомного целого числа(первое число диапазона включено, второе нет)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//заполняем массив задач, случайное количество от 1 до 10
function getSub() {
    let subtask = [];
    for (let y = 0; y < getRandomInt(1, 11); y++) {
        subtask.push({
            __typename: 'Subtask',
            subtaskName: casual.sentence,
            status: casual.coin_flip
        })
    }
    return subtask;
}

//заполняем массив заданий, случайное количество от 1 до 3
for (let i = 0; i < getRandomInt(1, 4); i++){
    tasklist.push({
        __typename: 'Task',
        taskName: casual.word,
        subtask: getSub(),
    })
}

//запись результата запроса в кэш apollo
cache.writeQuery({
  query: tasklistQuery,
  data: {
    getTask: {
        __typename: 'Tasklist',
        tasklist: tasklist
    },
  },
});
