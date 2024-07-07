async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(
    "Deploying contracts with the account:",
    deployer.address
    );

    // Deploy MyToken contract
    const MyToken = await ethers.getContractFactory("MyToken");
    const tokenContract = await MyToken.deploy(deployer.address);
    await tokenContract.deployed();
    console.log("MyToken deployed at:", tokenContract.address);

    // Mint a token to deployer
    const tokenId = 1; // Token ID to be minted
    const mintTx = await tokenContract.safeMint(deployer.address, tokenId);
    await mintTx.wait();
    console.log(`Token with ID ${tokenId} minted to ${deployer.address}`);

    // Calculate minimum starting price
    const discountRate = ethers.utils.parseEther("0.01"); // 0.01 ETH per second
    const duration = 7 * 24 * 60 * 60; // 7 days in seconds
    const minimumStartingPrice = discountRate.mul(duration);

    // Set the starting price above the minimum
    const startingPrice = minimumStartingPrice.add(ethers.utils.parseEther("0.5")); // 0.5 ETH above minimum

    console.log(`Minimum starting price: ${ethers.utils.formatEther(minimumStartingPrice)} ETH`);
    console.log(`Using starting price: ${ethers.utils.formatEther(startingPrice)} ETH`);


    // Deploy DutchAuction contract
    const DutchAuction = await ethers.getContractFactory("dutchAuction");
    const dutchAuctionContract = await DutchAuction.deploy(
        startingPrice,
        discountRate,
        tokenContract.address,
        tokenId
    );
    await dutchAuctionContract.deployed();
    console.log("DutchAuction deployed at:", dutchAuctionContract.address);

    // Transfer the NFT from deployer to the auction contract
    const transferTx = await tokenContract.transferFrom(deployer.address, dutchAuctionContract.address, tokenId);
    await transferTx.wait();
    console.log(`Token with ID ${tokenId} transferred to DutchAuction contract`);

}

//     const MyToken = await ethers.getContractFactory("MyToken");
//     const DutchAuction = await ethers.getContractFactory("dutchAuction");
//     const tokenContract = await MyToken.deploy();
//     const dutchAuctionContract = await DutchAuction.deploy();

//     console.log("tokenContract deployed at:", tokenContract.address);
//     console.log("dutchAuctionContract deployed at:", dutchAuctionContract.address);

//     const mintState = await contract.safeMint();
    
//     console.log("mintState:", mintState);
// }

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

