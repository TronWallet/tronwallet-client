const SubClient = require('subscriptions-transport-ws')
const ApClient = require('apollo-client')
const apolloLinkWs = require('apollo-link-ws')
const apolloCache = require('apollo-cache-inmemory')
const ws = require('ws')
const gql = require('graphql-tag')


const GRAPHQL_ENDPOINT = 'tcp://localhost:3031/subscriptions';

const client = new SubClient.SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
}, ws);

const wsLink = new apolloLinkWs.WebSocketLink(client);

const apolloClient = new ApClient.ApolloClient({
    link: wsLink,
    cache: new apolloCache.InMemoryCache(),
});

const blockListener = (handler) => {
  apolloClient.subscribe({
    query: gql`
      subscription block{
        eventsTopicBlock{
          timeStamp
          triggerName
          blockNumber
          blockHash
          transactionSize
          latestSolidifiedBlockNumber
          transactionList
        }
      }`,
    variables: {}
  }).subscribe({
    next (data) {
      handler(data)
    }
  });
}

const transactionListener = (handler) => {
  apolloClient.subscribe({
    query: gql`
      subscription transaction{
        eventsTopicTransaction{
          timeStamp
          triggerName
          transactionId
          blockHash
          blockNumber
          energyUsage
          energyFee
          originEnergyUsage
          energyUsageTotal
          netUsage
          netFee
          result
          contractAddress
          contractType
          feeLimit
          contractCallValue
          contractResult
          fromAddress
          toAddress
          assetName
          assetAmount
          latestSolidifiedBlockNumber
          internalTrananctionList
        }
      }`,
    variables: {}
  }).subscribe({
    next (data) {
      handler(data)
    }
  });
}

const contractEventListener = (contractAddress = '', handler) => {
  apolloClient.subscribe({
    query: gql`
      subscription contractEvent($contractAddress: String){
        eventsTopicContractEvent(contractAddress: $contractAddress){
          timeStamp
          triggerName
          uniqueId
          transactionId
          contractAddress
          callerAddress
          originAddress
          creatorAddress
          blockNumber
          removed
          latestSolidifiedBlockNumber
          logInfo
          rawData
          abi
          eventSignature
          eventSignatureFull
          eventName
          topicMap
          dataMap
        }
      }`,
    variables: { contractAddress }
  }).subscribe({
    next (data) {
      handler(data)
    }
  });
}

const contractLogListener = (contractAddress = '', handler) => {
  apolloClient.subscribe({
    query: gql`
      subscription contractLog($contractAddress: String){
        eventsTopicContractLog(contractAddress: $contractAddress){
          timeStamp
          triggerName
          uniqueId
          transactionId
          contractAddress
          callerAddress
          originAddress
          creatorAddress
          blockNumber
          removed
          latestSolidifiedBlockNumber
          topicList
          data
        }
      }`,
    variables: { contractAddress }
  }).subscribe({
    next (data) {
      handler(data)
    }
  });
}

module.exports = {
  blockListener,
  transactionListener,
  contractEventListener,
  contractLogListener
}