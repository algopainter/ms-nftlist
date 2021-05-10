const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const ERC721 = require('./ERC721.json');
const Web3 = require('web3');

const app = express();
app.use(cors()); 

const port = process.env.PORT || 3000;

const db = {
    'network_1': [],
    'network_3': [],
    'network_5777': [],
    'network_56': [],
};

const defaultAxios = axios.create({
    timeout: 3000,
});

loadAllItems = async (contract, network) => {
    const totalSupply = await contract.methods.totalSupply().call();

    const r = [];
    
    console.log(`The NFT total supply is ${totalSupply}`);

    for (let i = 0; i < totalSupply; i++) {
        const tokenId = i + 1;
        const key = `network_${network}`;
        console.log(`Adding info to db memory ${key}[${i}]`);
        
        if (!db[key][i]) {
            console.log(`Getting token URI from token #${tokenId}`);
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const owner = await contract.methods.ownerOf(tokenId).call();
            console.log(`Loading JSON from ${tokenURI}`);
            
            try {
                const json = (await defaultAxios.get(tokenURI)).data;
                db[key][i] = {
                    ...json,
                    owner,
                    isError: false,
                    tokenURI,
                    tokenId,
                }
            } catch (e) {
                db[key][i] = {
                    tokenURI,
                    owner,
                    isError: true,
                    tokenId,
                    error: e.toString(),
                }
            }
        } else {
            console.log(`There is a cache to ${key}[${i}]`);
        }

        r.push(db[key][i]);
    }

    return r;
}

loadItemsByOwner = async (contract, network, owner) => {
    const r = [];
    const count = await contract.methods.balanceOf(owner).call();
    
    console.log(`The NFT total balance is ${count}`);

    const tokenURIPromisses = [];

    for (let i = 0; i < count; i++) {
        tokenURIPromisses.push(contract.methods.tokenOfOwnerByIndex(owner, i).call())
    }

    const tokenIDs = await Promise.all(tokenURIPromisses);

    for (let i = 0; i < tokenIDs.length; i++) {
        const key = `network_${network}`;
        const tokenId = tokenIDs[i];
        const index = tokenId - 1;
        console.log(`Adding info to db memory ${key}[${index}]`);
        
        if (!db[key][i]) {
            console.log(`Getting token URI from token #${tokenId}`);
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const owner = await contract.methods.ownerOf(tokenId).call();
            console.log(`Loading JSON from ${tokenURI}`);
            
            try {
                const json = (await defaultAxios.get(tokenURI)).data;
                db[key][index] = {
                    ...json,
                    owner,
                    isError: false,
                    tokenURI,
                    tokenId,
                }
            } catch (e) {
                db[key][index] = {
                    tokenURI,
                    owner,
                    isError: true,
                    error: e.toString(),
                    tokenId,
                }
            }
        } else {
            console.log(`There is a cache to ${key}[${index}]`);
        }

        r.push(db[key][index]);
    }

    return r;
}

app.get('/', async (req, res) => {
    try {
        const networks = [];
        networks[3] = process.env.ROPSTEN_RPC_URL;
        networks[1] = process.env.MAINNET_RPC_URL;
        networks[5777] = process.env.GANACHE_RPC_URL;
        networks[56] = process.env.BSC_RPC_URL;

        res.setHeader('Content-Type', 'application/json');

        const { network, contractAddress, owner } = req.query;

        const rpcURl = networks[parseInt(network)];

        console.log(`Connecting to ${rpcURl} and querying the contract ${contractAddress}`);

        const web3 = new Web3(rpcURl);
        const contract = new web3.eth.Contract(ERC721.abi, contractAddress);

        const items = owner ? await loadItemsByOwner(contract, network, owner) : await loadAllItems(contract, network);

        res.send(items);
    } catch (e) {
        console.log(e);
        res.send({ e });
    }
});

app.listen(port, function () {
    console.log('Ready');
});