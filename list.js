const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const ERC721 = require('./ERC721.json');
const Web3 = require('web3');
fs = require('fs');

require('dotenv').config();

const defaultAxios = axios.create({
    timeout: 3000,
});

let start = 270;

const run = async () => {
    const contractAddress = "0x4b7ef899cbb24689a47a66d3864f57ec13e01b35";
    const rpcURl = process.env.BSC_RPC_URL;
    const web3 = new Web3(rpcURl);
    const contract = new web3.eth.Contract(ERC721, contractAddress);
    
    const totalSupply = await contract.methods.totalSupply().call();

    const r = [];

    // const items = [
    //     25,
    //     36,
    //     39,
    //     65,
    //     73,
    //     81,
    //     92,
    //     95,
    //     97,
    //     118,
    //     120,
    //     129,
    //     142,
    //     143,
    //     165,
    //     169,
    //     181,
    //     203,
    //     205,
    //     209,
    //     231,
    //     233,
    //     244,
    //     246,
    //     248,
    //     249,
    //     250,
    //     251,
    //     252,
    //     253,
    //     254,
    // ];
    
    console.log(`The NFT total supply is ${totalSupply}`);

    for (let i = start; i < totalSupply; i++) {
        const tokenId = i + 1;
        start = i;
        
        try {
            // console.log(`Getting token URI from token #${tokenId}`);
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            console.log(`${tokenId} - ${tokenURI}`);
            const mintedBy = await contract.methods.ownerOf(tokenId).call();

            const text = await contract.methods.getTokenStringConfigParameter(0, tokenId, 1).call();
            const inspiration = (await contract.methods.getTokenUint256ConfigParameter(0, tokenId, 0).call()).toString();
            const probability = (await contract.methods.getTokenUint256ConfigParameter(0, tokenId, 3).call()).toString();
            const place = (await contract.methods.getTokenUint256ConfigParameter(0, tokenId, 4).call()).toString();
            const useRandom = (await contract.methods.getTokenBooleanConfigParameter(0, tokenId, 2).call()).toString();

            const image = `https://gwei.algopainter.art/?text=${encodeURI(text)}&inspiration=${inspiration}&useRandom=${useRandom}&probability=${probability}&wallType=${place}`;

            const payload = {
                image,
                text,
                inspiration,
                useRandom,
                probability,
                place,
                description: 'Recovered',
                amount: '300',
                mintedBy,
            }

            console.log(payload);

            //fs.writeFileSync(__dirname + '/output/recovered/' + tokenId + '.json', JSON.stringify(payload));

            console.log(`Loading JSON from ${tokenURI}`);
            const json = JSON.stringify((await defaultAxios.get(tokenURI)).data);
            fs.writeFileSync(__dirname + '/output/' + tokenId + '.json', json);
        } catch (e) {
            console.log(e);
        }
    }
}

run().then(() => {
    setInterval(() => {
        run();
    }, 3 * 1000);
});