const tronwallet = require('./tronwallet')

tronwallet.blockListener((data) => {
  console.log(data)
})

tronwallet.transactionListener((data) => {
  console.log(data)
})

tronwallet.contractEventListener('',(data) => {
  console.log(data)
})

tronwallet.contractLogListener("TEEXEWrkMFKapSMJ6mErg39ELFKDqEs6w3", (data) => {
  console.log(data)
})