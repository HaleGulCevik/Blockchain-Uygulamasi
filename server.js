const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); 


const rpcURL = process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(rpcURL);


const privateKey = process.env.PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000'; // Şimdilik yer tutucu
const wallet = new ethers.Wallet(privateKey, provider);


const contractAddress = 'SÖZLEŞMEYİ_YÜKLEYİNCE_ALACAĞIMIZ_ADRES';
const contractABI = [
    "function kayitliVeri() view returns (string)",
    "function veriEkle(string _yeniVeri) public"
];
const contract = new ethers.Contract(contractAddress, contractABI, wallet);


app.get('/api/veri', async (req, res) => {
    try {
        const veri = await contract.kayitliVeri();
        res.json({ veri: veri });
    } catch (error) {
        res.status(500).json({ hata: 'Blockchainden veri okunamadı.' });
    }
});


app.post('/api/veri', async (req, res) => {
    try {
        const { yeniVeri } = req.body;
        const tx = await contract.veriEkle(yeniVeri);
        await tx.wait(); 
        res.json({ mesaj: 'Veri blockchain ağına başarıyla kazındı!', islemHash: tx.hash });
    } catch (error) {
        res.status(500).json({ hata: 'Blockchain ağına veri yazılamadı.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Blockchain API sunucusu ${PORT} portunda çalışıyor`));