const { ethers } = require("ethers");
const ABI = require('./ABI.json')

// Assign the contract address, private key, and provider URL
const YOUR_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const YOUR_PRIVATE_KEY = "YOUR_PRIVATE_KEY"; // Replace with your actual private key
const YOUR_INFURA = "YOUR_INFURA"; // Replace with your URL

async function main() {
    try {
        const provider = new ethers.providers.JsonRpcProvider(YOUR_INFURA);
        const wallet = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);
        
        const contractABI = ABI;
        const otpSystem = new ethers.Contract(YOUR_CONTRACT_ADDRESS, contractABI, wallet);

        const username = "user1";
        const otpSeed = Math.floor(Math.random() * 10000);
        
        console.log(`Registering user: ${username} with OTP seed: ${otpSeed}`);
        const registerTx = await otpSystem.register(username, otpSeed);
        await registerTx.wait();  
        console.log("User registered successfully:", username);


        console.log("Generating OTP...");
        const otpTx = await otpSystem.generateOtp();
        const otp = await otpTx.wait();  
        console.log("Generated OTP:", otp.events[0].args[1].toString());  

        console.log("Authenticating user with generated OTP...");
        const isAuthenticated = await otpSystem.authenticate(otp.events[0].args[1]);
        console.log("Authentication successful:", isAuthenticated);
        
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();