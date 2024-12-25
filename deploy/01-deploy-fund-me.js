// function deployFunc(hre){
//     console.log("hi!")
// }
// module.exports.default=deployFunc

const{networkconfig, developmentChains}=require("../help-hardhat-config")
const{network,deployments,getNamedAccounts}=require("hardhat")
require("dotenv").config()
const{deployer}=getNamedAccounts();
const{verify}=require("../utils/verify")

module.exports=async({getNamedAccounts,deployments})=>{
    const {deploy, log}=deployments
    const{deployer}=await getNamedAccounts()
    const chainId  =network.config.chainId

   // const ethUsdPriceFeedAddress=networkconfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator= await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress=ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress=networkconfig[chainId]["ethUsdPriceFeed"]
    }

    const args=[ethUsdPriceFeedAddress]
    const fundme=await deploy("FundMe",{
        from:deployer,
        args:args,
        log:true,
    })

    if(!developmentChains.includes(network.name)&&process.env.ETHERSCAN_API_KEY){
        //verify
        verify(fundme.address,args)
    }
    log("-------------------------------------------------------")
}


module.exports.tags=["all","fundme"]
